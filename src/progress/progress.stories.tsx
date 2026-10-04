import { createSignal } from "solid-js"
import { expect, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
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
    // Mount only, and `value` is what moves the bar here
    defaultValue: { table: { disable: true } },
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
    const range = canvasElement.querySelector<HTMLElement>("[data-part=range]")!
    const width = range.getBoundingClientRect().width / bar.clientWidth
    expect(width).toBeCloseTo(0.4, 1)
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
