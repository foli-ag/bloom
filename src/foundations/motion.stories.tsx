import { createSignal, For, Show } from "solid-js"
import { expect, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"

const meta = {
  title: "Foundations/Motion",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * Two curves, and the press. Whatever moves or changes color eases on the smooth spring, so the parts of one change
 * arrive together and nothing swings back and forth. What appears by growing pops, once a little past its size. A
 * finger going down is met in 90ms, and the control comes back up on the pop spring when it lifts. Press Lancer to run
 * the two curves side by side.
 */
export const Curves: Story = {
  render: () => <CurvesDemo />,
  play: ({ canvasElement }) => {
    const [smooth, pop] = canvasElement.querySelectorAll<HTMLElement>("[data-dot]")
    // A typo inside `linear()` drops the whole declaration, and the dot would jump with no transition at all
    expect(getComputedStyle(smooth).transitionDuration).toBe("0.45s")
    expect(getComputedStyle(smooth).transitionTimingFunction).toMatch(/^linear\(/)
    expect(getComputedStyle(pop).transitionDuration).toBe("0.49s")
    expect(getComputedStyle(pop).transitionTimingFunction).toMatch(/^linear\(/)

    // What makes motion feel smooth: the smooth curve never passes its end, and the pop one passes it once, by less
    // than 5%, and never swings back below by more than a hair
    const smoothCurve = stops("--ease-smooth")
    expect(Math.max(...smoothCurve)).toBeLessThanOrEqual(1)
    expect(smoothCurve.every((value, index) => index === 0 || value >= smoothCurve[index - 1]!)).toBe(true)
    const popCurve = stops("--ease-pop")
    expect(Math.max(...popCurve)).toBeLessThan(1.05)
    const afterPeak = popCurve.slice(popCurve.indexOf(Math.max(...popCurve)))
    expect(Math.min(...afterPeak)).toBeGreaterThanOrEqual(0.995)
  },
}

/**
 * With reduced motion on, nothing moves and nothing overshoots. Presses do not shrink, the pop spring becomes the
 * smooth one, and colors and fades stay, because they tell the farmer that something happened. The toolbar's Motion
 * switch does the same as the system setting.
 */
export const ReducedMotion: Story = {
  globals: { motion: "reduced" },
  render: () => <CurvesDemo />,
  play: ({ canvasElement }) => {
    const root = getComputedStyle(document.documentElement)
    expect(root.getPropertyValue("--press-scale").trim()).toBe("1")
    expect(root.getPropertyValue("--press-scale-small").trim()).toBe("1")
    expect(root.getPropertyValue("--enter-distance").trim()).toBe("0px")
    const [smooth, pop] = canvasElement.querySelectorAll<HTMLElement>("[data-dot]")
    expect(getComputedStyle(pop).transitionTimingFunction).toBe(getComputedStyle(smooth).transitionTimingFunction)
  },
}

/**
 * What opens and closes runs on transitions (`presence-overlay`, `presence-sheet`, `presence-fade`), so a change of mind
 * half way turns it round from where it is. Press Ouvrir, then Fermer before the panel has finished appearing: it fades
 * back from where it got to. A keyframe exit would start from the open look, and the panel would flash fully open first.
 */
export const Presence: Story = {
  render: () => <PresenceDemo />,
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole("button", { name: "Ouvrir" })
    toggle.click()
    const panel = await waitFor(() => {
      const found = canvasElement.querySelector<HTMLElement>("[data-panel]")
      expect(found).not.toBeNull()
      return found!
    })
    const opacity = () => Number(getComputedStyle(panel).opacity)
    // Closed half way through appearing. It goes on rising for the frame the change takes to land, then turns round
    // from there: a keyframe exit would restart from the open look, at 1.
    await waitFor(() => expect(opacity()).toBeGreaterThan(0.2))
    const before = opacity()
    toggle.click()
    await waitFor(() => expect(panel.dataset.state).toBe("closed"))
    let last = opacity()
    expect(last).toBeLessThan(Math.min(before + 0.3, 0.9))
    expect(getComputedStyle(panel).pointerEvents).toBe("none")
    // From there it only fades, and it leaves once the exit has played
    while (panel.isConnected) {
      const now = opacity()
      expect(now).toBeLessThanOrEqual(last + 0.02)
      last = now
      await frame()
    }
    expect(last).toBeLessThan(0.1)
  },
}

/** A panel that mounts as it opens and leaves once its exit has played, as zag's presence does */
function PresenceDemo() {
  const [open, setOpen] = createSignal(false)
  const [present, setPresent] = createSignal(false)
  return (
    <section class="grid max-w-3xl justify-items-start gap-5">
      <Button
        onClick={() => {
          if (!open()) setPresent(true)
          setOpen((value) => !value)
        }}
      >
        Ouvrir
      </Button>
      <Show when={present()}>
        <div
          data-panel
          data-state={open() ? "open" : "closed"}
          onAnimationEnd={() => {
            if (!open()) setPresent(false)
          }}
          class="presence-overlay rounded-card border-2 border-strong bg-raised p-5 shadow-overlay"
        >
          <p class="text-lg font-semibold">Les Grands Champs</p>
          <p class="text-muted">Blé tendre, 12,4 ha</p>
        </div>
      </Show>
    </section>
  )
}

function frame() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

/** The stops of a `linear()` curve token, as the page resolves it */
function stops(token: string): number[] {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token)
  return [...value.matchAll(/-?\d*\.?\d+/g)].map((match) => Number(match[0]))
}

const curves = [
  {
    name: "Smooth",
    use: "A knob, a chevron, a section opening, a color. Never past its end: half way at 80ms, still by 450ms.",
    easing: "var(--ease-smooth)",
    duration: "var(--duration-smooth)",
  },
  {
    name: "Pop",
    use: "A radio's dot, a segment's tick, a control coming back up after a press. Once 4% past its end, then still.",
    easing: "var(--ease-pop)",
    duration: "var(--duration-pop)",
  },
] as const

function CurvesDemo() {
  const [played, setPlayed] = createSignal(false)
  return (
    <section class="grid max-w-3xl gap-5">
      <Button onClick={() => setPlayed((value) => !value)}>Lancer</Button>
      <For each={curves}>
        {(curve) => (
          <div class="grid gap-2">
            <p class="text-lg font-semibold">{curve.name}</p>
            <p class="text-sm text-muted">{curve.use}</p>
            <div class="h-12 rounded-control border-2 border-border bg-raised p-2 [container-type:inline-size]">
              <div
                data-dot
                class="size-7 rounded-full bg-primary"
                style={{
                  translate: played() ? "calc(100cqw - 1.75rem) 0" : "0 0",
                  transition: `translate ${curve.duration} ${curve.easing}`,
                }}
              />
            </div>
          </div>
        )}
      </For>
    </section>
  )
}
