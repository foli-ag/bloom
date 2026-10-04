import { createMemo, createSignal, For } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { Combobox, createListCollection } from "./index.js"

const communes = [
  { label: "Auch", value: "32013" },
  { label: "Aubiet", value: "32012" },
  { label: "Condom", value: "32107" },
  { label: "Eauze", value: "32119" },
  { label: "Fleurance", value: "32132" },
  { label: "Lectoure", value: "32208" },
  { label: "Mirande", value: "32256" },
  { label: "Nogaro", value: "32296" },
]

function Commune(props: Partial<Combobox.RootProps>) {
  const [typed, setTyped] = createSignal("")
  const collection = createMemo(() =>
    createListCollection({
      items: communes.filter((commune) => commune.label.toLowerCase().startsWith(typed().toLowerCase())),
    }),
  )
  return (
    <div class="w-80">
      <Combobox.Root
        collection={collection()}
        onInputValueChange={(details) => setTyped(details.inputValue)}
        placeholder="Tapez le nom"
        {...props}
      >
        <Combobox.Label>Commune</Combobox.Label>
        <Combobox.Input />
        <Combobox.Clear as={Button} tone="neutral" variant="ghost" class="justify-self-start">
          Effacer
        </Combobox.Clear>
        <Combobox.Content>
          <Combobox.List>
            <For each={collection().items}>{(item) => <Combobox.Item item={item}>{item.label}</Combobox.Item>}</For>
          </Combobox.List>
          <Combobox.Empty>Aucune commune trouvée</Combobox.Empty>
        </Combobox.Content>
      </Combobox.Root>
    </div>
  )
}

const meta = {
  title: "Components/Combobox",
  component: Commune,
  tags: ["autodocs"],
  args: { onValueChange: fn() },
} satisfies Meta<typeof Commune>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Typing narrows the list, the arrow keys move through it while focus stays in the field, and Enter chooses. Its props
 * are in the Controls panel.
 */
export const Playground: Story = {
  args: { placeholder: "Tapez le nom" },
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    invalid: { control: "boolean" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
    inputBehavior: { control: "inline-radio", options: ["none", "autohighlight", "autocomplete"] },
    selectionBehavior: { control: "inline-radio", options: ["replace", "clear", "preserve"] },
    openOnClick: { control: "boolean" },
    openOnKeyPress: { control: "boolean" },
    allowCustomValue: { control: "boolean" },
    closeOnSelect: { control: "boolean" },
    loopFocus: { control: "boolean" },
  },
}

export const Open: Story = {
  args: { defaultOpen: true },
  play: settled,
}

export const Invalid: Story = {
  args: { invalid: true },
}

/**
 * Typing narrows the list, the arrow keys move through it while focus stays in the field, and Enter chooses. The
 * field then shows the commune, and the clear button, named by its own words, empties it.
 */
export const TestTypingToChooseAndClear: Story = {
  name: "Test: Typing to choose and clear",
  play: async ({ args }) => {
    const page = within(document.body)
    const field = page.getByRole("combobox", { name: "Commune" })
    await userEvent.type(field, "au")
    const list = await page.findByRole("listbox")
    await waitFor(() => expect(within(list).getAllByRole("option")).toHaveLength(2))
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await waitFor(() => expect(page.getByRole("option", { name: "Aubiet" })).toHaveAttribute("data-highlighted"))
    expect(field).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(page.queryByRole("listbox")).toBeNull())
    expect(field).toHaveValue("Aubiet")
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: ["32012"] }))

    await userEvent.click(page.getByRole("button", { name: "Effacer" }))
    expect(field).toHaveValue("")
    // The clear button is gone, so focus goes back to the field
    await waitFor(() => expect(field).toHaveFocus())
  },
}

/** A tap anywhere on the field opens the whole list, so a thumb need not find the chevron */
export const TestTapToOpen: Story = {
  name: "Test: Tap to open",
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("combobox", { name: "Commune" }))
    const list = await page.findByRole("listbox")
    expect(within(list).getAllByRole("option")).toHaveLength(communes.length)
  },
}

/**
 * When nothing matches, the panel says so in the app's words, as a status a screen reader reads out. The empty list is
 * hidden, as a listbox has to hold options.
 */
export const TestNothingMatches: Story = {
  name: "Test: Nothing matches",
  play: async () => {
    const page = within(document.body)
    await userEvent.type(page.getByRole("combobox", { name: "Commune" }), "zz")
    await waitFor(() => expect(page.getByRole("status")).toHaveTextContent("Aucune commune trouvée"))
    await settled()
    expect(page.getByText("Aucune commune trouvée")).toBeVisible()
    expect(page.queryByRole("listbox")).toBeNull()
  },
}

export const TestOpenInDarkTheme: Story = {
  name: "Test: Open in dark theme",
  ...Open,
  globals: { theme: "dark" },
}

export const TestOpenWithMoreContrast: Story = {
  name: "Test: Open with more contrast",
  ...Open,
  globals: { contrast: "more" },
}
