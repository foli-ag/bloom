import { createSignal, For, untrack } from "solid-js"
import { expect, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settings, withSetting } from "../foundations/contrast.js"
import { settled } from "../foundations/settled.js"
import { Progress } from "./index.js"

const percent: Progress.RootProps["translations"] = {
  value: ({ value, percent }) => (value === null ? "Envoi en cours" : `${percent} %`),
}

function Upload(props: Partial<Progress.RootProps>) {
  return (
    <div class="w-80">
      <Progress.Root translations={percent} {...props}>
        <Progress.Label>Envoi des photos</Progress.Label>
        <Progress.ValueText />
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </div>
  )
}

const meta = {
  title: "Components/Progress",
  component: Upload,
  tags: ["autodocs"],
  args: { defaultValue: 40 },
} satisfies Meta<typeof Upload>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A bar named "Envoi des photos" that fills to its value, which shows next to the label. Its props are in the Controls
 * panel: move `value` and the bar follows.
 */
export const Playground: Story = {
  args: { value: 40 },
  argTypes: {
    value: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
    tone: { control: "inline-radio", options: ["primary", "success", "warning", "danger"] },
    segmented: { control: "boolean" },
    // Mount only, and `value` is what moves the bar here
    defaultValue: { table: { disable: true } },
  },
}

const storage: Progress.RootProps["translations"] = {
  value: ({ percent }) => `${percent} %`,
}

/**
 * A meter in each tone, the bar and the ring. The color only backs up the words: the label says what the tone means,
 * and the value carries the tone's mark, so nothing rests on color alone.
 */
export const Tones: Story = {
  render: () => <ToneSamples />,
}

function ToneSamples() {
  const samples = [
    { tone: "primary", label: "Stockage", value: 40, words: "40 %" },
    { tone: "success", label: "Photos envoyées", value: 100, words: "100 % · terminé" },
    { tone: "warning", label: "Stockage presque plein", value: 85, words: "85 %" },
    { tone: "danger", label: "Stockage plein", value: 98, words: "98 %" },
  ] as const
  return (
    <div class="grid w-80 gap-6">
      <For each={samples}>
        {(sample) => (
          <Progress.Root tone={sample.tone} defaultValue={sample.value} translations={storage}>
            <Progress.Label>{sample.label}</Progress.Label>
            <Progress.ValueText>{() => sample.words}</Progress.ValueText>
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        )}
      </For>
      <div class="flex gap-4">
        <For each={samples}>
          {(sample) => (
            <Progress.Root tone={sample.tone} defaultValue={sample.value} translations={storage} class="w-auto">
              <Progress.Circle>
                <Progress.Circle.Track />
                <Progress.Circle.Range />
              </Progress.Circle>
            </Progress.Root>
          )}
        </For>
      </div>
    </div>
  )
}

const steps: Progress.RootProps["translations"] = {
  value: ({ value }) => `Étape ${value ?? 0} sur 5`,
}

/** Discrete progress, "3 of 5": one segment per step, the steps reached filled */
export const Segmented: Story = {
  render: () => (
    <div class="w-80">
      <Progress.Root segmented defaultValue={3} max={5} translations={steps}>
        <Progress.Label>Inscription</Progress.Label>
        <Progress.ValueText>{({ value }) => `${value} / 5`}</Progress.ValueText>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </div>
  ),
}

/** A sign-up whose steps the app moves, with a tone the app can set too */
function SignUp(props: { tone?: Progress.Tone; start?: number }) {
  const [step, setStep] = createSignal(untrack(() => props.start) ?? 0)
  return (
    <div class="grid w-80 gap-4">
      <Progress.Root segmented tone={props.tone} value={step()} max={5} translations={steps}>
        <Progress.Label>Inscription</Progress.Label>
        <Progress.ValueText>{({ value }) => `${value} / 5`}</Progress.ValueText>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <div class="flex gap-2">
        <Button tone="neutral" variant="outline" onClick={() => setStep(0)}>
          Début
        </Button>
        <Button tone="neutral" variant="outline" onClick={() => setStep((count) => Math.min(count + 1, 5))}>
          Suivante
        </Button>
        <Button tone="neutral" variant="outline" onClick={() => setStep(5)}>
          Fin
        </Button>
      </div>
    </div>
  )
}

/** The segments of a sign-up, moved by the buttons under it, for filming and trying */
export const SegmentedSteps: Story = {
  render: () => <SignUp />,
}

/** The changing segments, in the order their fills start */
function startOrder(canvasElement: HTMLElement) {
  const fills = [...canvasElement.querySelectorAll<HTMLElement>("[data-part=range] > span > span")]
  return fills
    .map((fill, index) => {
      const transition = fill.getAnimations().find((animation) => animation.playState === "running")
      return transition ? { index, delay: Number(transition.effect?.getTiming().delay ?? 0) } : undefined
    })
    .filter((entry) => entry !== undefined)
}

/**
 * The bar has one segment per step, named as one bar by its label and saying "Étape 3 sur 5". Reaching the end at once
 * fills the steps still empty one after the other, from the start, each a little after the one before it. Going back
 * to the start empties them from the end. Nothing moved as the bar first showed.
 */
export const TestSegmentsFillOneByOne: Story = {
  name: "Test: Segments fill one by one",
  render: () => <SignUp start={3} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const bar = canvas.getByRole("progressbar", { name: "Inscription" })
    expect(bar).toHaveAttribute("aria-valuetext", "Étape 3 sur 5")
    const segments = canvasElement.querySelectorAll("[data-part=range] > span")
    expect(segments).toHaveLength(5)
    expect(document.getAnimations()).toEqual([])
    expect(canvasElement.querySelectorAll("[data-filled]")).toHaveLength(3)

    await userEvent.click(canvas.getByRole("button", { name: "Début" }))
    await waitFor(() => expect(startOrder(canvasElement).length).toBe(3))
    // From the end: the third segment first
    const emptying = startOrder(canvasElement)
    expect(emptying.map((entry) => entry.index)).toEqual([0, 1, 2])
    expect(emptying[2]!.delay).toBe(0)
    expect(emptying[1]!.delay).toBeGreaterThan(0)
    expect(emptying[0]!.delay).toBeGreaterThan(emptying[1]!.delay)
    await settled()

    await userEvent.click(canvas.getByRole("button", { name: "Fin" }))
    await waitFor(() => expect(startOrder(canvasElement).length).toBe(5))
    const delays = startOrder(canvasElement).map((entry) => entry.delay)
    expect(delays[0]).toBe(0)
    expect(delays).toEqual([...delays].sort((a, b) => a - b))
    expect(new Set(delays).size).toBe(5)
    await settled()
    expect(bar).toHaveAttribute("aria-valuetext", "Étape 5 sur 5")
    expect(canvasElement.querySelectorAll("[data-filled]")).toHaveLength(5)
  },
}

/**
 * Sent back to the start while the steps are still filling, the segments on their way turn round at once, where they
 * are, instead of waiting their turn again. Both clocks are slowed down so the change of mind lands half way.
 */
export const TestSegmentsTurnRound: Story = {
  name: "Test: Segments turn round",
  render: () => <SignUp />,
  play: async ({ canvasElement }) => {
    const root = document.documentElement
    root.style.setProperty("--duration-smooth", "6s")
    root.style.setProperty("--duration-exit", "6s")
    try {
      const canvas = within(canvasElement)
      await userEvent.click(canvas.getByRole("button", { name: "Fin" }))
      const [first, second] = canvasElement.querySelectorAll<HTMLElement>("[data-part=range] > span > span")
      if (!first || !second) throw new Error("No segments")
      const width = first.offsetWidth
      // The second segment a fifth of the way in, the first further on
      await waitFor(() => expect(translateOf(second)).toBeGreaterThan(-width * 0.8), { timeout: 4000 })
      expect(second.getAnimations()).not.toEqual([])
      await userEvent.click(canvas.getByRole("button", { name: "Début" }))
      const transition = first.getAnimations().find((animation) => animation.playState === "running")!
      expect(Number(transition.effect?.getTiming().delay)).toBe(0)
      const positions = [translateOf(first)]
      for (let count = 0; count < 5; count++) {
        await new Promise(requestAnimationFrame)
        positions.push(translateOf(first))
      }
      // It heads back at once, from where it was, and never jumps to an end
      expect(positions.at(-1)).toBeLessThan(positions[0]!)
      expect(positions.at(-1)).toBeGreaterThan(-width * 0.99)
    } finally {
      root.style.removeProperty("--duration-smooth")
      root.style.removeProperty("--duration-exit")
    }
  },
}

function translateOf(element: HTMLElement) {
  const value = getComputedStyle(element).translate
  if (value === "none") return 0
  const amount = Number.parseFloat(value)
  // A translate in percent of its own width stays in percent in the computed style
  return value.trim().endsWith("%") ? (amount / 100) * element.offsetWidth : amount
}

type Rgb = readonly [number, number, number]

/** The color a value paints on an element, resolved by the browser, as `Foundations/Colors/Contrast` measures it */
function paint(element: HTMLElement, value: string): Rgb {
  const probe = document.createElement("span")
  probe.style.color = value
  element.append(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const context = canvas.getContext("2d", { willReadFrequently: true })!
  context.fillStyle = resolved
  context.fillRect(0, 0, 1, 1)
  const [red = 0, green = 0, blue = 0] = context.getImageData(0, 0, 1, 1).data
  return [red, green, blue]
}

function contrast(front: Rgb, ground: Rgb) {
  const luminance = (rgb: Rgb) =>
    rgb
      .map((channel) => channel / 255)
      .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))
      .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index]!, 0)
  const [a, b] = [luminance(front), luminance(ground)]
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/**
 * Each tone's fill keeps 3:1 against the empty track and the page in light, dark and more contrast, so how much shows
 * whatever the tone, and the value's words reach 7:1
 */
export const TestTonesKeepTheirContrast: Story = {
  name: "Test: Tones keep their contrast",
  render: () => <ToneSamples />,
  play: async ({ canvasElement }) => {
    await settled()
    const roots = [...canvasElement.querySelectorAll<HTMLElement>("[data-scope=progress][data-part=root]")]
    for (const setting of settings) {
      withSetting(setting, () => {
        for (const root of roots.slice(0, 4)) {
          const fill = paint(root, "var(--progress-fill)")
          const words = paint(root, "var(--progress-text)")
          const where = `${root.textContent} in ${setting.theme}/${setting.contrast}`
          expect(contrast(fill, paint(root, "var(--color-neutral-soft)")), where).toBeGreaterThanOrEqual(3)
          expect(contrast(fill, paint(root, "var(--color-surface)")), where).toBeGreaterThanOrEqual(3)
          expect(contrast(words, paint(root, "var(--color-surface)")), where).toBeGreaterThanOrEqual(7)
        }
      })
    }
  },
}

/** A tone other than primary puts its mark before the value, which a screen reader does not read */
export const TestToneMark: Story = {
  name: "Test: Tone mark",
  render: () => <ToneSamples />,
  play: ({ canvasElement }) => {
    const values = canvasElement.querySelectorAll("[data-part=value-text]")
    expect(values[0]!.querySelector("svg")).toBeNull()
    for (const value of [...values].slice(1)) {
      expect(value.querySelector("[aria-hidden=true] svg")).not.toBeNull()
    }
    expect(within(canvasElement).getByRole("progressbar", { name: "Stockage plein" })).toHaveAttribute(
      "aria-valuetext",
      "98 %",
    )
  },
}

/**
 * The bar is named by its label and says its value in French, "40 %", where zag would name it "40%" alone. The value
 * shows next to the label, and the bar fills to it.
 */
export const TestLabelAndValue: Story = {
  name: "Test: Label and value",
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole("progressbar", { name: "Envoi des photos" })
    expect(bar).toHaveAttribute("aria-valuenow", "40")
    expect(bar).toHaveAttribute("aria-valuetext", "40 %")
    expect(within(canvasElement).getByText("40 %")).toBeVisible()
    await settled()
    // The range spans the bar and slides out from behind its start, so what shows runs from the start to its end
    const range = canvasElement.querySelector<HTMLElement>("[data-part=range]")!
    const start = bar.getBoundingClientRect().left + bar.clientLeft
    expect((range.getBoundingClientRect().right - start) / bar.clientWidth).toBeCloseTo(0.4, 1)
  },
}

/** The app moves the value as photos go out: the bar follows on the smooth spring, and is complete at the end. */
export const TestSending: Story = {
  name: "Test: Sending photos",
  render: () => <Sender />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const bar = canvas.getByRole("progressbar", { name: "Envoi des photos" })
    expect(bar).toHaveAttribute("aria-valuetext", "0 photo sur 4")
    for (let sent = 1; sent <= 4; sent++) {
      canvas.getByRole("button", { name: "Une de plus" }).click()
      await waitFor(() => expect(bar).toHaveAttribute("aria-valuenow", String(sent)))
    }
    expect(bar).toHaveAttribute("aria-valuetext", "4 photos sur 4")
    expect(bar).toHaveAttribute("data-state", "complete")
    expect(canvas.getByText("Envoyées")).toBeVisible()
  },
}

function Sender() {
  const [sent, setSent] = createSignal(0)
  return (
    <div class="grid w-80 gap-4">
      <Progress.Root
        value={sent()}
        max={4}
        translations={{ value: ({ value }) => `${value} photo${(value ?? 0) > 1 ? "s" : ""} sur 4` }}
      >
        <Progress.Label>Envoi des photos</Progress.Label>
        <Progress.ValueText>{({ value }) => `${value} / 4`}</Progress.ValueText>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
        <Progress.View state="complete" class="col-span-2 font-semibold text-primary-text">
          Envoyées
        </Progress.View>
      </Progress.Root>
      <Button tone="neutral" variant="outline" onClick={() => setSent((count) => Math.min(count + 1, 4))}>
        Une de plus
      </Button>
    </div>
  )
}

/**
 * While nobody knows how long it takes, a short piece slides along the bar, and the value text is empty. A screen
 * reader hears the app's own words, "Envoi en cours".
 */
export const TestNotKnown: Story = {
  name: "Test: Value not known",
  args: { defaultValue: null },
  play: ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole("progressbar", { name: "Envoi des photos" })
    expect(bar).not.toHaveAttribute("aria-valuenow")
    expect(bar).toHaveAttribute("aria-valuetext", "Envoi en cours")
    const range = canvasElement.querySelector("[data-part=range]")!
    expect(getComputedStyle(range).animationName).toBe("bloom-progress-slide")
  },
}

/** A ring with the value, the same bar in less room */
export const TestRing: Story = {
  name: "Test: Ring",
  render: () => (
    <Progress.Root defaultValue={75} translations={percent} class="inline-grid grid-cols-[auto_auto]">
      <Progress.Circle size="lg">
        <Progress.Circle.Track />
        <Progress.Circle.Range />
      </Progress.Circle>
      <Progress.Label>Parcelles semées</Progress.Label>
    </Progress.Root>
  ),
  play: async ({ canvasElement }) => {
    const ring = within(canvasElement).getByRole("progressbar", { name: "Parcelles semées" })
    expect(ring.getBoundingClientRect().width).toBe(96)
    expect(ring).toHaveAttribute("aria-valuetext", "75 %")
  },
}

/**
 * Bloom's spinner: a ring with no value turns, and keeps turning under reduced motion, since it is what tells the
 * farmer something is happening. With no label, its name is the app's words.
 */
export const TestSpinner: Story = {
  name: "Test: Spinner",
  globals: { motion: "reduced" },
  render: () => (
    <Progress.Root defaultValue={null} translations={{ value: () => "Chargement des parcelles" }}>
      <Progress.Circle>
        <Progress.Circle.Track />
        <Progress.Circle.Range />
      </Progress.Circle>
    </Progress.Root>
  ),
  play: ({ canvasElement }) => {
    const spinner = within(canvasElement).getByRole("progressbar", { name: "Chargement des parcelles" })
    expect(spinner.getBoundingClientRect().width).toBe(48)
    expect(getComputedStyle(spinner).animationName).toBe("bloom-spin")
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  globals: { contrast: "more" },
}

export const TestRingInDarkTheme: Story = {
  ...TestRing,
  name: "Test: Ring in dark theme",
  globals: { theme: "dark" },
}

export const TestTonesInDarkTheme: Story = {
  name: "Test: Tones in dark theme",
  render: () => <ToneSamples />,
  globals: { theme: "dark" },
  play: settled,
}

export const TestTonesWithMoreContrast: Story = {
  name: "Test: Tones with more contrast",
  render: () => <ToneSamples />,
  globals: { contrast: "more" },
  play: settled,
}

export const TestSegmentedInDarkTheme: Story = {
  ...Segmented,
  name: "Test: Segmented in dark theme",
  globals: { theme: "dark" },
}

/** Under reduced motion each segment fades in where it is, without sliding, still one after the other */
export const TestSegmentedWithReducedMotion: Story = {
  name: "Test: Segmented with reduced motion",
  render: () => <SignUp />,
  globals: { motion: "reduced" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Suivante" }))
    const fill = canvasElement.querySelector<HTMLElement>("[data-part=range] > span > span")!
    expect(getComputedStyle(fill).translate).toMatch(/^(none|0px)$/)
    await waitFor(() => expect(Number(getComputedStyle(fill).opacity)).toBeLessThan(1))
    await settled()
    expect(getComputedStyle(fill).opacity).toBe("1")
  },
}

/** A storage meter whose tone follows how full it is, its label saying the same in words */
function Storage() {
  const [used, setUsed] = createSignal(70)
  const tone = () => (used() >= 95 ? "danger" : used() >= 80 ? "warning" : "primary")
  const words = () => (used() >= 95 ? "Stockage plein" : used() >= 80 ? "Stockage presque plein" : "Stockage")
  return (
    <div class="grid w-80 gap-4">
      <Progress.Root tone={tone()} value={used()} translations={storage}>
        <Progress.Label>{words()}</Progress.Label>
        <Progress.ValueText />
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <div class="flex gap-2">
        <Button tone="neutral" variant="outline" onClick={() => setUsed((value) => Math.max(value - 15, 0))}>
          Libérer
        </Button>
        <Button tone="neutral" variant="outline" onClick={() => setUsed((value) => Math.min(value + 15, 100))}>
          Remplir
        </Button>
      </div>
    </div>
  )
}

/**
 * The tone changes with the value: the bar's color eases across, and the tone's mark pops in before the value, then
 * turns into the next one, and fades out as the meter goes back under the line. The mark there from the start does not
 * move as the page loads.
 */
export const TestToneThatChanges: Story = {
  name: "Test: Tone that changes",
  render: () => <Storage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const value = canvasElement.querySelector("[data-part=value-text]")!
    expect(value.querySelector("svg")).toBeNull()
    await userEvent.click(canvas.getByRole("button", { name: "Remplir" }))
    await waitFor(() => expect(canvas.getByRole("progressbar", { name: "Stockage presque plein" })).toBeVisible())
    const slot = value.querySelector<HTMLElement>("[data-scope=presence]")!
    // It grows into place from smaller, as something that appears does
    expect(slot.getAnimations().map((animation) => (animation as CSSTransition).transitionProperty)).toContain("scale")
    await settled()
    await userEvent.click(canvas.getByRole("button", { name: "Libérer" }))
    await waitFor(() => expect(value.querySelector("[data-scope=presence]")).toBeNull())
  },
}
