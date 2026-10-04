import { expect, fn, userEvent, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Toggle } from "./index.js"

function IrrigatedFilter(props: Partial<Toggle.RootProps>) {
  return (
    <Toggle.Root {...props}>
      <Toggle.Indicator />
      Parcelles irriguées
    </Toggle.Root>
  )
}

const meta = {
  title: "Components/Toggle",
  component: IrrigatedFilter,
  tags: ["autodocs"],
  args: { onPressedChange: fn() },
} satisfies Meta<typeof IrrigatedFilter>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A filter that stays on until it is pressed again. Pressed, it fills with green and a tick springs in where an empty
 * space kept its place. Its props are in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    disabled: { control: "boolean" },
  },
}

export const Pressed: Story = {
  args: { defaultPressed: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledAndPressed: Story = {
  args: { disabled: true, defaultPressed: true },
}

/**
 * A filter that stays on until it is pressed again. Its words stay the same, and a screen reader says "pressed".
 * Pressed, it fills with green and a tick springs in where an empty space kept its place.
 */
export const TestTogglesOnClickAndSpace: Story = {
  name: "Test: Toggles on click and Space",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("button", { name: "Parcelles irriguées" })
    expect(toggle).toHaveAttribute("aria-pressed", "false")
    const words = toggle.lastChild as Text
    const range = document.createRange()
    range.selectNodeContents(words)
    const before = range.getBoundingClientRect().left

    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-pressed", "true")
    expect(args.onPressedChange).toHaveBeenLastCalledWith(true)
    expect(toggle.querySelector("svg")).not.toBeNull()
    expect(range.getBoundingClientRect().left).toBeCloseTo(before, 0)

    await userEvent.keyboard(" ")
    expect(toggle).toHaveAttribute("aria-pressed", "false")
    expect(args.onPressedChange).toHaveBeenLastCalledWith(false)
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  args: { defaultPressed: true },
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  args: { defaultPressed: true },
  globals: { contrast: "more" },
}
