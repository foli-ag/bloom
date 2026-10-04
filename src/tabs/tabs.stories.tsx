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

/** A tap on a tab shows its page, named after it, and the bar slides under it. Its props are in the Controls panel. */
export const Playground: Story = {
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    activationMode: { control: "inline-radio", options: ["automatic", "manual"] },
    loopFocus: { control: "boolean" },
    deselectable: { control: "boolean" },
    variant: { control: "inline-radio", options: ["line", "segmented"] },
  },
}

/**
 * A few short views of one thing, in a track: a pill slides and stretches behind the chosen tab, as on a phone, its
 * ends staying round however wide the next tab is
 */
export const Segmented: Story = {
  args: { variant: "segmented" },
}

export const SegmentedVertical: Story = {
  args: { variant: "segmented", orientation: "vertical", defaultValue: "analyses" },
}

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
 * so the two never show together. The page shown with the screen is there at once, with no fade.
 */
export const TestTappingATab: Story = {
  name: "Test: Tapping a tab",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole("tablist", { name: "Les Grands Champs" })).toBeVisible()
    expect(canvas.getByRole("tabpanel", { name: "Résumé" }).getAnimations()).toEqual([])
    await settled()
    expectIndicatorUnder(canvas.getByRole("tab", { name: "Résumé" }))

    const tab = canvas.getByRole("tab", { name: "Interventions" })
    await userEvent.click(tab)
    expect(tab).toHaveAttribute("aria-selected", "true")
    expect(canvas.getByRole("tabpanel", { name: "Interventions" })).toHaveTextContent("14 interventions")
    expect(canvas.queryByText(/Blé tendre/)).not.toBeVisible()
    expect(args.onValueChange).toHaveBeenLastCalledWith({ value: "interventions" })
    // The bar slides and stretches by its transform alone, which goes on while the page is busy showing the new tab
    const bar = canvasElement.querySelector("[data-part=indicator]")!
    const moving = bar.getAnimations({ subtree: true }) as CSSTransition[]
    expect(moving.length).toBeGreaterThan(0)
    for (const transition of moving) expect(["translate", "scale"]).toContain(transition.transitionProperty)
    await settled()
    expectIndicatorUnder(tab)
    expect(tab.getBoundingClientRect().height).toBeGreaterThanOrEqual(48)
  },
}

/** The arrow keys move between the tabs and show each page; Tab then goes into the page */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    expect(canvas.getByRole("tab", { name: "Résumé" })).toHaveFocus()
    // Its ring shows, whole from the first frame
    const ring = getComputedStyle(canvas.getByRole("tab", { name: "Résumé" }))
    expect(ring.outlineStyle).not.toBe("none")
    const easing = canvas.getByRole("tab", { name: "Résumé" }).getAnimations() as CSSTransition[]
    expect(easing.map((transition) => transition.transitionProperty)).not.toContain("outline-color")
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
export const TestOnAPhone: Story = {
  name: "Test: On a phone",
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
export const TestVertical: Story = {
  name: "Test: Vertical",
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

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
  play: settled,
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  globals: { contrast: "more" },
  play: settled,
}

/** The pill's box against its tab's. Zag measures in whole pixels, so it may sit half a pixel off a tab at a fraction. */
function expectPillBehind(tab: HTMLElement) {
  const pill = document.querySelector("[data-scope=tabs][data-part=indicator]")!.getBoundingClientRect()
  const box = tab.getBoundingClientRect()
  expect(Math.abs(pill.left - box.left)).toBeLessThanOrEqual(1)
  expect(Math.abs(pill.top - box.top)).toBeLessThanOrEqual(1)
  expect(Math.abs(pill.width - box.width)).toBeLessThanOrEqual(1)
}

/**
 * In a track, the pill is behind the chosen tab from the first frame. A tap slides it to the next tab and stretches it
 * to that tab's width by its transform alone: the box moves by `translate`, and its end cap and middle by `translate`
 * and `scale`, so its ends stay round. The chosen tab's ring is drawn where the pill's edge is.
 */
export const TestSegmentedTapping: Story = {
  name: "Test: Segmented, tapping a tab",
  args: { variant: "segmented" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await settled()
    expectPillBehind(canvas.getByRole("tab", { name: "Résumé" }))
    const tab = canvas.getByRole("tab", { name: "Analyses de sol" })
    await userEvent.click(tab)
    const pill = canvasElement.querySelector("[data-part=indicator]")!
    const moving = pill.getAnimations({ subtree: true }) as CSSTransition[]
    expect(moving.map((transition) => transition.transitionProperty).sort()).toEqual([
      "scale",
      "translate",
      "translate",
    ])
    await settled()
    expectPillBehind(tab)
    expect(tab.getBoundingClientRect().height).toBeGreaterThanOrEqual(48)
    await userEvent.keyboard("{ArrowLeft}")
    const interventions = canvas.getByRole("tab", { name: "Interventions" })
    await waitFor(() => expect(interventions).toHaveFocus())
    const ring = getComputedStyle(interventions)
    expect(ring.outlineStyle).toBe("solid")
    expect(Number.parseFloat(ring.outlineOffset) + Number.parseFloat(ring.outlineWidth)).toBeLessThanOrEqual(0)
    await settled()
    expectPillBehind(interventions)
  },
}

/** Down the side, the pill slides from tab to tab in a column */
export const TestSegmentedVertical: Story = {
  name: "Test: Segmented, vertical",
  args: { variant: "segmented", orientation: "vertical" },
  play: async ({ canvasElement }) => {
    const tab = within(canvasElement).getByRole("tab", { name: "Analyses de sol" })
    await userEvent.click(tab)
    await settled()
    expectPillBehind(tab)
  },
}

/** On a phone a track wider than the screen scrolls sideways, and the pill scrolls with its tab */
export const TestSegmentedOnAPhone: Story = {
  name: "Test: Segmented on a phone",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: (args) => (
    <Tabs.Root variant="segmented" defaultValue="Résumé" onValueChange={args.onValueChange}>
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
    const documents = within(canvasElement).getByRole("tab", { name: "Documents" })
    await userEvent.click(documents)
    await settled()
    expectPillBehind(documents)
  },
}

export const TestSegmentedInDarkTheme: Story = {
  name: "Test: Segmented in dark theme",
  globals: { theme: "dark" },
  args: { variant: "segmented" },
  play: settled,
}

export const TestSegmentedWithMoreContrast: Story = {
  name: "Test: Segmented with more contrast",
  globals: { contrast: "more" },
  args: { variant: "segmented" },
  play: settled,
}
