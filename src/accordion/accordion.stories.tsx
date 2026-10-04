import { For, omit } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Accordion } from "./index.js"

const questions = [
  { value: "semis", title: "Quand semer ?", answer: "Dès que le sol dépasse 8 °C, en général fin mars." },
  {
    value: "eau",
    title: "Combien d'eau par semaine ?",
    answer: "Environ 25 mm, pluie comprise, en l'absence de vent sec.",
  },
  {
    value: "gel",
    title: "Que faire en cas de gel ?",
    answer: "Couvrir les jeunes plants avant 18 h et arroser le sol en soirée.",
  },
] as const

// Storybook hands args over as a Solid store, and the arrays of a store have no `constructor`, which zag reads when it
// compares values. A plain copy keeps the story what an app writes.
function Questions(props: Accordion.RootProps) {
  return (
    <Accordion.Root
      class="w-80"
      {...omit(props, "value", "defaultValue")}
      value={props.value && [...props.value]}
      defaultValue={props.defaultValue && [...props.defaultValue]}
    >
      <For each={questions}>
        {(question) => (
          <Accordion.Item value={question.value}>
            <Accordion.Item.Trigger>{question.title}</Accordion.Item.Trigger>
            <Accordion.Item.Content>{question.answer}</Accordion.Item.Content>
          </Accordion.Item>
        )}
      </For>
    </Accordion.Root>
  )
}

const meta = {
  title: "Components/Accordion",
  component: Questions,
  tags: ["autodocs"],
  // Pinned to the top, as on a page: centred, the stack would rise by half of what a section grows
  parameters: { layout: "padded" },
  args: { onValueChange: fn() },
} satisfies Meta<typeof Questions>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Each title is a 56px button, announced as expanded or collapsed, and one section is open at a time. Its props are in
 * the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    variant: { control: "inline-radio", options: ["contained", "separated", "flush"] },
    multiple: { control: "boolean" },
    collapsible: { control: "boolean" },
    disabled: { control: "boolean" },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
}

export const Open: Story = {
  args: { defaultValue: ["eau"] },
}

/** Each section a card of its own, 12px apart, with a `Card`'s spacing inside */
export const Separated: Story = {
  args: { variant: "separated", defaultValue: ["eau"] },
}

/**
 * No card of its own, only the lines between sections, for an accordion inside a card or a panel: its titles and text
 * line up with the panel's own words, and a title's tint reaches a little past them.
 */
export const Flush: Story = {
  args: { variant: "flush", defaultValue: ["eau"] },
  render: (args) => (
    <section class="w-96 rounded-card border-2 border-border bg-raised p-5">
      <h2 class="pb-2 text-lg font-semibold tracking-heading">Questions fréquentes</h2>
      <Questions {...args} class="w-auto" />
    </section>
  ),
}

/**
 * Each title is a 56px button, announced as expanded or collapsed. One section is open at a time, and the arrow keys
 * move between titles.
 */
export const TestOneSectionOpenAtATime: Story = {
  name: "Test: One section open at a time",
  args: { collapsible: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Quand semer ?" }))
    expect(canvas.getByRole("button", { name: "Quand semer ?" })).toHaveAttribute("aria-expanded", "true")
    await waitFor(() => expect(canvas.getByRole("region", { name: "Quand semer ?" })).toBeVisible())
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: ["semis"] }))

    await userEvent.click(canvas.getByRole("button", { name: "Combien d'eau par semaine ?" }))
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Quand semer ?" })).toHaveAttribute("aria-expanded", "false"),
    )

    await userEvent.keyboard("{ArrowDown}")
    const frost = canvas.getByRole("button", { name: "Que faire en cas de gel ?" })
    expect(frost).toHaveFocus()
    // The ring shows on the title the keyboard reached, at once
    expect(getComputedStyle(frost).outlineStyle).toBe("solid")
    expect(ringTransitions(frost)).toEqual([])
  },
}

/**
 * As one section opens and the open one closes, the two fold on one clock, so the title below them goes straight to
 * where it ends and never dips and comes back.
 */
export const TestOpeningAnotherSection: Story = {
  name: "Test: Opening another section",
  args: { defaultValue: ["eau"] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const last = canvas.getByRole("button", { name: "Que faire en cas de gel ?" })
    // Zag's accordion takes a click on a title it has seen focused
    const first = canvas.getByRole("button", { name: "Quand semer ?" })
    first.focus()
    first.click()
    const tops = [last.getBoundingClientRect().top, ...(await sample(() => last.getBoundingClientRect().top, 600))]
    // It stays between where it started and where it ends, give or take a rounding
    const low = Math.min(tops[0]!, tops.at(-1)!) - 0.5
    const high = Math.max(tops[0]!, tops.at(-1)!) + 0.5
    expect(tops.filter((top) => top < low || top > high)).toEqual([])
  },
}

export const TestSeveralSectionsOpen: Story = {
  name: "Test: Several sections open",
  args: { multiple: true, defaultValue: ["semis", "gel"] },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole("button", { name: "Quand semer ?" })).toHaveAttribute("aria-expanded", "true")
    expect(canvas.getByRole("button", { name: "Que faire en cas de gel ?" })).toHaveAttribute("aria-expanded", "true")
    expect(canvas.getByRole("button", { name: "Combien d'eau par semaine ?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    )
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
  args: { defaultValue: ["eau"] },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  globals: { contrast: "more" },
  args: { defaultValue: ["eau"] },
}

/**
 * Separated, each section is a card of its own with a gap between them, and a section opening pushes the cards below
 * down on the same clock as the one closing, so they never dip and come back.
 */
export const TestSeparated: Story = {
  name: "Test: Separated",
  args: { variant: "separated", defaultValue: ["eau"] },
  play: async ({ canvasElement }) => {
    const items = [...canvasElement.querySelectorAll<HTMLElement>("[data-scope=accordion][data-part=item]")]
    expect(items).toHaveLength(3)
    for (const item of items) expect(getComputedStyle(item).borderTopWidth).toBe("2px")
    const gap = items[1]!.getBoundingClientRect().top - items[0]!.getBoundingClientRect().bottom
    expect(gap).toBeCloseTo(12, 0)
    const canvas = within(canvasElement)
    const last = items[2]!
    const first = canvas.getByRole("button", { name: "Quand semer ?" })
    first.focus()
    first.click()
    const tops = [last.getBoundingClientRect().top, ...(await sample(() => last.getBoundingClientRect().top, 600))]
    const low = Math.min(tops[0]!, tops.at(-1)!) - 0.5
    const high = Math.max(tops[0]!, tops.at(-1)!) + 0.5
    expect(tops.filter((top) => top < low || top > high)).toEqual([])
    // The ring is drawn inside the card at once
    await userEvent.keyboard("{ArrowDown}")
    const water = canvas.getByRole("button", { name: "Combien d'eau par semaine ?" })
    expect(water).toHaveFocus()
    const ring = getComputedStyle(water)
    expect(Number.parseFloat(ring.outlineOffset) + Number.parseFloat(ring.outlineWidth)).toBeLessThanOrEqual(0)
  },
}

/**
 * Flush, the accordion has no edge of its own, a line between sections, and its titles and text start where the words
 * of the panel around it start.
 */
export const TestFlush: Story = {
  ...Flush,
  name: "Test: Flush",
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>("[data-scope=accordion][data-part=root]")!
    expect(getComputedStyle(root).borderTopWidth).toBe("0px")
    const heading = within(canvasElement).getByRole("heading", { name: "Questions fréquentes" })
    const title = within(canvasElement).getByText("Quand semer ?")
    const answer = within(canvasElement).getByText(/Environ 25 mm/)
    expect(title.getBoundingClientRect().left).toBeCloseTo(heading.getBoundingClientRect().left, 0)
    expect(answer.getBoundingClientRect().left).toBeCloseTo(heading.getBoundingClientRect().left, 0)
    const items = canvasElement.querySelectorAll<HTMLElement>("[data-scope=accordion][data-part=item]")
    expect(getComputedStyle(items[0]!).borderBottomWidth).toBe("2px")
    expect(getComputedStyle(items[2]!).borderBottomWidth).toBe("0px")
  },
}

export const TestSeparatedInDarkTheme: Story = {
  name: "Test: Separated in dark theme",
  globals: { theme: "dark" },
  args: { variant: "separated", defaultValue: ["eau"] },
}

export const TestFlushWithMoreContrast: Story = {
  ...Flush,
  name: "Test: Flush with more contrast",
  globals: { contrast: "more" },
}

export const TestFlushInDarkTheme: Story = {
  ...Flush,
  name: "Test: Flush in dark theme",
  globals: { theme: "dark" },
}

export const TestSeparatedWithMoreContrast: Story = {
  name: "Test: Separated with more contrast",
  globals: { contrast: "more" },
  args: { variant: "separated", defaultValue: ["eau"] },
}

/** Reads a value on every frame for `ms` milliseconds */
async function sample<T>(read: () => T, ms: number): Promise<T[]> {
  const values: T[] = []
  const end = performance.now() + ms
  while (performance.now() < end) {
    await new Promise(requestAnimationFrame)
    values.push(read())
  }
  return values
}

/** The transitions running on an element's focus ring, which appears at once */
function ringTransitions(element: Element): Animation[] {
  return element
    .getAnimations()
    .filter((animation) => (animation as CSSTransition).transitionProperty === "outline-color")
}
