import { createMemo, createSignal, For, omit, untrack } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { createListCollection, Select } from "./index.js"

const cultures = createListCollection({
  items: [
    { label: "Blé tendre", value: "ble-tendre" },
    { label: "Blé dur", value: "ble-dur" },
    { label: "Orge d'hiver", value: "orge" },
    { label: "Colza", value: "colza" },
    { label: "Maïs grain", value: "mais" },
    { label: "Tournesol", value: "tournesol", disabled: true },
  ],
})

function Culture(props: Partial<Select.RootProps>) {
  return (
    <form class="grid w-80 gap-3">
      <Select.Root collection={cultures} name="culture" {...props}>
        <Select.Label>Culture</Select.Label>
        <Select.Trigger>
          <Select.ValueText placeholder="Choisir une culture" />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Trigger.Clear as={Button} tone="neutral" variant="ghost" class="justify-self-start">
          Effacer
        </Select.Trigger.Clear>
        <Select.Positioner>
          <Select.Content>
            <For each={cultures.items}>
              {(item) => (
                <Select.Item item={item}>
                  <Select.Item.Text>{item.label}</Select.Item.Text>
                  <Select.Item.Indicator />
                </Select.Item>
              )}
            </For>
          </Select.Content>
          <Select.Trigger.Close as={Button} tone="neutral" variant="outline" block>
            Fermer
          </Select.Trigger.Close>
        </Select.Positioner>
        <Select.HiddenSelect />
      </Select.Root>
    </form>
  )
}

const meta = {
  title: "Components/Select",
  component: Culture,
  tags: ["autodocs"],
  args: { onValueChange: fn() },
} satisfies Meta<typeof Culture>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A field named by its label: the list drops down under it, a tap chooses and closes it, and the choice goes into the
 * form. Its props are in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    invalid: { control: "boolean" },
    required: { control: "boolean" },
    multiple: { control: "boolean" },
    closeOnSelect: { control: "boolean" },
    loopFocus: { control: "boolean" },
    deselectable: { control: "boolean" },
  },
}

// The value is written here and not in `args`, which Storybook turns into a store that zag cannot compare
export const Open: Story = {
  render: () => <Culture defaultOpen defaultValue={["colza"]} />,
  play: settled,
}

export const Invalid: Story = {
  args: { invalid: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

function Cultures(props: Partial<Select.RootProps>) {
  return (
    <form class="grid w-80 gap-3">
      <Select.Root collection={cultures} name="cultures" multiple {...props}>
        <Select.Label>Cultures</Select.Label>
        <Select.Control>
          <Select.ChipGroup>
            {(item: (typeof cultures.items)[number]) => (
              <Select.Chip item={item}>
                <Select.Chip.Text>{item.label}</Select.Chip.Text>
                <Select.Chip.Trigger>Retirer {item.label}</Select.Chip.Trigger>
              </Select.Chip>
            )}
          </Select.ChipGroup>
          <Select.Trigger>
            <Select.ValueText placeholder="Choisir des cultures" />
            <Select.Indicator />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            <For each={cultures.items}>
              {(item) => (
                <Select.Item item={item}>
                  <Select.Item.Text>{item.label}</Select.Item.Text>
                  <Select.Item.Indicator />
                </Select.Item>
              )}
            </For>
          </Select.Content>
          <Select.Trigger.Close as={Button} tone="neutral" variant="outline" block>
            Fermer
          </Select.Trigger.Close>
        </Select.Positioner>
        <Select.HiddenSelect />
      </Select.Root>
    </form>
  )
}

/**
 * Several choices as chips in the field, each with a cross that takes it out. The chips wrap onto more lines, and a
 * press anywhere else on the field opens the list.
 */
export const SeveralAsChips: Story = {
  render: (args) => <Cultures {...args} defaultValue={["ble-tendre", "orge", "colza", "mais"]} />,
}

// Options fetched as the list first opens, as from a server on a poor connection
function LoadingCultures(props: Partial<Select.RootProps> & { delay?: number; waiting?: boolean }) {
  const [loaded, setLoaded] = createSignal(false)
  // The story that shows the list waiting opens it from the start, where no change of state starts the fetch
  const [loading, setLoading] = createSignal(untrack(() => props.waiting ?? false))
  const rest = omit(props, "delay", "waiting")
  const collection = createMemo(() =>
    loaded() ? cultures : createListCollection<(typeof cultures.items)[number]>({ items: [] }),
  )
  return (
    <div class="grid w-80">
      <Select.Root
        collection={collection()}
        loading={loading()}
        onOpenChange={(details) => {
          if (!details.open || loaded() || loading()) return
          setLoading(true)
          setTimeout(() => {
            setLoaded(true)
            setLoading(false)
          }, props.delay ?? 1500)
        }}
        {...rest}
      >
        <Select.Label>Culture</Select.Label>
        <Select.Trigger>
          <Select.ValueText placeholder="Choisir une culture" />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Positioner>
          <Select.Content>
            <For each={collection().items}>
              {(item) => (
                <Select.Item item={item}>
                  <Select.Item.Text>{item.label}</Select.Item.Text>
                  <Select.Item.Indicator />
                </Select.Item>
              )}
            </For>
          </Select.Content>
          <Select.Loading>Chargement des cultures…</Select.Loading>
          <Select.Trigger.Close as={Button} tone="neutral" variant="outline" block>
            Fermer
          </Select.Trigger.Close>
        </Select.Positioner>
      </Select.Root>
    </div>
  )
}

/** While its options are on their way, the list shows rows of skeleton bars and is marked busy */
export const Loading: Story = {
  render: () => <LoadingCultures defaultOpen waiting />,
}

/**
 * The field is named by its label. The list drops down under it, a tap chooses and closes it, and the choice goes into
 * the form. The clear button appears once something is chosen, named by its own words.
 */
export const TestChoosingAndClearing: Story = {
  name: "Test: Choosing and clearing",
  play: async ({ canvasElement, args }) => {
    const page = within(document.body)
    const field = page.getByRole("combobox", { name: "Culture" })
    expect(field).toHaveTextContent("Choisir une culture")
    expect(page.queryByRole("button", { name: "Effacer" })).toBeNull()

    await userEvent.click(field)
    const list = await page.findByRole("listbox", { name: "Culture" })
    await settled()
    expect(list.getBoundingClientRect().top).toBeGreaterThan(field.getBoundingClientRect().bottom)
    expect(page.getByRole("option", { name: "Tournesol" })).toHaveAttribute("aria-disabled", "true")

    await userEvent.click(page.getByRole("option", { name: "Orge d'hiver" }))
    await waitFor(() => expect(page.queryByRole("listbox")).toBeNull())
    expect(field).toHaveTextContent("Orge d'hiver")
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: ["orge"] }))
    expect(new FormData(canvasElement.querySelector("form")!).get("culture")).toBe("orge")

    await userEvent.click(page.getByRole("button", { name: "Effacer" }))
    expect(field).toHaveTextContent("Choisir une culture")
    // The clear button is gone, so focus goes back to the field
    await waitFor(() => expect(field).toHaveFocus())
  },
}

/** From the keyboard: the arrow keys open it and move, Enter chooses, and focus is back on the field. */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  play: async () => {
    const page = within(document.body)
    const field = page.getByRole("combobox", { name: "Culture" })
    field.focus()
    await userEvent.keyboard("{ArrowDown}")
    // The list takes focus on the next frame
    const list = await page.findByRole("listbox")
    await waitFor(() => expect(list).toHaveFocus())
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}")
    await waitFor(() => expect(page.queryByRole("listbox")).toBeNull())
    expect(field).toHaveTextContent("Orge d'hiver")
    await waitFor(() => expect(field).toHaveFocus())
  },
}

/**
 * On a phone the list rises from the bottom as a sheet, with a close button at its foot. That button closes the sheet
 * without choosing, and focus goes back to the field.
 */
export const TestOnAPhone: Story = {
  name: "Test: On a phone",
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async ({ args }) => {
    const page = within(document.body)
    const field = page.getByRole("combobox", { name: "Culture" })
    await userEvent.click(field)
    const list = await page.findByRole("listbox")
    await settled()
    const panel = list.parentElement!.getBoundingClientRect()
    expect(panel.bottom).toBeCloseTo(innerHeight, 0)
    expect(panel.width).toBeCloseTo(innerWidth, 0)

    await userEvent.click(page.getByRole("button", { name: "Fermer" }))
    await waitFor(() => expect(page.queryByRole("listbox")).toBeNull())
    await waitFor(() => expect(field).toHaveFocus())
    expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

/** With reduced motion the sheet does not rise: it is in place from the first frame, and only fades in. */
export const TestOnAPhoneWithReducedMotion: Story = {
  name: "Test: On a phone with reduced motion",
  globals: { viewport: { value: "mobile2", isRotated: false }, motion: "reduced" },
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("combobox", { name: "Culture" }))
    const panel = (await page.findByRole("listbox")).parentElement!
    const tops: number[] = []
    for (let frame = 0; frame < 6; frame++) {
      await new Promise(requestAnimationFrame)
      tops.push(Math.round(panel.getBoundingClientRect().top))
    }
    await settled()
    const settledTop = Math.round(panel.getBoundingClientRect().top)
    expect(tops).toEqual(tops.map(() => settledTop))
  },
}

/**
 * Several at once with `multiple`: the list stays open, and each row chosen gets its tick. A list that opens on rows
 * already chosen shows their ticks still, as nothing changed, and a row chosen while it is open pops its tick in.
 */
export const TestChoosingSeveral: Story = {
  name: "Test: Choosing several",
  render: (args) => <Culture {...args} multiple defaultValue={["colza"]} />,
  play: async ({ args }) => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("combobox", { name: "Culture" }))
    const colza = await page.findByRole("option", { name: "Colza" })
    const tick = (option: HTMLElement) => option.querySelector("[data-part=item-indicator]")!
    expect(tick(colza).getAnimations({ subtree: true })).toEqual([])
    await settled()

    const orge = page.getByRole("option", { name: "Orge d'hiver" })
    await userEvent.click(orge)
    expect(orge).toHaveAttribute("aria-selected", "true")
    expect(tick(orge).getAnimations({ subtree: true })).not.toEqual([])
    expect(page.getByRole("listbox")).toBeVisible()
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: ["colza", "orge"] }))
    await settled()
  },
}

/**
 * Closed half way through opening, the list turns round from where it is and leaves: it never shows whole first, as it
 * would if its exit started from the open look. The same on a phone, where it is a sheet.
 */
export const TestChangingYourMind: Story = {
  name: "Test: Changing your mind",
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("combobox", { name: "Culture" }))
    const panel = (await page.findByRole("listbox")).parentElement!
    // How much of the panel shows: how opaque it is, times how much of it is on the screen, as a sheet slides in
    const shown = () => {
      const { top, height } = panel.getBoundingClientRect()
      return Number(getComputedStyle(panel).opacity) * Math.min(1, (innerHeight - top) / height)
    }
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    expect(shown()).toBeLessThan(0.5)

    await userEvent.keyboard("{Escape}")
    for (let frame = 0; frame < 6; frame++) {
      await new Promise(requestAnimationFrame)
      expect(shown()).toBeLessThan(0.9)
    }
    await waitFor(() => expect(page.queryByRole("listbox")).toBeNull())
  },
}

export const TestChangingYourMindOnAPhone: Story = {
  ...TestChangingYourMind,
  name: "Test: Changing your mind on a phone",
  globals: { viewport: { value: "mobile2", isRotated: false } },
}

/**
 * Near the foot of the screen there is no room for the list under the field, so zag turns it over to the top, and it
 * rises out of the field as it opens: its edge by the field never moves towards it.
 */
export const TestNearTheFootOfTheScreen: Story = {
  name: "Test: Near the foot of the screen",
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div class="flex h-dvh flex-col justify-end px-4 pb-6">
      <Culture {...args} />
    </div>
  ),
  play: async () => {
    const page = within(document.body)
    const field = page.getByRole("combobox", { name: "Culture" })
    // The panel's edge by the field, on every frame from the first, once it sits just above the field
    const edges: number[] = []
    let frames = 0
    let waited = 0
    const sample = () => {
      const panel = document.querySelector("[data-scope=select][data-part=content]")?.parentElement
      if (panel) {
        frames++
        const gap = field.getBoundingClientRect().top - panel.getBoundingClientRect().bottom
        if (gap > 0 && gap < 32) edges.push(panel.getBoundingClientRect().bottom)
      }
      if (frames < 15 && waited++ < 120) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
    await userEvent.click(field)
    await waitFor(() => expect(frames).toBe(15))

    expect(edges.length).toBeGreaterThan(10)
    const placed = edges[0]!
    for (const edge of edges) expect(edge).toBeLessThanOrEqual(placed + 0.5)
    expect(edges.at(-1)).toBeLessThan(placed - 3)
    await settled()
  },
}

/** From 640px the close button is not shown, as the list is a dropdown that a tap anywhere else closes. */
export const TestNoCloseButtonOnWideScreens: Story = {
  name: "Test: No close button on wide screens",
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("combobox", { name: "Culture" }))
    await page.findByRole("listbox")
    expect(page.queryByRole("button", { name: "Fermer" })).toBeNull()
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
 * Chips there from the start show at once. The cross takes its choice out, named by its words, and the field takes the
 * focus; the chip shrinks away, and the form no longer carries the choice. A choice made in the list pops a chip in.
 */
export const TestChoosingSeveralAsChips: Story = {
  name: "Test: Choosing several as chips",
  render: (args) => <Cultures {...args} defaultValue={["colza", "orge"]} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const chips = () => [...canvasElement.querySelectorAll("[data-part=chip]")].map((chip) => chip.textContent)
    expect(chips()).toEqual(["ColzaRetirer Colza", "Orge d'hiverRetirer Orge d'hiver"])
    expect(canvasElement.getAnimations({ subtree: true })).toEqual([])
    const field = canvas.getByRole("combobox", { name: "Cultures" })
    // The field still says its value to a screen reader, from words only it reads
    expect(field).toHaveTextContent("Colza, Orge d'hiver")

    const colza = canvasElement.querySelector("[data-part=chip]")!
    await userEvent.click(canvas.getByRole("button", { name: "Retirer Colza" }))
    expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: ["orge"] }))
    expect(colza).toHaveAttribute("data-state", "closed")
    await waitFor(() => expect(colza.isConnected).toBe(false))
    expect(chips()).toEqual(["Orge d'hiverRetirer Orge d'hiver"])
    await waitFor(() => expect(field).toHaveFocus())
    expect(new FormData(canvasElement.querySelector("form")!).getAll("cultures")).toEqual(["orge"])

    await userEvent.click(field)
    await userEvent.click(await within(document.body).findByRole("option", { name: "Maïs grain" }))
    const mais = [...canvasElement.querySelectorAll("[data-part=chip]")].find((chip) =>
      chip.textContent?.startsWith("Maïs"),
    )!
    expect(mais.getAnimations().length).toBeGreaterThan(0)
    await userEvent.keyboard("{Escape}")
    await settled()
  },
}

/**
 * A choice taken out and chosen again before its chip has gone turns its chip round where it is: the same chip comes
 * back, it does not leave and pop in anew.
 */
export const TestChangingYourMindAboutAChip: Story = {
  name: "Test: Changing your mind about a chip",
  render: (args) => <Cultures {...args} defaultValue={["colza"]} />,
  play: async ({ canvasElement }) => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("combobox", { name: "Cultures" }))
    const option = await page.findByRole("option", { name: "Colza" })
    await settled()
    const chip = canvasElement.querySelector("[data-part=chip]")!
    await userEvent.click(option)
    expect(chip).toHaveAttribute("data-state", "closed")
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    await userEvent.click(option)
    expect(chip).toHaveAttribute("data-state", "open")
    await settled()
    expect(chip.isConnected).toBe(true)
    expect(Number(getComputedStyle(chip).opacity)).toBe(1)
  },
}

/** The chips after one taken out slide back into its room instead of jumping there */
export const TestTheOthersSlideBack: Story = {
  name: "Test: The others slide back",
  render: (args) => <Cultures {...args} defaultValue={["colza", "orge", "mais"]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const last = [...canvasElement.querySelectorAll<HTMLElement>("[data-part=chip]")].at(-1)!
    const before = last.getBoundingClientRect()
    const away = () => {
      const now = last.getBoundingClientRect()
      return Math.hypot(now.left - before.left, now.top - before.top)
    }
    await userEvent.click(canvas.getByRole("button", { name: "Retirer Colza" }))
    await waitFor(() =>
      expect(last.getAnimations().some((animation) => animation.id === "bloom-chip-slide")).toBe(true),
    )
    // On its way, it starts from where it was, and ends in the room the chip left
    expect(away()).toBeLessThan(10)
    await settled()
    expect(away()).toBeGreaterThan(40)
  },
}

/**
 * While the options load, the list is marked busy and shows rows of skeleton bars, hidden from assistive technology,
 * and a status says it in the app's words. Then the options take their place.
 */
export const TestLoadingTheOptions: Story = {
  name: "Test: Loading the options",
  render: () => <LoadingCultures delay={800} />,
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("combobox", { name: "Culture" }))
    const list = await page.findByRole("listbox")
    await waitFor(() => expect(list).toHaveAttribute("aria-busy", "true"))
    expect(page.getByRole("status")).toHaveTextContent("Chargement des cultures…")
    const rows = document.querySelector("[data-scope=select][data-part=loading] [aria-hidden=true]")!
    expect(rows.children).toHaveLength(3)
    expect(rows.getBoundingClientRect().height).toBeGreaterThanOrEqual(3 * 48)

    await waitFor(() => expect(page.getAllByRole("option")).toHaveLength(6), { timeout: 3000 })
    expect(list).not.toHaveAttribute("aria-busy")
    expect(page.getByRole("status")).toHaveTextContent("")
    expect(document.querySelector("[data-scope=select][data-part=loading] [aria-hidden=true]")).toBeNull()
    await settled()
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

export const TestLoadingInDarkTheme: Story = {
  ...Loading,
  name: "Test: Loading in dark theme",
  globals: { theme: "dark" },
  // The sheen loops for as long as it loads: wait for the panel to be in place, and measure it at full opacity
  play: async () => {
    await waitFor(() =>
      expect(
        document
          .getAnimations()
          .filter(
            (animation) => animation.playState === "running" && animation.effect?.getTiming().iterations !== Infinity,
          ),
      ).toEqual([]),
    )
  },
}
