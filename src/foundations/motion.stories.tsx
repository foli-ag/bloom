import { createSignal, For } from "solid-js"
import { expect } from "storybook/test"
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
