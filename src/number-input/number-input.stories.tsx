import { Show } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { NumberInput } from "./index.js"

function Dose(props: Partial<NumberInput.RootProps> & { variant?: NumberInput.ControlProps["variant"] }) {
  return (
    <Show when={props.variant === "stepper"} fallback={<Field {...props} />}>
      <Bags {...props} />
    </Show>
  )
}

function Field(props: Partial<NumberInput.RootProps>) {
  return (
    <form class="w-80">
      <NumberInput.Root name="dose" locale="fr-FR" min={0} max={10} step={0.5} {...props}>
        <NumberInput.Label>Dose (L/ha)</NumberInput.Label>
        <NumberInput.Control>
          <NumberInput.Trigger.Decrement as={Button} tone="neutral" variant="outline" aria-label="Moins 0,5">
            −
          </NumberInput.Trigger.Decrement>
          <NumberInput.Input />
          <NumberInput.Trigger.Increment as={Button} tone="neutral" variant="outline" aria-label="Plus 0,5">
            +
          </NumberInput.Trigger.Increment>
        </NumberInput.Control>
      </NumberInput.Root>
    </form>
  )
}

/** A number of bags, counted more than typed: the stepper */
function Bags(props: Partial<NumberInput.RootProps>) {
  return (
    <form class="w-72">
      <NumberInput.Root name="sacs" locale="fr-FR" min={0} max={40} defaultValue="12" {...props}>
        <NumberInput.Label>Sacs de semence</NumberInput.Label>
        <NumberInput.Control variant="stepper">
          <NumberInput.Trigger.Decrement>Un sac de moins</NumberInput.Trigger.Decrement>
          <NumberInput.Input />
          <NumberInput.Trigger.Increment>Un sac de plus</NumberInput.Trigger.Increment>
        </NumberInput.Control>
      </NumberInput.Root>
    </form>
  )
}

const meta = {
  title: "Components/NumberInput",
  component: Dose,
  tags: ["autodocs"],
  args: { onValueChange: fn() },
} satisfies Meta<typeof Dose>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A dose, typed the French way with a comma or stepped with the two buttons on its sides. Its props are in the
 * Controls panel.
 */
export const Playground: Story = {
  args: { name: "dose", min: 0, max: 10, step: 0.5 },
  argTypes: {
    name: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    invalid: { control: "boolean" },
    required: { control: "boolean" },
    variant: { control: "inline-radio", options: ["field", "stepper"] },
  },
}

export const Invalid: Story = {
  args: { defaultValue: "4", invalid: true },
}

export const Disabled: Story = {
  args: { defaultValue: "4", disabled: true },
}

/**
 * `variant="stepper"`: one box with a large − and + of its own at either end, and the value large and centred between
 * them. Each button is named by its words, read by a screen reader. Hold one to keep stepping.
 */
export const Stepper: Story = {
  args: { variant: "stepper" },
}

/** At the minimum the − steps no further: its ground goes, its mark greys and it takes no press */
export const StepperAtTheMinimum: Story = {
  args: { variant: "stepper", defaultValue: "0" },
}

export const StepperInvalid: Story = {
  args: { variant: "stepper", invalid: true },
}

export const StepperDisabled: Story = {
  args: { variant: "stepper", disabled: true },
}

/**
 * Typed the French way, with a comma. The buttons step by half a litre, named by their own words and not by zag's
 * English ones, and the value goes into the form.
 */
export const TestTypingAndStepping: Story = {
  name: "Test: Typing and stepping",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole("spinbutton", { name: "Dose (L/ha)" })
    await userEvent.type(field, "2,5")
    await waitFor(() => expect(field).toHaveAttribute("aria-valuenow", "2.5"))
    expect(field).toBeValid()

    await userEvent.click(canvas.getByRole("button", { name: "Plus 0,5" }))
    await waitFor(() => expect(field).toHaveValue("3"))
    await userEvent.click(canvas.getByRole("button", { name: "Moins 0,5" }))
    await userEvent.click(canvas.getByRole("button", { name: "Moins 0,5" }))
    await waitFor(() => expect(field).toHaveValue("2"))
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ valueAsNumber: 2 }))
    expect(new FormData(canvasElement.querySelector("form")!).get("dose")).toBe("2")
  },
}

/** A dose past the maximum is put back to it when the field loses focus */
export const TestPutBackInRange: Story = {
  name: "Test: Put back in range",
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole("spinbutton")
    await userEvent.type(field, "14")
    await userEvent.tab()
    await waitFor(() => expect(field).toHaveValue("10"))
  },
}

/** The arrow keys step it from the keyboard */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  args: { defaultValue: "4" },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole("spinbutton")
    field.focus()
    await userEvent.keyboard("{ArrowUp}{ArrowUp}{ArrowDown}")
    await waitFor(() => expect(field).toHaveValue("4,5"))
  },
}

/**
 * The stepper's buttons are named by their words. Each press rolls the new number in from the side it moves to, and
 * the − stops at the minimum. Typed digits do not roll.
 */
export const TestCountingWithTheStepper: Story = {
  name: "Test: Counting with the stepper",
  args: { variant: "stepper", defaultValue: "1" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole("spinbutton", { name: "Sacs de semence" })
    const fewer = canvas.getByRole("button", { name: "Un sac de moins" })
    const more = canvas.getByRole("button", { name: "Un sac de plus" })
    expect(field.getAnimations()).toEqual([])

    await userEvent.click(more)
    await waitFor(() => expect(field).toHaveValue("2"))
    // The new number rises from below as it grows, faint at first
    const [, below] = getComputedStyle(field).translate.split(" ")
    expect(Number.parseFloat(below)).toBeGreaterThan(0)
    expect(Number(getComputedStyle(field).opacity)).toBeLessThan(1)
    await settled()

    await userEvent.click(fewer)
    await userEvent.click(fewer)
    await waitFor(() => expect(field).toHaveValue("0"))
    expect(fewer).toBeDisabled()
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ valueAsNumber: 0 }))

    await settled()
    await userEvent.type(field, "{Backspace}7")
    await waitFor(() => expect(field).toHaveValue("7"))
    expect(field.getAnimations()).toEqual([])
    expect(new FormData(canvasElement.querySelector("form")!).get("sacs")).toBe("7")
  },
}

/** The stepper's ring is drawn by its box, inside the edge, while the value has the focus */
export const TestStepperRing: Story = {
  name: "Test: Stepper ring",
  args: { variant: "stepper" },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole("spinbutton")
    await userEvent.tab()
    expect(field).toHaveFocus()
    const ring = getComputedStyle(field.parentElement!)
    expect(ring.outlineStyle).toBe("solid")
    expect(Number.parseFloat(ring.outlineOffset) + Number.parseFloat(ring.outlineWidth)).toBeLessThanOrEqual(0)
  },
}

export const TestStepperInDarkTheme: Story = {
  name: "Test: Stepper in dark theme",
  args: { variant: "stepper", defaultValue: "0" },
  globals: { theme: "dark" },
}

export const TestStepperWithMoreContrast: Story = {
  name: "Test: Stepper with more contrast",
  args: { variant: "stepper", defaultValue: "0" },
  globals: { contrast: "more" },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  args: { defaultValue: "4" },
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  args: { defaultValue: "4" },
  globals: { contrast: "more" },
}
