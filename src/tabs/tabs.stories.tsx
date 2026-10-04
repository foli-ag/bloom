import { For } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { settled } from "../foundations/settled.js"
import { Tabs } from "./index.js"

const pages = [
  { value: "resume", label: "Résumé", text: "Blé tendre sur 12,4 ha, semé le 14 octobre." },
  { value: "interventions", label: "Interventions", text: "14 interventions cette campagne, la dernière le 2 mars." },
  { value: "analyses", label: "Analyses de sol", text: "pH 6,8, dernière analyse en février 2025." },
]

function Parcel(props: Partial<Tabs.RootProps>) {
  return (
    <Tabs.Root defaultValue="resume" {...props} class="w-full max-w-xl">
      <Tabs.List aria-label="Les Grands Champs">
        <For each={pages}>{(page) => <Tabs.Trigger value={page.value}>{page.label}</Tabs.Trigger>}</For>
        <Tabs.Indicator />
      </Tabs.List>
      <For each={pages}>{(page) => <Tabs.Content value={page.value}>{page.text}</Tabs.Content>}</For>
    </Tabs.Root>
  )
}

const meta = {
  title: "Components/Tabs",
  component: Parcel,
  tags: ["autodocs"],
  args: { onValueChange: fn() },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Parcel>

export default meta
type Story = StoryObj<typeof meta>

/** Under the tab whose page shows */
function expectIndicatorUnder(tab: HTMLElement) {
  const bar = document.querySelector("[data-scope=tabs][data-part=indicator]")!.getBoundingClientRect()
  const { left, width, bottom } = tab.getBoundingClientRect()
  expect(bar.left).toBeCloseTo(left, 0)
  expect(bar.width).toBeCloseTo(width, 0)
  expect(bar.bottom).toBeCloseTo(bottom, 0)
}

/**
 * A tap on a tab shows its page, named after it, and the bar slides under it. The page it replaces is gone at once,
 * so the two never show together.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole("tablist", { name: "Les Grands Champs" })).toBeVisible()
    await settled()
    expectIndicatorUnder(canvas.getByRole("tab", { name: "Résumé" }))

    const tab = canvas.getByRole("tab", { name: "Interventions" })
    await userEvent.click(tab)
    expect(tab).toHaveAttribute("aria-selected", "true")
    expect(canvas.getByRole("tabpanel", { name: "Interventions" })).toHaveTextContent("14 interventions")
    expect(canvas.queryByText(/Blé tendre/)).not.toBeVisible()
    expect(args.onValueChange).toHaveBeenLastCalledWith({ value: "interventions" })
    await settled()
    expectIndicatorUnder(tab)
    expect(tab.getBoundingClientRect().height).toBeGreaterThanOrEqual(48)
  },
}

/** The arrow keys move between the tabs and show each page; Tab then goes into the page */
export const WithTheKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    expect(canvas.getByRole("tab", { name: "Résumé" })).toHaveFocus()
    // Zag moves focus on the next frame, so each key waits for the one before it
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(canvas.getByRole("tab", { name: "Interventions" })).toHaveFocus())
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(canvas.getByRole("tab", { name: "Analyses de sol" })).toHaveFocus())
    // It fades in from an opacity of 0, which counts as hidden until it has begun
    await waitFor(() => expect(canvas.getByRole("tabpanel", { name: "Analyses de sol" })).toBeVisible())
    await userEvent.tab()
    expect(canvas.getByRole("tabpanel", { name: "Analyses de sol" })).toHaveFocus()
  },
}

const phonePages = ["Résumé", "Interventions", "Analyses de sol", "Photos", "Documents"]

/** On a phone the row is wider than the screen and scrolls sideways; the bar stays under its tab */
export const OnAPhone: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: (args) => (
    <Tabs.Root defaultValue="Analyses de sol" onValueChange={args.onValueChange}>
      <Tabs.List aria-label="Les Grands Champs">
        <For each={phonePages}>{(label) => <Tabs.Trigger value={label}>{label}</Tabs.Trigger>}</For>
        <Tabs.Indicator />
      </Tabs.List>
      <For each={phonePages}>{(label) => <Tabs.Content value={label}>{label} de la parcelle</Tabs.Content>}</For>
    </Tabs.Root>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole("tablist")
    expect(list.scrollWidth).toBeGreaterThan(list.clientWidth)
    await settled()
    const documents = within(canvasElement).getByRole("tab", { name: "Documents" })
    await userEvent.click(documents)
    await settled()
    expectIndicatorUnder(documents)
  },
}

/** Down the side, the bar runs beside the chosen tab */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  play: async ({ canvasElement }) => {
    const tab = within(canvasElement).getByRole("tab", { name: "Analyses de sol" })
    await userEvent.click(tab)
    await settled()
    const bar = canvasElement.querySelector("[data-part=indicator]")!.getBoundingClientRect()
    const box = tab.getBoundingClientRect()
    expect(bar.top).toBeCloseTo(box.top, 0)
    expect(bar.height).toBeCloseTo(box.height, 0)
  },
}

export const InDarkTheme: Story = {
  globals: { theme: "dark" },
  play: settled,
}

export const WithMoreContrast: Story = {
  globals: { contrast: "more" },
  play: settled,
}
