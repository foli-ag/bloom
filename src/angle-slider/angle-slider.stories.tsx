import { createSignal, For, untrack } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { AngleSlider } from "./index.js"

const points = ["Nord", "Nord-est", "Est", "Sud-est", "Sud", "Sud-ouest", "Ouest", "Nord-ouest"]
const compass = (value: number) => points[Math.round(value / 45) % 8]!

function Wind(props: Partial<AngleSlider.RootProps>) {
  const [value, setValue] = createSignal(untrack(() => props.defaultValue) ?? 45)
  return (
    <form>
      <AngleSlider.Root
        name="vent"
        step={5}
        {...props}
        value={value()}
        onValueChange={(details) => {
          setValue(details.value)
          props.onValueChange?.(details)
        }}
      >
        <AngleSlider.Label>Direction du vent</AngleSlider.Label>
        <AngleSlider.ValueText>{(angle) => `${angle}° ${compass(angle)}`}</AngleSlider.ValueText>
        <AngleSlider.Control>
          <AngleSlider.MarkerGroup>
            <For each={[0, 45, 90, 135, 180, 225, 270, 315]}>{(angle) => <AngleSlider.Marker value={angle} />}</For>
          </AngleSlider.MarkerGroup>
          <AngleSlider.Thumb aria-valuetext={`${value()}°, ${compass(value())}`} />
        </AngleSlider.Control>
        <AngleSlider.HiddenInput />
      </AngleSlider.Root>
    </form>
  )
}

const meta = {
  title: "Components/AngleSlider",
  component: Wind,
  tags: ["autodocs"],
  args: { onValueChange: fn() },
} satisfies Meta<typeof Wind>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The needle is a slider named by the label, with the angle and the compass point said together. The arrow keys turn
 * it by 5 degrees, and the value goes into the form.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const needle = canvas.getByRole("slider", { name: "Direction du vent" })
    expect(needle).toHaveAttribute("aria-valuenow", "45")
    expect(needle).toHaveAttribute("aria-valuetext", "45°, Nord-est")

    needle.focus()
    await userEvent.keyboard("{ArrowRight}{ArrowRight}")
    await waitFor(() => expect(needle).toHaveAttribute("aria-valuenow", "55"))
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() => expect(needle).toHaveAttribute("aria-valuenow", "50"))
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 50 }))
    expect(canvas.getByText("50° Nord-est")).toBeVisible()
    expect(new FormData(canvasElement.querySelector("form")!).get("vent")).toBe("50")
  },
}

/** A press on the dial points the needle there: on the right edge is east */
export const PressToPoint: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dial = canvasElement.querySelector<HTMLElement>("[data-part=control]")!
    const { right, top, height } = dial.getBoundingClientRect()
    await userEvent.pointer({
      keys: "[MouseLeft]",
      target: dial,
      coords: { clientX: right - 10, clientY: top + height / 2 },
    })
    await waitFor(() => expect(canvas.getByRole("slider")).toHaveAttribute("aria-valuenow", "90"))
    expect(getComputedStyle(canvasElement.querySelector("[data-part=thumb]")!).rotate).toBe("90deg")
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const InDarkTheme: Story = {
  globals: { theme: "dark" },
}

export const WithMoreContrast: Story = {
  globals: { contrast: "more" },
}
