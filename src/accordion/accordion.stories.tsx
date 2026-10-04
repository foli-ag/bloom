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
    multiple: { control: "boolean" },
    collapsible: { control: "boolean" },
    disabled: { control: "boolean" },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
}

export const Open: Story = {
  args: { defaultValue: ["eau"] },
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
    expect(canvas.getByRole("button", { name: "Que faire en cas de gel ?" })).toHaveFocus()
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
