import { expect, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { settled } from "../foundations/settled.js"
import { NavigationMenu } from "./index.js"

function MainNavigation(props: Partial<NavigationMenu.RootProps>) {
  return (
    <NavigationMenu.Root aria-label="Navigation principale" class="w-[min(48rem,100%)]" {...props}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="parcelles">
          <NavigationMenu.Item.Trigger>Parcelles</NavigationMenu.Item.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="#parcelles">Toutes les parcelles</NavigationMenu.Link>
            <NavigationMenu.Link href="#carte">Carte des parcelles</NavigationMenu.Link>
            <NavigationMenu.Link href="#assolement">Assolement 2026</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="interventions">
          <NavigationMenu.Item.Trigger>Interventions</NavigationMenu.Item.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="#cahier">Cahier de culture</NavigationMenu.Link>
            <NavigationMenu.Link href="#traitements">Traitements</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="stocks">
          <NavigationMenu.Link href="#stocks" current>
            Stocks
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}

const meta = {
  title: "Components/NavigationMenu",
  component: MainNavigation,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof MainNavigation>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A named landmark with a list of sections, where the page being shown is marked as current and a section opens its
 * panel of links under it. Its props are in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    openDelay: { control: { type: "number", min: 0 } },
    closeDelay: { control: { type: "number", min: 0 } },
    disableClickTrigger: { control: "boolean" },
    disableHoverTrigger: { control: "boolean" },
  },
}

/**
 * A named landmark with a list of sections. The page being shown is marked as current. A section opens its panel of
 * links under it, the arrow keys move between sections, and Escape closes the panel with focus back on its section.
 */
export const TestOpeningASection: Story = {
  name: "Test: Opening a section",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole("navigation", { name: "Navigation principale" })
    expect(within(nav).getAllByRole("listitem")).toHaveLength(3)
    expect(canvas.getByRole("link", { name: "Stocks" })).toHaveAttribute("aria-current", "page")

    const parcels = canvas.getByRole("button", { name: "Parcelles" })
    await userEvent.click(parcels)
    expect(parcels).toHaveAttribute("aria-expanded", "true")
    const link = await canvas.findByRole("link", { name: "Carte des parcelles" })
    await settled()
    expect(link).toBeVisible()
    expect(link.getBoundingClientRect().top).toBeGreaterThan(parcels.getBoundingClientRect().bottom)

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(parcels).toHaveAttribute("aria-expanded", "false"))
    expect(parcels).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    expect(canvas.getByRole("button", { name: "Interventions" })).toHaveFocus()
    await settled()
  },
}

/** On a phone the panel spans the bar, under the sections, rather than hang off the edge of the screen */
export const TestOnAPhone: Story = {
  name: "Test: On a phone",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Interventions" }))
    const link = await canvas.findByRole("link", { name: "Traitements" })
    await settled()
    const panel = link.closest("[data-part=content]")!.getBoundingClientRect()
    const bar = canvas.getByRole("list").getBoundingClientRect()
    expect(panel.left).toBeCloseTo(bar.left, 0)
    expect(panel.right).toBeCloseTo(bar.right, 0)
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(innerWidth)
  },
}

/** Stacked, for a side bar or a menu in a dialog. A panel opens in place and pushes the next sections down. */
export const TestVertical: Story = {
  name: "Test: Vertical",
  args: { orientation: "vertical", class: "w-72" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const interventions = canvas.getByRole("button", { name: "Interventions" })
    const before = interventions.getBoundingClientRect().top
    await userEvent.click(canvas.getByRole("button", { name: "Parcelles" }))
    await canvas.findByRole("link", { name: "Carte des parcelles" })
    await settled()
    expect(interventions.getBoundingClientRect().top).toBeGreaterThan(before + 100)
  },
}

export const TestOpenInDarkTheme: Story = {
  name: "Test: Open in dark theme",
  args: { defaultValue: "parcelles" },
  globals: { theme: "dark" },
  play: settled,
}

export const TestOpenWithMoreContrast: Story = {
  name: "Test: Open with more contrast",
  args: { defaultValue: "parcelles" },
  globals: { contrast: "more" },
  play: settled,
}
