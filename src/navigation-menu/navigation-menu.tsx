import { NavigationMenu as Seed, useNavigationMenuContext } from "@foliag/seeds/navigation-menu"
import type { ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { createContext, createSignal, omit, Show, useContext, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { triggerChevron } from "../internal/disclosure.js"
import { Chevron } from "../internal/icons.jsx"

type Variant = "menu" | "bottom"

// The variant of the `Root` around a part. A context and not a selector, so a part reads its own menu's.
const VariantContext = /* @__PURE__ */ createContext<() => Variant>(() => "menu")

export type RootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** What the menu leads through, such as "Navigation principale", when the page has more than one */
  "aria-label"?: string | undefined
  /**
   * `menu`, the default: the sections of an app in a bar, or stacked with `orientation="vertical"`, some opening a
   * panel of links. `bottom`: three to five pages of an app in a bar fixed to the foot of a phone's screen, each a
   * `Link` holding a mark above a short word, with no panels.
   */
  variant?: Variant | undefined
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * The sections of an app, in a bar. A section with pages under it opens a panel of links, on a tap or a click, or on
 * hovering with a mouse. From 640px the panel hangs under its section; on a phone it spans the bar, and the bar wraps
 * onto a second line rather than scroll sideways and hide a section. With a `Viewport` after the list, going from one
 * open section to the next moves one panel: it slides under the new section and takes its size, as the links slide
 * through it.
 *
 * `orientation="vertical"` stacks the sections, for a side bar or a menu inside a Dialog on a phone. A panel then
 * opens in place, under its section, and a section opens on a tap or a click only: opened by hovering, the sections
 * would fold open and shut as the mouse goes down the stack, and move under it. `disableHoverTrigger={false}` gives
 * hovering back.
 *
 * `variant="bottom"` is the bar at the foot of a phone's screen: see `Link`.
 *
 * @example
 * <NavigationMenu.Root aria-label="Navigation principale">
 *   <NavigationMenu.List>
 *     <NavigationMenu.Item value="parcelles">
 *       <NavigationMenu.Item.Trigger>Parcelles</NavigationMenu.Item.Trigger>
 *       <NavigationMenu.Content>
 *         <NavigationMenu.Link as={A} href="/parcelles">Toutes les parcelles</NavigationMenu.Link>
 *         <NavigationMenu.Link as={A} href="/parcelles/carte">Carte</NavigationMenu.Link>
 *       </NavigationMenu.Content>
 *     </NavigationMenu.Item>
 *     <NavigationMenu.Item value="stocks">
 *       <NavigationMenu.Link as={A} href="/stocks" current>Stocks</NavigationMenu.Link>
 *     </NavigationMenu.Item>
 *   </NavigationMenu.List>
 *   <NavigationMenu.Viewport.Positioner>
 *     <NavigationMenu.Viewport />
 *   </NavigationMenu.Viewport.Positioner>
 * </NavigationMenu.Root>
 */
export function Root(props: RootProps): Element {
  const variant = () => props.variant ?? "menu"
  // Zag looks for a viewport once, as the menu starts, and bloom draws one only in a bar of panels. A menu that changes
  // shape starts again, so it finds the viewport that has just appeared, or stops sending panels to one that has gone.
  const shape = () => `${variant()} ${props.orientation ?? "horizontal"}`
  return (
    <VariantContext value={variant}>
      <Show when={shape()} keyed>
        <Menu {...props} />
      </Show>
    </VariantContext>
  )
}

function Menu(props: RootProps): Element {
  // Marked until the first change, while panels have no transition: a section open from the first render, such as the
  // current one in a side bar, is drawn open instead of opening as the page loads
  const [changed, setChanged] = createSignal(false)
  return (
    <Seed.Root
      {...omit(props, "class", "variant", "disableHoverTrigger", "onValueChange")}
      disableHoverTrigger={props.disableHoverTrigger ?? props.orientation === "vertical"}
      onValueChange={(details) => {
        setChanged(true)
        props.onValueChange?.(details)
      }}
      data-initial={changed() ? undefined : ""}
      class={root({ variant: props.variant ?? "menu", class: props.class })}
    />
  )
}

export type ListProps = Omit<Seed.ListProps<"ul">, "class" | "as"> & {
  class?: string | undefined
}

/** The sections, as a list a screen reader counts */
export function List(props: ListProps): Element {
  const variant = useContext(VariantContext)
  return <Seed.List as="ul" {...omit(props, "class")} class={list({ variant: variant(), class: props.class })} />
}

export type ItemProps = Omit<Seed.ItemProps<"li">, "class" | "as"> & {
  class?: string | undefined
}

/** A section: a trigger and its panel of links, or a single link. Each has a `value` of its own. */
function ItemRoot(props: ItemProps): Element {
  const variant = useContext(VariantContext)
  return <Seed.Item as="li" {...omit(props, "class")} class={item({ variant: variant(), class: props.class })} />
}

export type ItemTriggerProps = Omit<Seed.ItemTriggerProps, "class" | "children"> & {
  /** The section's name, such as "Parcelles" */
  children: JSX.Element
  class?: string | undefined
}

/** Opens the panel of its section, and is announced as expanded or collapsed. Its chevron turns as it opens. */
function ItemTrigger(props: ItemTriggerProps): Element {
  return (
    <Seed.Item.Trigger {...omit(props, "class", "children")} class={entry({ class: ["group/trigger", props.class] })}>
      {props.children}
      <Chevron class={triggerChevron({ class: "-me-1" })} />
    </Seed.Item.Trigger>
  )
}

export const Item = Object.assign(ItemRoot, { Trigger: ItemTrigger })

export type ContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The panel of links of the section around it. The arrow keys move through its links. With a `Viewport` it is shown
 * in it: going to another section, its links slide a short way out toward the section left behind as they fade, and
 * the new links slide in from the side of the section chosen, while the viewport moves and takes their size. Without
 * one, it is a card that grows out from under its section, and going to another section swaps one card for the other
 * at once. Stacked, it folds open in place and pushes the next sections down.
 */
export function Content(props: ContentProps): Element {
  const api = useNavigationMenuContext()
  const place = () =>
    api().orientation === "vertical" ? "stack" : api().isViewportRendered ? "viewport" : ("bar" as const)
  return (
    <Seed.Content {...omit(props, "class", "children")} class={content({ place: place(), class: props.class })}>
      <Show when={place() === "stack"} fallback={props.children}>
        {/* What folds, which clips while it moves, around the card */}
        <div>
          <div class={foldedCard()}>{props.children}</div>
        </div>
      </Show>
    </Seed.Content>
  )
}

export type ViewportPositionerProps = Omit<Seed.ViewportPositionerProps, "class"> & {
  class?: string | undefined
}

/**
 * Holds the `Viewport` under the bar. From 640px it slides it under the open section, lined up with the section's start
 * and kept on the screen; on a phone it spans the bar. It and its viewport are drawn in a bar of panels only: stacked
 * with `orientation="vertical"`, or with `variant="bottom"`, they render nothing and a panel opens in place.
 */
function ViewportPositioner(props: ViewportPositionerProps): Element {
  const api = useNavigationMenuContext()
  const variant = useContext(VariantContext)
  // Zag measures where the panel goes a frame after it opens. Until it first has, the panel waits unseen rather than
  // show at the start of the bar and jump, as a section open from the first render would.
  const placed = () => {
    const style = api().getRootProps().style
    return typeof style === "object" && (style as Record<string, unknown>)["--viewport-x"] !== undefined
  }
  // Zag lines the panel up with the left of its section: in a right-to-left page, its right is its start
  const align = () => (api().getRootProps().dir === "rtl" ? "end" : "start")
  return (
    <Show when={variant() === "menu" && api().orientation === "horizontal"}>
      <Seed.Viewport.Positioner
        align={align()}
        {...omit(props, "class")}
        class={positioner({ placed: placed(), class: props.class })}
      />
    </Show>
  )
}

export type ViewportProps = Omit<Seed.ViewportProps, "class"> & {
  class?: string | undefined
}

/**
 * The card the open panel shows in, one for all of them. It grows out from under the bar as a section opens. Going to
 * another section, it slides under that section and grows or shrinks to the new links as they slide through it, and
 * an interruption turns it round from where it is. Under reduced motion it is there at once and the links only fade.
 * Place it in a `Viewport.Positioner`, after the `List`.
 */
function ViewportRoot(props: ViewportProps): Element {
  const api = useNavigationMenuContext()
  const variant = useContext(VariantContext)
  return (
    <Show when={variant() === "menu" && api().orientation === "horizontal"}>
      <Seed.Viewport {...omit(props, "class")} class={viewport({ class: props.class })} />
    </Show>
  )
}

export const Viewport = Object.assign(ViewportRoot, { Positioner: ViewportPositioner })

export type LinkProps<As extends ValidComponent = "a"> = Seed.LinkProps<As>

/**
 * A page of the app: a section of its own in the bar, or a row in a panel. `current` marks the page being shown with a
 * bar as well as its color, and tells a screen reader. The bar is under the words of a section in the bar, and along
 * the start of a row in a panel or a stack, which is wider than its words. Render it as the router's link with `as`.
 *
 * With `variant="bottom"` its first child is the page's mark, an icon of the app's 24px across, and the rest its word
 * under it. The current page's mark sits on a filled pill that grows out as the page becomes current, and its word
 * turns bold. A finger going down shows the pill at once, faintly.
 */
export function Link<As extends ValidComponent = "a">(props: LinkProps<As>): Element {
  const variant = useContext(VariantContext)
  const look = () => (variant() === "bottom" ? bottomEntry : entry)
  return (
    <Seed.Link {...omit(props as LinkProps, "class")} class={look()({ class: props.class as string | undefined })} />
  )
}

// Stacked, a section closes as the next one opens, so it folds on the opening's time and the sections below hold still.
// The bottom bar is fixed to the foot of the screen, over the page, which leaves room for it, and its own foot clears
// the line a phone with no button draws at the bottom of the screen.
const root = tv({
  variants: {
    variant: {
      menu: "relative data-[orientation=vertical]:[--collapse-exit-duration:var(--duration-smooth)]",
      bottom: "fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-raised pb-[env(safe-area-inset-bottom)]",
    },
  },
})

const list = tv({
  variants: {
    variant: {
      menu: [
        "flex flex-wrap items-center gap-1",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:flex-nowrap data-[orientation=vertical]:items-stretch",
      ],
      // As many equal columns as pages, which stop spreading out on a tablet
      bottom: "mx-auto grid max-w-xl auto-cols-fr grid-flow-col px-1",
    },
  },
})

// From 640px a panel hangs under its own section. Below, the list holds it, so it spans the bar.
const item = tv({
  variants: {
    variant: {
      menu: "data-[orientation=horizontal]:sm:relative",
      bottom: "flex min-w-0",
    },
  },
})

// A section in the bar and a link in a panel look alike. In a panel or a stack an entry spans it. It is tinted under
// the pointer, at once under the finger, and its ring appears at once: only the colors underneath ease.
const entry = tv({
  base: [
    "relative inline-flex min-h-12 pressable items-center gap-2 rounded-control px-3 py-2 text-start",
    "text-base font-semibold tracking-body text-ink no-underline focus-ring [--focus-inset:3px]",
    "transition-[color,background-color] duration-[var(--press-duration,var(--duration-smooth))]",
    "ease-[var(--press-ease,var(--ease-smooth))]",
    "hover:bg-neutral-soft active:bg-[color-mix(in_oklab,var(--color-neutral-soft),var(--color-ink)_8%)]",
    "data-[state=open]:bg-neutral-soft",
    "aria-[current=page]:text-primary-text",
    "aria-[current=page]:after:absolute aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-primary-edge",
    "aria-[current=page]:after:start-0 aria-[current=page]:after:inset-y-3 aria-[current=page]:after:w-1",
    "[[data-part=item][data-orientation=horizontal]>&]:aria-[current=page]:after:start-3",
    "[[data-part=item][data-orientation=horizontal]>&]:aria-[current=page]:after:end-3",
    "[[data-part=item][data-orientation=horizontal]>&]:aria-[current=page]:after:top-auto",
    "[[data-part=item][data-orientation=horizontal]>&]:aria-[current=page]:after:bottom-1",
    "[[data-part=item][data-orientation=horizontal]>&]:aria-[current=page]:after:h-0.5",
    "[[data-part=item][data-orientation=horizontal]>&]:aria-[current=page]:after:w-auto",
    "in-[[data-scope=navigation-menu][data-part=list][data-orientation=vertical]]:flex",
    "in-[[data-scope=navigation-menu][data-part=list][data-orientation=vertical]]:w-full",
    "in-[[data-scope=navigation-menu][data-part=content]]:flex in-[[data-scope=navigation-menu][data-part=content]]:w-full",
    "disabled:cursor-not-allowed disabled:text-disabled-ink",
    "disabled:hover:bg-transparent disabled:active:bg-transparent",
  ],
})

/*
 * A page in the bottom bar: the whole column is the target, at least 64px tall. The mark, its first child, sits on a
 * pill in the first row, and its word in the second. The pill is the cell's `::before`, placed in the mark's cell
 * before it. Its `scale` draws it with the positioned parts, so the mark is positioned too, to stay over it.
 *
 * The current page's pill is filled with the green of an edge, 3:1 against the bar, and its mark takes the bar's
 * color, so the page is told by a shape and by its bold word, not by a color. As a page becomes current, its pill
 * grows out sideways and pops once past its width, and the pill of the page left fades as it narrows. Under a mouse,
 * and at once under a finger, a faint pill shows, and a finger on the current page darkens its own. Reduced motion
 * keeps its width, so it only fades. The ring is drawn inside the cell and appears at once.
 */
const bottomEntry = tv({
  base: [
    "grid min-h-16 w-full pressable grid-rows-[2rem_auto] content-center justify-items-center gap-1",
    "rounded-control px-1 py-2 text-center text-sm font-medium tracking-body text-muted no-underline",
    "focus-ring [--focus-inset:3px]",
    "transition-[color] duration-(--duration-smooth) ease-smooth",
    "aria-[current=page]:font-semibold aria-[current=page]:text-ink",
    "[&>:first-child]:relative [&>:first-child]:col-start-1 [&>:first-child]:row-start-1 [&>:first-child]:self-center",
    "[&>:first-child]:transition-[color] [&>:first-child]:duration-(--duration-smooth) [&>:first-child]:ease-smooth",
    "aria-[current=page]:[&>:first-child]:text-raised",
    "before:col-start-1 before:row-start-1 before:h-8 before:w-14 before:max-w-full before:rounded-full",
    "before:bg-neutral-soft before:opacity-0 before:scale-x-(--pop-in-scale) before:content-['']",
    "before:[transition:scale_var(--press-duration,var(--duration-exit))_var(--press-ease,var(--ease-smooth)),opacity_var(--press-duration,var(--duration-exit))_var(--press-ease,var(--ease-smooth)),background-color_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth))]",
    "hover:before:scale-x-100 hover:before:opacity-100",
    "hover:before:[transition:scale_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth)),opacity_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth)),background-color_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth))]",
    "pressing:before:scale-x-100 pressing:before:opacity-100",
    "pressing:before:bg-[color-mix(in_oklab,var(--color-neutral-soft),var(--color-ink)_8%)]",
    "aria-[current=page]:before:scale-x-100 aria-[current=page]:before:bg-primary-edge aria-[current=page]:before:opacity-100",
    "aria-[current=page]:before:[transition:scale_var(--press-duration,var(--duration-pop))_var(--press-ease,var(--ease-pop)),opacity_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth)),background-color_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth))]",
    "aria-[current=page]:pressing:before:bg-[color-mix(in_oklab,var(--color-primary-edge),var(--color-ink)_20%)]",
  ],
})

const content = tv({
  base: ["z-50 text-ink", "in-[[data-scope=navigation-menu][data-part=root][data-initial]]:transition-none!"],
  variants: {
    place: {
      // In the viewport, which draws the card around it. The panel shown stays in the flow and gives the viewport its
      // size while nothing moves. A panel on its way out lies over it, at the viewport's corner, so the two cross where
      // they stand. Zag marks the panel arriving `from-start` or `from-end` and the one leaving `to-start` or
      // `to-end`, the start being the left even in a right-to-left page, after where their sections sit in the bar:
      // the new links slide in from the side of their section, and the old ones slide toward the side of theirs,
      // fading on the quicker exit clock so the words of the two barely show at once. Each is a transition and turns
      // round from where it is. A panel that opens from nothing has no mark and appears with its viewport.
      //
      // A panel leaving stays until the viewport has reached its new size, so the viewport is held at sizes zag
      // measured until then: unseen, it takes no presses and a screen reader skips it.
      viewport: [
        "grid gap-1 p-2 outline-none max-sm:w-full sm:w-max sm:min-w-64 sm:max-w-[calc(100vw-2rem)]",
        "[--switch-distance:calc(var(--enter-distance)*2)]",
        "transition-[opacity,translate,visibility] duration-(--duration-smooth) ease-smooth",
        "data-[motion=from-start]:starting:-translate-x-(--switch-distance) data-[motion=from-start]:starting:opacity-0",
        "data-[motion=from-end]:starting:translate-x-(--switch-distance) data-[motion=from-end]:starting:opacity-0",
        "data-[state=closed]:pointer-events-none data-[state=closed]:invisible data-[state=closed]:opacity-0",
        "data-[state=closed]:absolute data-[state=closed]:start-0 data-[state=closed]:top-0",
        "data-[state=closed]:duration-(--duration-exit)",
        "data-[motion=to-start]:-translate-x-(--switch-distance) data-[motion=to-end]:translate-x-(--switch-distance)",
        "data-[state=closed]:animate-[bloom-hold_max(var(--duration-exit),calc(var(--duration-travel)+60ms))_linear_both]",
      ],
      // A card under its section from 640px, across the bar below, that grows out from under the section. Going to
      // another section, the card leaving goes at once and the one arriving is there at once, as in a menu bar: two
      // cards fading across each other would mix their words.
      bar: [
        "absolute inset-x-0 top-full mt-2 grid gap-1 rounded-card border-2 border-strong bg-raised p-2 shadow-overlay",
        "sm:end-auto sm:w-max sm:min-w-64 sm:max-w-[calc(100vw-2rem)]",
        "presence-overlay origin-top sm:origin-top-left sm:rtl:origin-top-right",
        "in-[[data-scope=navigation-menu][data-part=list]:has([data-scope=navigation-menu][data-part=content][data-state=open])]:data-[state=closed]:transition-none!",
        "in-[[data-scope=navigation-menu][data-part=list]:has([data-scope=navigation-menu][data-part=content][data-state=open])]:data-[state=closed]:animate-none!",
        "in-[[data-scope=navigation-menu][data-part=list]:has([data-scope=navigation-menu][data-part=content][data-state=closed]:not([hidden]))]:data-[state=open]:transition-none!",
      ],
      // Folds open in place under its section, pushing the next ones down. While one folds shut as another opens, the
      // sections move under a mouse that has not: zag would take the panel leaving the pointer for the mouse leaving
      // it, and close the menu, so no panel takes the pointer until the fold is over. The `!` beats the
      // `pointer-events` zag sets on the open panel.
      stack: [
        "presence-collapse",
        "in-[[data-scope=navigation-menu][data-part=list]:has([data-scope=navigation-menu][data-part=content][data-state=closed]:not([hidden]))]:pointer-events-none!",
      ],
    },
  },
})

// The card inside a stacked panel, and the gap above it, which fold with it. What the app puts inside keeps its own
// timing.
const foldedCard = tv({
  base: "mt-1 grid gap-1 rounded-card border-2 border-strong bg-raised p-2 [--collapse-exit-duration:initial]",
})

// Under the bar, with the gap a panel keeps from it. From 640px it is moved under the open section by `translate`, on
// the compositor, from where zag measured it should go. It slides there only while one panel gives way to another: a
// panel that opens from nothing is placed at once, still unseen, as the first frame of its way in has no opacity.
const positioner = tv({
  base: [
    "absolute top-full z-50 mt-2 max-sm:inset-x-0 sm:left-0 sm:translate-x-(--viewport-x)",
    "[&:has([data-part=content]:is([data-motion],[data-state=closed]:not([hidden])))]:[transition:translate_var(--duration-travel)_var(--ease-smooth)]",
    "in-[[data-scope=navigation-menu][data-part=root][data-initial]]:transition-none!",
  ],
  variants: {
    placed: { true: "", false: "invisible" },
  },
})

/*
 * The card the panels show in. It comes out of the bar as a floating panel does (`presence-overlay`), from its start
 * corner, and takes the size of the panel in it.
 *
 * While one panel gives way to another, and while it leaves, its size is the one zag measured from the panel, which
 * it follows as a transition, so it grows or shrinks to the new panel and turns round from where it is. It is the one
 * size in the bar that animates by layout: a card drawn by `scale` would stretch its corners and its edge, and its size
 * changes nothing outside it, as it floats. Under reduced motion it takes the new size at once. Otherwise the panel in
 * it sizes it, so a panel that opens from nothing has its own size from the first frame.
 *
 * Leaving, it stays a little longer than the panels in it, unseen, as a panel whose viewport is hidden first is never
 * told its own exit has ended, and would be taken for one still leaving the next time the menu opens.
 *
 * Zag sets `transition: none` on it while a section is open with none before it, which is also after a change of
 * panels has ended and in the middle of the viewport's own way in or out: the `!` keeps bloom's transitions.
 */
const viewport = tv({
  base: [
    "relative box-content overflow-clip rounded-card border-2 border-strong bg-raised text-ink shadow-overlay",
    "presence-overlay origin-top sm:origin-top-left sm:rtl:origin-top-right",
    "[transition-property:opacity,scale,translate,width,height]!",
    "[transition-duration:var(--presence-duration,var(--duration-smooth)),var(--presence-duration,var(--duration-smooth)),var(--presence-duration,var(--duration-smooth)),var(--duration-travel),var(--duration-travel)]!",
    "[transition-timing-function:var(--ease-smooth)]!",
    "[&:is([data-state=closed],:has(>[data-part=content]:is([data-motion],[data-state=closed]:not([hidden]))))]:h-(--viewport-height)",
    "sm:[&:is([data-state=closed],:has(>[data-part=content]:is([data-motion],[data-state=closed]:not([hidden]))))]:w-(--viewport-width)",
    "data-[state=closed]:animate-[bloom-hold_calc(max(var(--duration-exit),calc(var(--duration-travel)+60ms))+20ms)_linear_both]",
    "in-[[data-scope=navigation-menu][data-part=root][data-initial]]:transition-none!",
  ],
})
