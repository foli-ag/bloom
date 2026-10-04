import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { RatingGroup } from "./index.js"

function Emergence(props: Partial<RatingGroup.RootProps>) {
  return (
    <form class="w-80">
      <RatingGroup.Root
        name="levee"
        count={5}
        translations={{ ratingValueText: (index) => `${index} sur 5` }}
        {...props}
      >
        <RatingGroup.Label>Qualité de la levée</RatingGroup.Label>
        <RatingGroup.Control />
        <RatingGroup.HiddenInput />
      </RatingGroup.Root>
    </form>
  )
}

const meta = {
  title: "Components/RatingGroup",
  component: Emergence,
  tags: ["autodocs"],
  args: { onValueChange: fn() },
} satisfies Meta<typeof Emergence>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A tap on a star gives that mark and fills every star up to it, and the mark goes into the form. Its props are in the
 * Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    allowHalf: { control: "boolean" },
  },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 4 },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 3 },
}

/**
 * A tap on a star gives that mark and fills every star up to it. Each star is named in French by the app, not
 * "3 stars", and the mark goes into the form.
 */
export const TestTapOnAStar: Story = {
  name: "Test: Tap on a star",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole("radiogroup", { name: "Qualité de la levée" })).toBeInTheDocument()
    const four = canvas.getByRole("radio", { name: "4 sur 5" })
    expect(four).not.toHaveAttribute("aria-roledescription")
    const { width, height } = four.getBoundingClientRect()
    expect(Math.min(width, height)).toBeGreaterThanOrEqual(48)

    await userEvent.click(four)
    await waitFor(() => expect(four).toHaveAttribute("aria-checked", "true"))
    expect(args.onValueChange).toHaveBeenLastCalledWith({ value: 4 })
    expect(new FormData(canvasElement.querySelector("form")!).get("levee")).toBe("4")
    expect(canvasElement.querySelectorAll("[data-part=item][data-highlighted]")).toHaveLength(4)
    // Zag focuses the star that took the mark, and a tap leaves no ring on it
    await waitFor(() => expect(four).toHaveFocus())
    expect(getComputedStyle(four).outlineStyle).toBe("none")
  },
}

/** The arrow keys move the mark from the keyboard, and the star that has it shows a ring */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  args: { defaultValue: 2 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const two = canvas.getByRole("radio", { name: "2 sur 5" })
    expect(two).toHaveFocus()
    expect(getComputedStyle(two).outlineStyle).toBe("solid")
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith({ value: 3 }))
  },
}

/** With `allowHalf`, a star can be half filled */
export const TestHalfMarks: Story = {
  name: "Test: Half marks",
  args: { allowHalf: true, defaultValue: 3.5 },
  play: ({ canvasElement }) => {
    expect(canvasElement.querySelectorAll("[data-part=item][data-half]")).toHaveLength(1)
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  args: { defaultValue: 4 },
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  args: { defaultValue: 4 },
  globals: { contrast: "more" },
}
