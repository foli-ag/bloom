import { omit } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { ToggleGroup } from "./index.js"

// Storybook hands args over as a Solid store, and the arrays of a store have no `constructor`, which zag reads when it
// compares values. A plain copy keeps the story what an app writes.
function Periods(props: ToggleGroup.RootProps) {
  return (
    <ToggleGroup.Root
      aria-label="Période"
      {...omit(props, "value", "defaultValue")}
      value={props.value && [...props.value]}
      defaultValue={props.defaultValue && [...props.defaultValue]}
    >
      <ToggleGroup.Item value="jour">Jour</ToggleGroup.Item>
      <ToggleGroup.Item value="semaine">Semaine</ToggleGroup.Item>
      <ToggleGroup.Item value="mois">Mois</ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}

const meta = {
  title: "Components/ToggleGroup",
  component: Periods,
  tags: ["autodocs"],
  args: { onValueChange: fn() },
} satisfies Meta<typeof Periods>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One option at a time, which makes the group a radio group for a screen reader. The pressed segment fills with the
 * primary color and a tick springs in, so it does not rely on color alone. Every segment is as wide as the widest, and
 * none changes width when the choice moves. Arrow keys move between segments.
 */
export const Default: Story = {
  args: { defaultValue: ["semaine"] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const widths = () => canvas.getAllByRole("radio").map((segment) => segment.getBoundingClientRect().width)
    // Barlow arriving between two measures would change them all
    await document.fonts.ready
    expect(canvas.getByRole("radiogroup", { name: "Période" })).toBeVisible()
    expect(canvas.getByRole("radio", { name: "Semaine" })).toBeChecked()
    const before = widths()
    expect(new Set(before).size).toBe(1)
    await userEvent.click(canvas.getByRole("radio", { name: "Mois" }))
    expect(widths()).toEqual(before)
    expect(canvas.getByRole("radio", { name: "Mois" })).toBeChecked()
    expect(canvas.getByRole("radio", { name: "Semaine" })).not.toBeChecked()
    expect(args.onValueChange).toHaveBeenLastCalledWith({ value: ["mois"] })
    await userEvent.keyboard("{ArrowLeft}")
    // The group moves focus on the next frame
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Semaine" })).toHaveFocus())
  },
}

/** Several can be pressed, and each is announced as a toggle button. */
export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["jour"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Mois" }))
    expect(canvas.getByRole("button", { name: "Jour" })).toHaveAttribute("aria-pressed", "true")
    expect(canvas.getByRole("button", { name: "Mois" })).toHaveAttribute("aria-pressed", "true")
    expect(canvas.getByRole("button", { name: "Semaine" })).toHaveAttribute("aria-pressed", "false")
  },
}

export const Vertical: Story = {
  args: { orientation: "vertical", defaultValue: ["jour"] },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ["jour"] },
}

export const InDarkTheme: Story = {
  globals: { theme: "dark" },
  args: { defaultValue: ["semaine"] },
}

export const WithMoreContrast: Story = {
  globals: { contrast: "more" },
  args: { defaultValue: ["semaine"] },
}
