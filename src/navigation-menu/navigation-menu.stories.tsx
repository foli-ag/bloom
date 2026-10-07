import type { JSX } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import { expect, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { settled } from "../foundations/settled.js"
import { NavigationMenu } from "./index.js"

type MainNavigationProps = Partial<NavigationMenu.RootProps> & {
  /** Leaves the viewport out, so each panel hangs under its own section */
  noViewport?: boolean
}

function MainNavigation(props: MainNavigationProps) {
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
            <NavigationMenu.Link href="#traitements">Traitements phytosanitaires de la saison</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="stocks">
          <NavigationMenu.Link href="#stocks" current>
            Stocks
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      {!props.noViewport && (
        <NavigationMenu.Viewport.Positioner>
          <NavigationMenu.Viewport />
        </NavigationMenu.Viewport.Positioner>
      )}
    </NavigationMenu.Root>
  )
}

const meta = {
  title: "Components/NavigationMenu",
  component: MainNavigation,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    // With a viewport, zag leaves a hidden stand-in where each open panel would be, which hands the focus straight on
    // to the panel: Tab from a section then reaches its links before the next section. It is focusable and
    // aria-hidden by design, and nothing else is let off the rule.
    a11y: {
      config: {
        rules: [
          { id: "color-contrast-enhanced", enabled: true },
          { id: "aria-hidden-focus", selector: "[aria-hidden=true]:not([data-trigger-proxy])" },
        ],
      },
    },
  },
} satisfies Meta<typeof MainNavigation>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A named landmark with a list of sections, where the page being shown is marked as current and a section opens its
 * panel of links under it. Going from one open section to another, the panel slides under the new section and takes
 * its size. Its props are in the Controls panel.
 */
export const Playground: Story = {
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    openDelay: { control: { type: "number", min: 0 } },
    closeDelay: { control: { type: "number", min: 0 } },
    disableClickTrigger: { control: "boolean" },
    disableHoverTrigger: { control: "boolean" },
    noViewport: { control: "boolean" },
  },
}

export const Open: Story = {
  args: { defaultValue: "interventions" },
  play: settled,
}

/** Stacked, for a side bar or a menu in a dialog. A panel folds open in place; the viewport renders nothing. */
export const Vertical: Story = {
  args: { orientation: "vertical", class: "w-72", defaultValue: "parcelles" },
}

/** With no viewport, each panel hangs under its own section, and going to another one swaps them at once */
export const WithoutViewport: Story = {
  args: { noViewport: true },
}

const pages = [
  { href: "#accueil", label: "Accueil", path: "M3 11 12 4l9 7M5 10v10h14V10" },
  { href: "#carte", label: "Carte", path: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14" },
  { href: "#agenda", label: "Agenda", path: "M4 6h16v14H4zM4 10h16M8 3v4m8-4v4" },
  { href: "#stocks", label: "Stocks", path: "M3 8l9-5 9 5v9l-9 5-9-5V8Zm0 0 9 5 9-5M12 13v9" },
  { href: "#compte", label: "Compte", path: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0" },
] as const

function Mark(props: { d: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      class="size-6"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d={props.d} />
    </svg>
  )
}

/** A phone's page with the bottom bar at its foot. The app moves `current` as its router changes page. */
function BottomBar(props: { count?: number }) {
  const [current, setCurrent] = createSignal("#accueil")
  return (
    <div class="pb-24">
      <p class="max-w-prose">Les pages de l'application, en bas de l'écran, à portée du pouce.</p>
      <NavigationMenu.Root variant="bottom" aria-label="Navigation principale">
        <NavigationMenu.List>
          <For each={pages.slice(0, props.count ?? 5)}>
            {(page) => (
              <NavigationMenu.Item value={page.href}>
                <NavigationMenu.Link
                  href={page.href}
                  current={current() === page.href}
                  onClick={(event: MouseEvent) => {
                    event.preventDefault()
                    setCurrent(page.href)
                  }}
                >
                  <Mark d={page.path} />
                  {page.label}
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            )}
          </For>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  )
}

/**
 * Three to five pages of an app in a bar fixed to the foot of a phone's screen, clear of the line a phone draws there.
 * Each is a mark above a short word, both the app's. The current page's mark sits on a filled pill and its word is
 * bold; a press shows a faint pill at once.
 */
export const Bottom: StoryObj<typeof BottomBar> = {
  render: (args) => <BottomBar {...args} />,
  args: { count: 5 },
  argTypes: { count: { control: { type: "range", min: 3, max: 5 } } },
  globals: { viewport: { value: "mobile2", isRotated: false } },
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
    // The panel hangs from its section's start, and zag keeps it 10px off the edge of the screen
    const frame = viewportOf(canvasElement).getBoundingClientRect()
    expect(frame.left).toBeCloseTo(Math.max(parcels.getBoundingClientRect().left, 10), 0)

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(parcels).toHaveAttribute("aria-expanded", "false"))
    expect(parcels).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    const interventions = canvas.getByRole("button", { name: "Interventions" })
    expect(interventions).toHaveFocus()
    // The ring follows the keyboard at once
    expect(getComputedStyle(interventions).outlineStyle).toBe("solid")
    expect(ringTransitions(interventions)).toEqual([])
    await settled()
  },
}

/**
 * A click on a section that hovering has opened keeps its panel open, as someone who hovers and then clicks out of
 * habit means to open it. The next click closes it.
 */
export const TestClickingASectionHoveringOpened: Story = {
  name: "Test: Clicking a section hovering opened",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const parcels = canvas.getByRole("button", { name: "Parcelles" })
    await userEvent.hover(parcels)
    await waitFor(() => expect(parcels).toHaveAttribute("aria-expanded", "true"))
    // Clicks of a mouse that stays put: `userEvent.click` would enter the section again, which opens it by hovering
    parcels.click()
    await settled()
    expect(parcels).toHaveAttribute("aria-expanded", "true")
    expect(canvas.getByRole("link", { name: "Carte des parcelles" })).toBeVisible()

    parcels.click()
    await waitFor(() => expect(parcels).toHaveAttribute("aria-expanded", "false"))
    await settled()
    expect(parcels).toHaveAttribute("aria-expanded", "false")
  },
}

/**
 * Opened from nothing, the panel appears in its own size and place: its card fades and grows, and neither its size nor
 * its place slides, even when the last panel shown was another one.
 */
export const TestOpeningFromNothing: Story = {
  name: "Test: Opening from nothing",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Interventions" }))
    await settled()
    await userEvent.keyboard("{Escape}")
    await settled()
    canvas.getByRole("button", { name: "Parcelles" }).click()
    const frame = viewportOf(canvasElement)
    const moves = await sample(
      () =>
        [
          // The card neither grows nor shrinks, and its positioner does not slide
          ...frame.getAnimations().filter((animation) => ["width", "height"].includes(transitionOf(animation))),
          ...frame.parentElement!.getAnimations(),
        ].map(transitionOf),
      300,
    )
    expect(moves.flat()).toEqual([])
    // It fades in as it comes, from where it lands
    expect(frame).toBeVisible()
    await settled()
  },
}

/**
 * Going from one open section to another moves one card: it slides under the new section and grows to the new links
 * on the smooth spring, never jumping, while the old links slide away fading and the new ones slide in.
 */
export const TestGoingToAnotherSection: Story = {
  name: "Test: Going to another section",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Parcelles" }))
    await settled()
    const frame = viewportOf(canvasElement)
    const from = frame.getBoundingClientRect()
    // A click and no hover, which would open the section on its own first
    canvas.getByRole("button", { name: "Interventions" }).click()
    const rects = await sample(() => frame.getBoundingClientRect(), 700)
    const to = rects.at(-1)!
    expect(to.width).toBeGreaterThan(from.width + 40)
    expect(to.left).toBeGreaterThan(from.left + 40)
    // On its way, it passes through sizes and places between the two, a little at a time
    const widths = rects.map((rect) => rect.width)
    expect(widths.filter((width) => width > from.width + 1 && width < to.width - 1).length).toBeGreaterThan(4)
    expect(largestStep([from.width, ...widths])).toBeLessThan((to.width - from.width) / 3)
    expect(largestStep([from.left, ...rects.map((rect) => rect.left)])).toBeLessThan((to.left - from.left) / 3)
    await settled()
    const panels = canvasElement.ownerDocument.querySelectorAll<HTMLElement>("[data-part=content]:not([hidden])")
    expect(panels).toHaveLength(1)
    expect(within(panels[0]!).getByRole("link", { name: /Traitements/ })).toBeVisible()
  },
}

/** Changing one's mind half way, the card turns round from where it had got to, without jumping to either end */
export const TestChangingItsMindHalfWay: Story = {
  name: "Test: Changing its mind half way",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Parcelles" }))
    await settled()
    const frame = viewportOf(canvasElement)
    const start = frame.getBoundingClientRect().width
    canvas.getByRole("button", { name: "Interventions" }).click()
    const way = await sample(() => frame.getBoundingClientRect().width, 120)
    canvas.getByRole("button", { name: "Parcelles" }).click()
    const back = await sample(() => frame.getBoundingClientRect().width, 700)
    const widths = [start, ...way, ...back]
    expect(Math.max(...way)).toBeGreaterThan(start + 5)
    expect(back.at(-1)).toBeCloseTo(start, 0)
    expect(largestStep(widths)).toBeLessThan((Math.max(...widths) - start) / 2)
    await settled()
    expect(within(viewportOf(canvasElement)).getByRole("link", { name: "Carte des parcelles" })).toBeVisible()
  },
}

/** Under reduced motion the card is at its new size and place at once, and the links only fade */
export const TestWithReducedMotion: Story = {
  name: "Test: With reduced motion",
  globals: { motion: "reduced" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Parcelles" }))
    await settled()
    const frame = viewportOf(canvasElement)
    const before = frame.getBoundingClientRect()
    canvas.getByRole("button", { name: "Interventions" }).click()
    const rects = await sample(() => frame.getBoundingClientRect(), 400)
    const links = await sample(() => canvas.getByRole("link", { name: /Traitements/ }).getBoundingClientRect().left, 50)
    // The card goes from its old size and place to its new ones in one step, and the new links do not slide
    const widths = new Set([before.width, ...rects.map((rect) => Math.round(rect.width))])
    const lefts = new Set([before.left, ...rects.map((rect) => Math.round(rect.left))])
    expect(widths.size).toBeLessThanOrEqual(2)
    expect(lefts.size).toBeLessThanOrEqual(2)
    expect(new Set(links).size).toBe(1)
    // The links still cross by fading
    await settled()
    expect(canvas.getByRole("link", { name: /Traitements/ })).toBeVisible()
  },
}

/** On a phone the panel spans the bar, under the sections, rather than hang off the edge of the screen */
export const TestOnAPhone: Story = {
  name: "Test: On a phone",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Interventions" }))
    const link = await canvas.findByRole("link", { name: /Traitements/ })
    await settled()
    const panel = viewportOf(canvasElement).getBoundingClientRect()
    const bar = canvas.getByRole("list").getBoundingClientRect()
    expect(panel.left).toBeCloseTo(bar.left, 0)
    expect(panel.right).toBeCloseTo(bar.right, 0)
    expect(link.getBoundingClientRect().right).toBeLessThanOrEqual(panel.right)
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(innerWidth)
    // Going to another section, the card keeps the width of the bar and takes the new height
    canvas.getByRole("button", { name: "Parcelles" }).click()
    await settled()
    expect(viewportOf(canvasElement).getBoundingClientRect().width).toBeCloseTo(panel.width, 0)
  },
}

/** Stacked, for a side bar or a menu in a dialog. A panel opens in place and pushes the next sections down. */
export const TestVertical: Story = {
  name: "Test: Vertical",
  args: { orientation: "vertical", class: "w-72" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvasElement.querySelector("[data-part=viewport]")).toBeNull()
    const interventions = canvas.getByRole("button", { name: "Interventions" })
    const before = interventions.getBoundingClientRect().top
    await userEvent.click(canvas.getByRole("button", { name: "Parcelles" }))
    await canvas.findByRole("link", { name: "Carte des parcelles" })
    await settled()
    expect(interventions.getBoundingClientRect().top).toBeGreaterThan(before + 100)
  },
}

/** With no viewport, a panel hangs under its own section and going to another one swaps the panels at once */
export const TestWithoutViewport: Story = {
  name: "Test: Without viewport",
  args: { noViewport: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Parcelles" }))
    await settled()
    canvas.getByRole("button", { name: "Interventions" }).click()
    const second = (await canvas.findByRole("link", { name: /Traitements/ })).closest<HTMLElement>(
      "[data-part=content]",
    )!
    await new Promise(requestAnimationFrame)
    expect(getComputedStyle(second).opacity).toBe("1")
    expect(second.getBoundingClientRect().left).toBeCloseTo(
      canvas.getByRole("button", { name: "Interventions" }).getBoundingClientRect().left,
      0,
    )
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

/**
 * Tapping a page makes it current: the bar is at the foot of the screen, every page is a target of at least 48px, the
 * current one is announced and carries a pill, and the pill of the page left fades away.
 */
export const TestBottomBarOnAPhone: StoryObj<typeof BottomBar> = {
  ...Bottom,
  name: "Test: Bottom bar on a phone",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole("navigation", { name: "Navigation principale" })
    expect(nav.getBoundingClientRect().bottom).toBeCloseTo(innerHeight, 0)
    const links = within(nav).getAllByRole("link")
    expect(links).toHaveLength(5)
    for (const link of links) {
      expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(48)
      expect(link.getBoundingClientRect().width).toBeGreaterThanOrEqual(48)
    }
    const home = canvas.getByRole("link", { name: "Accueil" })
    const map = canvas.getByRole("link", { name: "Carte" })
    expect(home).toHaveAttribute("aria-current", "page")
    expect(pill(home).opacity).toBe("1")
    expect(pill(map).opacity).toBe("0")

    await userEvent.click(map)
    expect(map).toHaveAttribute("aria-current", "page")
    expect(home).not.toHaveAttribute("aria-current")
    await settled()
    expect(pill(map).opacity).toBe("1")
    expect(pill(home).opacity).toBe("0")
    // The current page is bold as well as on its pill
    expect(Number(getComputedStyle(map).fontWeight)).toBeGreaterThan(Number(getComputedStyle(home).fontWeight))

    // The keyboard ring is drawn inside the page's cell, at once
    map.focus()
    await userEvent.keyboard("{ArrowRight}")
    const agenda = canvas.getByRole("link", { name: "Agenda" })
    expect(agenda).toHaveFocus()
    const style = getComputedStyle(agenda)
    expect(style.outlineStyle).toBe("solid")
    expect(Number.parseFloat(style.outlineOffset) + Number.parseFloat(style.outlineWidth)).toBeLessThanOrEqual(0)
    expect(ringTransitions(agenda)).toEqual([])
  },
}

export const TestBottomBarInDarkTheme: StoryObj<typeof BottomBar> = {
  ...Bottom,
  name: "Test: Bottom bar in dark theme",
  globals: { ...Bottom.globals, theme: "dark" },
}

export const TestBottomBarWithMoreContrast: StoryObj<typeof BottomBar> = {
  ...Bottom,
  name: "Test: Bottom bar with more contrast",
  globals: { ...Bottom.globals, contrast: "more" },
}

/** The property a transition moves */
function transitionOf(animation: Animation): string {
  return (animation as CSSTransition).transitionProperty
}

/** The card the open panel shows in */
function viewportOf(canvasElement: HTMLElement): HTMLElement {
  return canvasElement.querySelector<HTMLElement>("[data-scope=navigation-menu][data-part=viewport]")!
}

/** The pill of a page in the bottom bar */
function pill(link: Element): CSSStyleDeclaration {
  return getComputedStyle(link, "::before")
}

/** The largest change between two values in a row */
function largestStep(values: number[]): number {
  return Math.max(0, ...values.slice(1).map((value, index) => Math.abs(value - values[index]!)))
}

/** Reads a value on every frame for `ms` milliseconds */
async function sample<T>(read: () => T, ms: number): Promise<T[]> {
  const values: T[] = []
  const end = performance.now() + ms
  while (performance.now() < end) {
    await new Promise(requestAnimationFrame)
    values.push(read())
  }
  return values
}

/** The transitions running on an element's focus ring, which appears at once */
function ringTransitions(element: Element): Animation[] {
  return element
    .getAnimations()
    .filter((animation) => (animation as CSSTransition).transitionProperty === "outline-color")
}
