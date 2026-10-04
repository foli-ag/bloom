import { omit, Show } from "solid-js"
import { expect, fn, userEvent, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Slider } from "./index.js"

// Storybook hands args over as a Solid store, and the arrays of a store have no `constructor`, which zag reads when it
// compares values. A plain copy keeps the story what an app writes.
function Moisture(props: Slider.RootProps & { range?: boolean | undefined }) {
  return (
    <Slider.Root
      class="w-80"
      {...omit(props, "value", "defaultValue", "range")}
      value={props.value && [...props.value]}
      defaultValue={props.defaultValue && [...props.defaultValue]}
    >
      <Slider.Label>Humidité du sol</Slider.Label>
      <Slider.ValueText>{(value) => `${value.join(" – ")} %`}</Slider.ValueText>
      <Show when={props.range} fallback={<Slider.Control />}>
        <Slider.Control>
          <Slider.Thumb index={0}>Minimum</Slider.Thumb>
          <Slider.Thumb index={1}>Maximum</Slider.Thumb>
        </Slider.Control>
      </Show>
    </Slider.Root>
  )
}

const meta = {
  title: "Components/Slider",
  component: Moisture,
  tags: ["autodocs"],
  args: { defaultValue: [40], min: 0, max: 100, step: 5, onValueChange: fn() },
} satisfies Meta<typeof Moisture>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The handle is 28px inside a 48px target, grows while dragged, and the value reads out beside the label. Its props
 * are in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    invalid: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    largeStep: { control: "number" },
    origin: { control: "inline-radio", options: ["start", "center", "end"] },
    thumbAlignment: { control: "inline-radio", options: ["contain", "center"] },
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { invalid: true, defaultValue: [95] },
}

/**
 * The handle is 28px inside a 48px target. It grows while dragged and the value reads out beside the label. The
 * arrow keys move it by one step, Page Up and Page Down by ten, Home and End to the ends.
 */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  play: async ({ canvasElement, args }) => {
    const handle = within(canvasElement).getByRole("slider", { name: "Humidité du sol" })
    expect(handle).toHaveAttribute("aria-valuenow", "40")
    handle.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(handle).toHaveAttribute("aria-valuenow", "45")
    expect(within(canvasElement).getByText("45 %")).toBeVisible()
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: [45] }))
    await userEvent.keyboard("{End}")
    expect(handle).toHaveAttribute("aria-valuenow", "100")
  },
}

/** A press anywhere on the line moves the handle there, here to the middle. */
export const TestClickOnTheLine: Story = {
  name: "Test: Click on the line",
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>("[data-part=control]")!
    const { width } = control.getBoundingClientRect()
    const { left, top, height } = control.getBoundingClientRect()
    const at = { clientX: left + width * 0.5, clientY: top + height / 2 }
    await userEvent.pointer([{ keys: "[MouseLeft>]", target: control, coords: at }, { keys: "[/MouseLeft]" }])
    expect(within(canvasElement).getByRole("slider")).toHaveAttribute("aria-valuenow", "50")
  },
}

/**
 * Two handles make a range, and each is named by its own words and then the label: "Minimum, Humidité du sol". The
 * value reads "20 – 70 %", as the app writes it: joined by a comma it would read as twenty point seventy.
 */
export const TestRangeWithTwoHandles: Story = {
  name: "Test: Range with two handles",
  args: { defaultValue: [20, 70], range: true },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole("slider", { name: "Minimum Humidité du sol" })).toHaveAttribute("aria-valuenow", "20")
    expect(canvas.getByRole("slider", { name: "Maximum Humidité du sol" })).toHaveAttribute("aria-valuenow", "70")
    expect(canvas.getByText("20 – 70 %")).toBeVisible()
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
