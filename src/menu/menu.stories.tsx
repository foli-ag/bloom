import { createSignal } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { Menu } from "./index.js"

function ParcelActions(props: Partial<Menu.RootProps>) {
  return (
    <Menu.Root {...props}>
      <Menu.Trigger as={Button} tone="neutral" variant="outline">
        Actions <Menu.Indicator />
      </Menu.Trigger>
      <Menu.Content>
        <Menu.List>
          <Menu.Item value="modifier">Modifier</Menu.Item>
          <Menu.Item value="dupliquer">Dupliquer</Menu.Item>
          <Menu.Item value="archiver" disabled>
            Archiver
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item value="supprimer" tone="danger">
            Supprimer la parcelle
          </Menu.Item>
        </Menu.List>
        <Menu.Close as={Button} tone="neutral" variant="outline" block>
          Fermer
        </Menu.Close>
      </Menu.Content>
    </Menu.Root>
  )
}

const meta = {
  title: "Components/Menu",
  component: ParcelActions,
  tags: ["autodocs"],
  args: { onSelect: fn() },
} satisfies Meta<typeof ParcelActions>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The menu drops down from its trigger, whose chevron turns, and choosing an item reports its value and closes it. Its
 * props are in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    closeOnSelect: { control: "boolean" },
    loopFocus: { control: "boolean" },
    typeahead: { control: "boolean" },
  },
}

export const Open: Story = {
  args: { defaultOpen: true },
  play: settled,
}

/**
 * The menu drops down from its trigger, whose chevron turns. Choosing an item reports its value, closes the menu and
 * sends focus back to the trigger. A disabled item is skipped by the arrow keys.
 */
export const TestChoosingAnItem: Story = {
  name: "Test: Choosing an item",
  play: async ({ args }) => {
    const page = within(document.body)
    const trigger = page.getByRole("button", { name: "Actions" })
    await userEvent.click(trigger)
    const menu = await page.findByRole("menu", { name: "Actions" })
    await settled()
    expect(menu.getBoundingClientRect().top).toBeGreaterThan(trigger.getBoundingClientRect().bottom)
    expect(trigger.querySelector("[data-part=indicator]")).toHaveAttribute("data-state", "open")

    await userEvent.click(page.getByRole("menuitem", { name: "Dupliquer" }))
    await waitFor(() => expect(page.queryByRole("menu")).toBeNull())
    expect(args.onSelect).toHaveBeenLastCalledWith({ value: "dupliquer" })
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

/** From the keyboard: Enter opens it on the first item, the arrows skip what is disabled, Escape closes it */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  play: async ({ args }) => {
    const page = within(document.body)
    const trigger = page.getByRole("button", { name: "Actions" })
    trigger.focus()
    await userEvent.keyboard("{Enter}")
    // The menu takes focus on the next frame
    const menu = await page.findByRole("menu")
    await waitFor(() => expect(menu).toHaveFocus())
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await waitFor(() =>
      expect(page.getByRole("menuitem", { name: "Supprimer la parcelle" })).toHaveAttribute("data-highlighted"),
    )
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(page.queryByRole("menu")).toBeNull())
    expect(args.onSelect).not.toHaveBeenCalled()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

/**
 * On a phone the items rise from the bottom as a sheet, with a close button at its foot that closes it without
 * choosing, and sends focus back to the trigger.
 */
export const TestOnAPhone: Story = {
  name: "Test: On a phone",
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async ({ args }) => {
    const page = within(document.body)
    const trigger = page.getByRole("button", { name: "Actions" })
    await userEvent.click(trigger)
    const menu = await page.findByRole("menu")
    await settled()
    const panel = menu.parentElement!.getBoundingClientRect()
    expect(panel.bottom).toBeCloseTo(innerHeight, 0)
    expect(panel.width).toBeCloseTo(innerWidth, 0)

    await userEvent.click(page.getByRole("button", { name: "Fermer" }))
    await waitFor(() => expect(page.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(args.onSelect).not.toHaveBeenCalled()
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

function MapOptions() {
  const [fallow, setFallow] = createSignal(true)
  const [order, setOrder] = createSignal("nom")
  return (
    <Menu.Root>
      <Menu.Trigger as={Button} tone="neutral" variant="outline">
        Affichage <Menu.Indicator />
      </Menu.Trigger>
      <Menu.Content>
        <Menu.List>
          <Menu.Item.Checkbox value="jachere" checked={fallow()} onCheckedChange={setFallow}>
            Parcelles en jachère
          </Menu.Item.Checkbox>
          <Menu.Separator />
          <Menu.Group.Radio value={order()} onValueChange={(details) => setOrder(details.value)}>
            <Menu.Group.Label>Trier par</Menu.Group.Label>
            <Menu.Item.Radio value="nom">Nom</Menu.Item.Radio>
            <Menu.Item.Radio value="surface">Surface</Menu.Item.Radio>
          </Menu.Group.Radio>
        </Menu.List>
        <Menu.Close as={Button} tone="neutral" variant="outline" block>
          Fermer
        </Menu.Close>
      </Menu.Content>
    </Menu.Root>
  )
}

/** Settings in a menu: one that is on or off, and one choice among a few. What is on is ticked, and announced so. */
export const TestWithSettings: Story = {
  name: "Test: With settings",
  render: () => <MapOptions />,
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("button", { name: "Affichage" }))
    const fallow = await page.findByRole("menuitemcheckbox", { name: "Parcelles en jachère" })
    await settled()
    expect(fallow).toHaveAttribute("aria-checked", "true")
    expect(page.getByRole("group", { name: "Trier par" })).toBeVisible()
    await userEvent.click(page.getByRole("menuitemradio", { name: "Surface" }))
    await userEvent.click(page.getByRole("button", { name: "Affichage" }))
    expect(await page.findByRole("menuitemradio", { name: "Surface" })).toHaveAttribute("aria-checked", "true")
    expect(page.getByRole("menuitemradio", { name: "Nom" })).toHaveAttribute("aria-checked", "false")
    await settled()
  },
}
