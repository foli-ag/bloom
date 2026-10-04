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
 * The needle is a slider named by the label, with the angle and the compass point said together. Its props are in the
 * Controls panel.
 */
export const Playground: Story = {
  args: { step: 5 },
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    invalid: { control: "boolean" },
    step: { control: "number" },
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

/**
 * The needle is a slider named by the label, with the angle and the compass point said together. The arrow keys turn
 * it by 5 degrees, and the value goes into the form.
 */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const needle = canvas.getByRole("slider", { name: "Direction du vent" })
    expect(needle).toHaveAttribute("aria-valuenow", "45")
    expect(needle).toHaveAttribute("aria-valuetext", "45°, Nord-est")

    needle.focus()
    await userEvent.keyboard("{ArrowRight}{ArrowRight}")
    await waitFor(() => expect(needle).toHaveAttribute("aria-valuenow", "55"))
    expect(getComputedStyle(needle).outlineStyle).toBe("solid")
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() => expect(needle).toHaveAttribute("aria-valuenow", "50"))
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 50 }))
    expect(canvas.getByText("50° Nord-est")).toBeVisible()
    expect(new FormData(canvasElement.querySelector("form")!).get("vent")).toBe("50")
  },
}

/**
 * A press on the dial points the needle there: on the right edge is east. The press lands on whatever is under it, as a
 * finger's would, and the needle covering the dial lets it through to the dial. The needle takes focus without a ring,
 * as the ring is for the keyboard.
 */
export const TestPressToPoint: Story = {
  name: "Test: Press to point",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dial = canvasElement.querySelector<HTMLElement>("[data-part=control]")!
    const { right, top, height } = dial.getBoundingClientRect()
    const coords = { clientX: right - 10, clientY: top + height / 2 }
    const target = document.elementFromPoint(coords.clientX, coords.clientY)!
    await userEvent.pointer({ keys: "[MouseLeft]", target, coords })
    await waitFor(() => expect(canvas.getByRole("slider")).toHaveAttribute("aria-valuenow", "90"))
    await waitFor(() =>
      expect(getComputedStyle(canvasElement.querySelector("[data-part=thumb]")!).rotate).toBe("90deg"),
    )
    // Zag focuses the needle after the press, and the ring is the keyboard's alone
    await waitFor(() => expect(canvas.getByRole("slider")).toHaveFocus())
    expect(getComputedStyle(canvas.getByRole("slider")).outlineStyle).toBe("none")
  },
}

/**
 * The needle turns the short way round: from 350° to a press just east of north it goes on through north, by 20°, and
 * not back by 340°.
 */
export const TestTurnsTheShortWayRound: Story = {
  name: "Test: Turns the short way round",
  args: { defaultValue: 350 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dial = canvasElement.querySelector<HTMLElement>("[data-part=control]")!
    const needle = canvasElement.querySelector<HTMLElement>("[data-part=thumb]")!
    const { left, top, width, height } = dial.getBoundingClientRect()
    const radius = width / 2 - 10
    const coords = {
      clientX: left + width / 2 + radius * Math.sin(Math.PI / 18),
      clientY: top + height / 2 - radius * Math.cos(Math.PI / 18),
    }
    await userEvent.pointer({
      keys: "[MouseLeft]",
      target: document.elementFromPoint(coords.clientX, coords.clientY)!,
      coords,
    })
    await waitFor(() => expect(canvas.getByRole("slider")).toHaveAttribute("aria-valuenow", "10"))
    await waitFor(() => expect(getComputedStyle(needle).rotate).toBe("370deg"))
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
