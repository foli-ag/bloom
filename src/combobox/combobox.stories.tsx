import { createMemo, createSignal, For, untrack } from "solid-js"
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
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Indicator />
        </Combobox.Control>
        <Combobox.Trigger.Clear as={Button} tone="neutral" variant="ghost" class="justify-self-start">
          Effacer
        </Combobox.Trigger.Clear>
        <Combobox.Positioner>
          <Combobox.Content>
            <For each={collection().items}>
              {(item) => (
                <Combobox.Item item={item}>
                  <Combobox.Item.Text>{item.label}</Combobox.Item.Text>
                  <Combobox.Item.Indicator />
                </Combobox.Item>
              )}
            </For>
          </Combobox.Content>
          <Combobox.Empty>Aucune commune trouvée</Combobox.Empty>
        </Combobox.Positioner>
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

function Communes(props: Partial<Combobox.RootProps>) {
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
        multiple
        onInputValueChange={(details) => setTyped(details.inputValue)}
        placeholder="Tapez le nom"
        {...props}
      >
        <Combobox.Label>Communes</Combobox.Label>
        <Combobox.Control>
          <Combobox.ChipGroup>
            {(item: (typeof communes)[number]) => (
              <Combobox.Chip item={item}>
                <Combobox.Chip.Text>{item.label}</Combobox.Chip.Text>
                <Combobox.Chip.Trigger>Retirer {item.label}</Combobox.Chip.Trigger>
              </Combobox.Chip>
            )}
          </Combobox.ChipGroup>
          <Combobox.Input />
          <Combobox.Indicator />
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content>
            <For each={collection().items}>
              {(item) => (
                <Combobox.Item item={item}>
                  <Combobox.Item.Text>{item.label}</Combobox.Item.Text>
                  <Combobox.Item.Indicator />
                </Combobox.Item>
              )}
            </For>
          </Combobox.Content>
          <Combobox.Loading>Recherche des communes…</Combobox.Loading>
          <Combobox.Empty>Aucune commune trouvée</Combobox.Empty>
        </Combobox.Positioner>
      </Combobox.Root>
    </div>
  )
}

/** Several communes as chips in the field, before the input, wrapping with it */
export const SeveralAsChips: Story = {
  render: (args) => <Communes {...args} defaultValue={["32013", "32107", "32208"]} />,
}

// A search sent to a server as the farmer types, answering after a while
function SearchedCommunes(props: { delay?: number; waiting?: boolean }) {
  const [typed, setTyped] = createSignal("")
  const [found, setFound] = createSignal<typeof communes>([])
  const [loading, setLoading] = createSignal(untrack(() => props.waiting ?? false))
  let timer: ReturnType<typeof setTimeout> | undefined
  const collection = createMemo(() => createListCollection({ items: found() }))
  return (
    <div class="w-80">
      <Combobox.Root
        collection={collection()}
        loading={loading()}
        defaultOpen={untrack(() => props.waiting)}
        onInputValueChange={(details) => {
          setTyped(details.inputValue)
          setFound([])
          setLoading(true)
          clearTimeout(timer)
          timer = setTimeout(() => {
            setFound(communes.filter((commune) => commune.label.toLowerCase().startsWith(typed().toLowerCase())))
            setLoading(false)
          }, props.delay ?? 1500)
        }}
        placeholder="Tapez le nom"
      >
        <Combobox.Label>Commune</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Indicator />
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content>
            <For each={collection().items}>
              {(item) => (
                <Combobox.Item item={item}>
                  <Combobox.Item.Text>{item.label}</Combobox.Item.Text>
                  <Combobox.Item.Indicator />
                </Combobox.Item>
              )}
            </For>
          </Combobox.Content>
          <Combobox.Loading>Recherche des communes…</Combobox.Loading>
          <Combobox.Empty>Aucune commune trouvée</Combobox.Empty>
        </Combobox.Positioner>
      </Combobox.Root>
    </div>
  )
}

/** While the search is under way, the list shows rows of skeleton bars and is marked busy */
export const Loading: Story = {
  render: () => <SearchedCommunes waiting />,
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

/** Closed while it says nothing matches, the panel fades out like any other, rather than vanishing on the spot */
export const TestClosingWhileNothingMatches: Story = {
  name: "Test: Closing while nothing matches",
  play: async () => {
    const page = within(document.body)
    await userEvent.type(page.getByRole("combobox", { name: "Commune" }), "zz")
    const panel = (await page.findByText("Aucune commune trouvée")).closest("[data-state]")!
    await settled()

    await userEvent.keyboard("{Escape}")
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    expect(panel).toHaveAttribute("data-state", "closed")
    expect(panel.isConnected).toBe(true)
    await waitFor(() => expect(panel.isConnected).toBe(false))
  },
}

/**
 * Near the foot of the screen there is no room for the list under the field, so it opens above it, and stays there as
 * typing narrows it: it does not jump under the field once the shorter list would fit there.
 */
export const TestNearTheFootOfTheScreen: Story = {
  name: "Test: Near the foot of the screen",
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div class="flex h-dvh flex-col justify-end px-4 pb-44">
      <Commune {...args} />
    </div>
  ),
  play: async () => {
    const page = within(document.body)
    const field = page.getByRole("combobox", { name: "Commune" })
    await userEvent.click(field)
    const list = await page.findByRole("listbox")
    await settled()
    const gap = () => field.getBoundingClientRect().top - list.parentElement!.getBoundingClientRect().bottom
    const above = gap()
    expect(above).toBeGreaterThan(0)

    await userEvent.type(field, "au")
    await waitFor(() => expect(within(list).getAllByRole("option")).toHaveLength(2))
    await settled()
    expect(gap()).toBeCloseTo(above, 0)
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

/**
 * Chosen communes become chips and the input empties, ready for the next. Backspace in the empty input takes the last
 * one out, and a chip's cross takes its own out, with the focus kept in the input.
 */
export const TestChoosingSeveralAsChips: Story = {
  name: "Test: Choosing several as chips",
  render: (args) => <Communes {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    const chips = () =>
      [...canvasElement.querySelectorAll("[data-part=chip]:not([data-state=closed])")].map(
        (chip) => chip.querySelector("[data-part=chip-text]")!.textContent,
      )
    const field = canvas.getByRole("combobox", { name: "Communes" })
    await userEvent.type(field, "au")
    await userEvent.click(await page.findByRole("option", { name: "Auch" }))
    expect(field).toHaveValue("")
    await userEvent.type(field, "con")
    await userEvent.click(await page.findByRole("option", { name: "Condom" }))
    await waitFor(() => expect(chips()).toEqual(["Auch", "Condom"]))
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: ["32013", "32107"] }))
    // Typing narrows the list, and the chips stay
    await userEvent.type(field, "zz")
    expect(chips()).toEqual(["Auch", "Condom"])
    await userEvent.clear(field)

    await userEvent.keyboard("{Backspace}")
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: ["32013"] }))
    await waitFor(() => expect(chips()).toEqual(["Auch"]))
    expect(field).toHaveFocus()

    await userEvent.click(canvas.getByRole("button", { name: "Retirer Auch" }))
    await waitFor(() => expect(chips()).toEqual([]))
    expect(field).toHaveFocus()
    await waitFor(() => expect(canvasElement.querySelector("[data-part=chip]")).toBeNull())
  },
}

/** Backspace only takes a choice out once the input is empty: before that it deletes letters */
export const TestBackspaceDeletesLettersFirst: Story = {
  name: "Test: Backspace deletes letters first",
  render: (args) => <Communes {...args} defaultValue={["32013"]} />,
  play: async ({ canvasElement, args }) => {
    const field = within(canvasElement).getByRole("combobox", { name: "Communes" })
    await userEvent.type(field, "co")
    await userEvent.keyboard("{Backspace}{Backspace}")
    expect(field).toHaveValue("")
    expect(args.onValueChange).not.toHaveBeenCalled()
    await userEvent.keyboard("{Backspace}")
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: [] }))
  },
}

/** A press on the field beside the chips puts the focus in the input and opens the list */
export const TestPressingTheField: Story = {
  ...SeveralAsChips,
  name: "Test: Pressing the field",
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>("[data-part=control]")!
    const box = control.getBoundingClientRect()
    await userEvent.pointer({
      keys: "[MouseLeft]",
      target: control,
      coords: { clientX: box.right - 60, clientY: box.bottom - 10 },
    })
    await waitFor(() => expect(within(canvasElement).getByRole("combobox")).toHaveFocus())
    await within(document.body).findByRole("listbox")
    await settled()
    expect(within(document.body).getByRole("listbox")).toBeVisible()
  },
}

/**
 * While the search is under way the list is marked busy and shows rows of skeleton bars, and a status says so; the
 * empty message does not show, as nothing is known yet. Then the communes found take their place.
 */
export const TestSearching: Story = {
  name: "Test: Searching",
  render: () => <SearchedCommunes delay={800} />,
  play: async ({ canvasElement }) => {
    const page = within(document.body)
    await userEvent.type(within(canvasElement).getByRole("combobox", { name: "Commune" }), "au")
    // The list has no row yet, so it is hidden: found by its part
    const content = () => document.querySelector<HTMLElement>("[data-scope=combobox][data-part=content]")
    await waitFor(() => expect(content()).not.toBeNull())
    const list = content()!
    await waitFor(() => expect(list).toHaveAttribute("aria-busy", "true"))
    expect(page.getAllByRole("status").map((status) => status.textContent)).toEqual(["Recherche des communes…", ""])
    expect(page.queryByText("Aucune commune trouvée")).toBeNull()
    await waitFor(() => expect(page.getAllByRole("option")).toHaveLength(2), { timeout: 3000 })
    expect(list).not.toHaveAttribute("aria-busy")
    expect(document.querySelector("[data-scope=combobox][data-part=loading] [aria-hidden=true]")).toBeNull()
  },
}

export const TestChipsInDarkTheme: Story = {
  ...SeveralAsChips,
  name: "Test: Chips in dark theme",
  globals: { theme: "dark" },
}

export const TestChipsWithMoreContrast: Story = {
  ...SeveralAsChips,
  name: "Test: Chips with more contrast",
  globals: { contrast: "more" },
}

/** On a phone the chips and the input wrap onto as many lines as they need, and the field grows with them */
export const TestChipsOnAPhone: Story = {
  name: "Test: Chips on a phone",
  globals: { viewport: { value: "mobile2", isRotated: false } },
  render: (args) => <Communes {...args} defaultValue={["32013", "32107", "32208", "32132", "32256"]} />,
  play: ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>("[data-part=control]")!.getBoundingClientRect()
    for (const chip of canvasElement.querySelectorAll("[data-part=chip]")) {
      const box = chip.getBoundingClientRect()
      expect(box.right).toBeLessThanOrEqual(control.right)
    }
    expect(control.height).toBeGreaterThan(48 * 2 - 4)
  },
}
