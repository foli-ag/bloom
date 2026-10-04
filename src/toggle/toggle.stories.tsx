import { expect, fn, userEvent, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { settled } from "../foundations/settled.js"
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
 * A filter that stays on until it is pressed again. Pressed, it fills with green and a tick springs in before its words,
 * which slide over to make room. Its props are in the Controls panel.
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
 * A filter that stays on until it is pressed again. Its words stay the same, and a screen reader says "pressed". Not
 * pressed, its words sit in the middle. Pressed, it fills with green and a tick springs in before the words, which slide
 * over so the two sit in the middle together, and the toggle keeps its width.
 */
export const TestTogglesOnClickAndSpace: Story = {
  name: "Test: Toggles on click and Space",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await document.fonts.ready
    const toggle = canvas.getByRole("button", { name: "Parcelles irriguées" })
    expect(toggle).toHaveAttribute("aria-pressed", "false")
    const words = document.createRange()
    // The text itself, without the tick placed before it
    words.selectNodeContents(canvas.getByText("Parcelles irriguées").lastChild!)
    const box = () => toggle.getBoundingClientRect()
    const width = box().width
    const middle = (rect: DOMRect) => rect.left + rect.width / 2
    expect(Math.abs(middle(words.getBoundingClientRect()) - middle(box()))).toBeLessThanOrEqual(1)

    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-pressed", "true")
    expect(args.onPressedChange).toHaveBeenLastCalledWith(true)
    await settled()
    const before = toggle.querySelector("svg")!.getBoundingClientRect().left - box().left
    const after = box().right - words.getBoundingClientRect().right
    expect(Math.abs(before - after)).toBeLessThanOrEqual(1)
    expect(box().width).toBeCloseTo(width, 0)

    await userEvent.keyboard(" ")
    expect(toggle).toHaveAttribute("aria-pressed", "false")
    expect(args.onPressedChange).toHaveBeenLastCalledWith(false)
  },
}

/**
 * With a mark of the app's own while not pressed, such as a plus, a mark always shows before the words, so the two sit in
 * the middle together pressed or not.
 */
export const TestWithAMarkWhileNotPressed: Story = {
  name: "Test: With a mark while not pressed",
  render: (args) => (
    <Toggle.Root {...args}>
      <Toggle.Indicator
        fallback={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3.5"
            stroke-linecap="round"
            class="size-5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        }
      />
      Parcelles irriguées
    </Toggle.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await document.fonts.ready
    const toggle = canvas.getByRole("button", { name: "Parcelles irriguées" })
    const mark = canvasElement.querySelector("[data-part=indicator]")!
    const words = document.createRange()
    words.selectNodeContents(canvas.getByText("Parcelles irriguées").lastChild!)
    // From the toggle's edges to the mark on one side and to the words on the other
    const gaps = () => {
      const box = toggle.getBoundingClientRect()
      return [mark.getBoundingClientRect().left - box.left, box.right - words.getBoundingClientRect().right]
    }
    const [before, after] = gaps()
    expect(Math.abs(before! - after!)).toBeLessThanOrEqual(1)

    await userEvent.click(toggle)
    await settled()
    expect(gaps()).toEqual([before, after])
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
