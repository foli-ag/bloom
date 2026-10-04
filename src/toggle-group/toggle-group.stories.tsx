import { omit } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { settled } from "../foundations/settled.js"
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
 * primary color and a tick springs in, so it does not rely on color alone. Its props are in the Controls panel.
 */
export const Playground: Story = {
  args: { defaultValue: ["semaine"] },
  argTypes: {
    // Only read when the group mounts, so changing it here would do nothing
    defaultValue: { table: { disable: true } },
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
    deselectable: { control: "boolean" },
    loopFocus: { control: "boolean" },
    rovingFocus: { control: "boolean" },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    variant: { control: "inline-radio", options: ["outline", "segmented"] },
  },
}

export const Vertical: Story = {
  args: { orientation: "vertical", defaultValue: ["jour"] },
}

/**
 * A track with a pill behind the chosen option, as on a phone. The pill slides and stretches to the next choice on the
 * smooth spring, and the words keep their color, 7:1 on the pill and on the track alike.
 */
export const Segmented: Story = {
  args: { variant: "segmented", defaultValue: ["semaine"] },
}

export const SegmentedVertical: Story = {
  args: { variant: "segmented", orientation: "vertical", defaultValue: ["mois"] },
}

/** Each pressed option has a pill of its own, which fades in and out where it is */
export const SegmentedSeveral: Story = {
  args: { variant: "segmented", multiple: true, defaultValue: ["jour", "mois"] },
}

export const SegmentedDisabled: Story = {
  args: { variant: "segmented", disabled: true, defaultValue: ["jour"] },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ["jour"] },
}

/**
 * One option at a time, which makes the group a radio group for a screen reader. The pressed segment fills with the
 * primary color and a tick springs in, so it does not rely on color alone. Every segment is as wide as the widest, and
 * none changes width when the choice moves. Arrow keys move between segments.
 */
export const TestOnePressedAtATime: Story = {
  name: "Test: One pressed at a time",
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
export const TestSeveralPressed: Story = {
  name: "Test: Several pressed",
  args: { multiple: true, defaultValue: ["jour"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Mois" }))
    expect(canvas.getByRole("button", { name: "Jour" })).toHaveAttribute("aria-pressed", "true")
    expect(canvas.getByRole("button", { name: "Mois" })).toHaveAttribute("aria-pressed", "true")
    expect(canvas.getByRole("button", { name: "Semaine" })).toHaveAttribute("aria-pressed", "false")
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
  args: { defaultValue: ["semaine"] },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  globals: { contrast: "more" },
  args: { defaultValue: ["semaine"] },
}

/** The pill's box, and the box of the option it should be behind */
function pillAndOption(canvasElement: HTMLElement, name: string) {
  const pill = canvasElement.querySelector<HTMLElement>("[data-scope=toggle-group][data-part=indicator]")!
  return {
    pill,
    at: pill.getBoundingClientRect(),
    option: within(canvasElement).getByRole("radio", { name }).getBoundingClientRect(),
  }
}

/**
 * The pill is behind the chosen option from the first frame, with nothing moving as the page loads. Choosing another
 * slides it there by its transform alone, which the compositor runs while the page is busy, and the words keep their
 * color.
 */
export const TestSegmentedSlides: Story = {
  name: "Test: Segmented, the pill slides to the choice",
  args: { variant: "segmented", defaultValue: ["semaine"] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await document.fonts.ready
    await settled()
    let { pill, at, option } = pillAndOption(canvasElement, "Semaine")
    expectBehind(at, option)
    expect(Math.abs(at.width - option.width)).toBeLessThanOrEqual(1)
    const ink = getComputedStyle(canvas.getByRole("radio", { name: "Mois" })).color
    await userEvent.click(canvas.getByRole("radio", { name: "Mois" }))
    expect(args.onValueChange).toHaveBeenLastCalledWith({ value: ["mois"] })
    const moving = pill.getAnimations({ subtree: true }) as CSSTransition[]
    expect(moving.length).toBeGreaterThan(0)
    for (const transition of moving) expect(["translate", "scale"]).toContain(transition.transitionProperty)
    expect(getComputedStyle(canvas.getByRole("radio", { name: "Mois" })).color).toBe(ink)
    await settled()
    ;({ at, option } = pillAndOption(canvasElement, "Mois"))
    expectBehind(at, option)
  },
}

/** A pill there from the start does not slide or fade in with the page */
export const TestSegmentedFirstRender: Story = {
  name: "Test: Segmented, nothing moves as the page loads",
  args: { variant: "segmented", defaultValue: ["mois"] },
  play: ({ canvasElement }) => {
    const presence = canvasElement.querySelector<HTMLElement>("[data-part=indicator]")!.parentElement!
    expect(presence.getAnimations({ subtree: true })).toEqual([])
    expect(getComputedStyle(presence).opacity).toBe("1")
  },
}

/**
 * Choosing a third option while the pill is on its way turns it round from where it is: it never jumps back to where
 * it started or on to where it was going
 */
export const TestSegmentedInterrupted: Story = {
  name: "Test: Segmented, a change of mind turns the pill round",
  args: { variant: "segmented", defaultValue: ["jour"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await settled()
    const root = document.documentElement
    root.style.setProperty("--duration-travel", "4s")
    try {
      const start = pillAndOption(canvasElement, "Jour").at.left
      await userEvent.click(canvas.getByRole("radio", { name: "Mois" }))
      await new Promise((resolve) => setTimeout(resolve, 400))
      const between = pillAndOption(canvasElement, "Mois").at.left
      expect(between).toBeGreaterThan(start + 2)
      await userEvent.click(canvas.getByRole("radio", { name: "Semaine" }))
      await frame()
      const after = pillAndOption(canvasElement, "Semaine").at.left
      expect(Math.abs(after - between)).toBeLessThan(8)
      // Straight to where it is going
      const pill = canvasElement.querySelector<HTMLElement>("[data-part=indicator]")!
      for (const transition of pill.getAnimations({ subtree: true })) transition.finish()
    } finally {
      root.style.removeProperty("--duration-travel")
    }
    const { at, option } = pillAndOption(canvasElement, "Semaine")
    expectBehind(at, option)
  },
}

/** The arrow keys move between the options and Space chooses one; the pill follows, with the ring drawn inside it */
export const TestSegmentedKeyboard: Story = {
  name: "Test: Segmented, with the keyboard",
  args: { variant: "segmented", defaultValue: ["jour"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The group takes the Tab and hands it to the chosen option on the next frame
    await userEvent.tab()
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Jour" })).toHaveFocus())
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Semaine" })).toHaveFocus())
    await userEvent.keyboard(" ")
    expect(canvas.getByRole("radio", { name: "Semaine" })).toBeChecked()
    const ring = getComputedStyle(canvas.getByRole("radio", { name: "Semaine" }))
    expect(ring.outlineStyle).toBe("solid")
    expect(Number.parseFloat(ring.outlineOffset) + Number.parseFloat(ring.outlineWidth)).toBeLessThanOrEqual(0)
    await settled()
    const { at, option } = pillAndOption(canvasElement, "Semaine")
    expectBehind(at, option)
  },
}

/** Pressing the chosen option again lets go of it: the pill fades out where it is, and in where the next choice lands */
export const TestSegmentedDeselected: Story = {
  name: "Test: Segmented, nothing chosen",
  args: { variant: "segmented", defaultValue: ["jour"], deselectable: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const presence = canvasElement.querySelector<HTMLElement>("[data-part=indicator]")!.parentElement!
    await settled()
    await userEvent.click(canvas.getByRole("radio", { name: "Jour" }))
    expect(canvas.getByRole("radio", { name: "Jour" })).not.toBeChecked()
    await settled()
    expect(getComputedStyle(presence).opacity).toBe("0")
    await userEvent.click(canvas.getByRole("radio", { name: "Mois" }))
    await settled()
    expect(getComputedStyle(presence).opacity).toBe("1")
    const { at, option } = pillAndOption(canvasElement, "Mois")
    expectBehind(at, option)
  },
}

/** With several pressed, each has a pill of its own */
export const TestSegmentedSeveral: Story = {
  name: "Test: Segmented, several pressed",
  args: { variant: "segmented", multiple: true, defaultValue: ["jour"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvasElement.querySelector("[data-part=indicator]")).toBeNull()
    await userEvent.click(canvas.getByRole("button", { name: "Mois" }))
    await settled()
    const shown = (name: string) => getComputedStyle(canvas.getByRole("button", { name }), "::after").opacity
    expect(shown("Jour")).toBe("1")
    expect(shown("Mois")).toBe("1")
    expect(shown("Semaine")).toBe("0")
  },
}

/** On a phone the track stretches across the screen and the segments share it */
export const TestSegmentedOnAPhone: Story = {
  name: "Test: Segmented on a phone",
  args: { variant: "segmented", defaultValue: ["semaine"], class: "w-full" },
  globals: { viewport: { value: "mobile2", isRotated: false } },
  parameters: { layout: "padded" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("radio", { name: "Jour" }))
    await settled()
    const { at, option } = pillAndOption(canvasElement, "Jour")
    expectBehind(at, option)
    expect(option.height).toBeGreaterThanOrEqual(48)
  },
}

export const TestSegmentedInDarkTheme: Story = {
  name: "Test: Segmented in dark theme",
  globals: { theme: "dark" },
  args: { variant: "segmented", defaultValue: ["semaine"] },
}

export const TestSegmentedWithMoreContrast: Story = {
  name: "Test: Segmented with more contrast",
  globals: { contrast: "more" },
  args: { variant: "segmented", defaultValue: ["semaine"] },
}

/** zag measures in whole pixels, `offsetLeft`, so the pill may sit half a pixel off an option at a fraction */
function expectBehind(pill: DOMRect, option: DOMRect) {
  expect(Math.abs(pill.left - option.left)).toBeLessThanOrEqual(1)
}

function frame() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}
