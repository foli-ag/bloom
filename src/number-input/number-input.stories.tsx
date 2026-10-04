import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { NumberInput } from "./index.js"

function Dose(props: Partial<NumberInput.RootProps>) {
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
  },
}

export const Invalid: Story = {
  args: { defaultValue: "4", invalid: true },
}

export const Disabled: Story = {
  args: { defaultValue: "4", disabled: true },
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
