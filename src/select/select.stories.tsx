import { For } from "solid-js"
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
