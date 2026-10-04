import { For } from "solid-js"
import { expect, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { settled } from "../foundations/settled.js"
import { Breadcrumb } from "./index.js"

const trail = [
  ["Accueil", "#accueil"],
  ["Exploitations", "#exploitations"],
  ["GAEC du Moulin", "#moulin"],
  ["Parcelles", "#parcelles"],
] as const

function Trail(props: { pages?: readonly (readonly [string, string])[]; current?: string }) {
  return (
    <Breadcrumb.Root aria-label="Fil d'Ariane">
      <Breadcrumb.List>
        <Breadcrumb.Ellipsis>Afficher tout le chemin</Breadcrumb.Ellipsis>
        <For each={props.pages ?? trail}>
          {([name, href]) => (
            <Breadcrumb.Item>
              <Breadcrumb.Link href={href}>{name}</Breadcrumb.Link>
            </Breadcrumb.Item>
          )}
        </For>
        <Breadcrumb.Item>
          <Breadcrumb.Link current>{props.current ?? "Les Grands Champs"}</Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}

const meta = {
  title: "Components/Breadcrumb",
  component: Trail,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Trail>

export default meta
type Story = StoryObj<typeof meta>

/** A trail from the top of the app down to the field the farmer is on. Its props are in the Controls panel. */
export const Playground: Story = {
  argTypes: { current: { control: "text" } },
}

/** Three pages: short enough to show whole, even on a phone */
export const Short: Story = {
  render: () => <Trail pages={[trail[0], trail[3]]} />,
}

/** On a phone a long trail keeps to one line: the start folds into three dots, and the parent and the page stay */
export const OnAPhone: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
}

/**
 * A landmark named by the app, holding an ordered list. The current page is marked as such and is no link. The chevrons
 * are hidden from assistive technology, and every link is a 48px target.
 */
export const TestWhatAScreenReaderGets: Story = {
  name: "Test: What a screen reader gets",
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole("navigation", { name: "Fil d'Ariane" })
    const list = within(nav).getByRole("list")
    expect(list.tagName).toBe("OL")
    expect(
      within(list)
        .getAllByRole("listitem")
        .filter((item) => item.checkVisibility()),
    ).toHaveLength(5)
    expect(within(nav).getAllByRole("link")).toHaveLength(4)
    const current = canvas.getByText("Les Grands Champs")
    expect(current).toHaveAttribute("aria-current", "page")
    expect(current).not.toHaveAttribute("href")
    for (const separator of nav.querySelectorAll("[data-part=separator]"))
      expect(separator).toHaveAttribute("aria-hidden", "true")
    // The first page has no chevron before it, the others do
    const shown = [...nav.querySelectorAll("[data-part=separator]")].map((separator) => separator.checkVisibility())
    expect(shown).toEqual([false, true, true, true, true])
    for (const link of within(nav).getAllByRole("link"))
      expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(48)
    expect(canvas.queryByRole("button")).toBeNull()
  },
}

/**
 * On a phone the trail stays on one line, the parent and the page after three dots. The dots unfold the whole trail,
 * and focus moves to its first page.
 */
export const TestUnfoldingOnAPhone: Story = {
  ...OnAPhone,
  name: "Test: Unfolding on a phone",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const visible = () => canvas.getAllByRole("link").filter((link) => link.checkVisibility())
    expect(visible().map((link) => link.textContent)).toEqual(["Parcelles"])
    const tops = new Set(
      [...canvasElement.querySelectorAll("li")]
        .filter((item) => item.checkVisibility())
        .map((item) => Math.round(item.getBoundingClientRect().top)),
    )
    expect(tops.size).toBe(1)
    // Nothing moves as the page loads
    expect(canvasElement.getAnimations({ subtree: true })).toEqual([])

    await userEvent.click(canvas.getByRole("button", { name: "Afficher tout le chemin" }))
    await waitFor(() => expect(visible()).toHaveLength(4))
    await waitFor(() => expect(canvas.getByRole("link", { name: "Accueil" })).toHaveFocus())
    expect(canvas.queryByRole("button")).toBeNull()
    await settled()
  },
}

/** A short trail is not folded on a phone, as it fits */
export const TestAShortTrailOnAPhone: Story = {
  ...Short,
  name: "Test: A short trail on a phone",
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getAllByRole("link").every((link) => link.checkVisibility())).toBe(true)
    expect(canvas.queryByRole("button")).toBeNull()
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  globals: { contrast: "more" },
}
