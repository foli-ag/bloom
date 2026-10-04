import { NavigationMenu as Seed } from "@foliag/seeds/navigation-menu"
import type { ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { triggerChevron } from "../internal/disclosure.js"
import { Chevron } from "../internal/icons.jsx"

export type RootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** What the menu leads through, such as "Navigation principale", when the page has more than one */
  "aria-label"?: string | undefined
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * The sections of an app, in a bar. A section with pages under it opens a panel of links, on a tap or a click, or on
 * hovering with a mouse. From 640px the panel hangs under its section; on a phone it spans the bar, and the bar wraps
 * onto a second line rather than scroll sideways and hide a section.
 *
 * `orientation="vertical"` stacks the sections, for a side bar or a menu inside a Dialog on a phone. A panel then
 * opens in place, under its section.
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
 * </NavigationMenu.Root>
 */
export function Root(props: RootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={root({ class: props.class })} />
}

export type ListProps = Omit<Seed.ListProps<"ul">, "class" | "as"> & {
  class?: string | undefined
}

/** The sections, as a list a screen reader counts */
export function List(props: ListProps): Element {
  return <Seed.List as="ul" {...omit(props, "class")} class={list({ class: props.class })} />
}

export type ItemProps = Omit<Seed.ItemProps<"li">, "class" | "as"> & {
  class?: string | undefined
}

/** A section: a trigger and its panel of links, or a single link. Each has a `value` of its own. */
function ItemRoot(props: ItemProps): Element {
  return <Seed.Item as="li" {...omit(props, "class")} class={item({ class: props.class })} />
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

/** The panel of links of the section around it. The arrow keys move through its links. */
export function Content(props: ContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={content({ class: props.class })} />
}

export type LinkProps<As extends ValidComponent = "a"> = Seed.LinkProps<As>

/**
 * A page of the app: a section of its own in the bar, or a row in a panel. `current` marks the page being shown, with
 * a bar under its words as well as its color, and tells a screen reader. Render it as the router's link with `as`.
 */
export function Link<As extends ValidComponent = "a">(props: LinkProps<As>): Element {
  return (
    <Seed.Link {...omit(props as LinkProps, "class")} class={entry({ class: props.class as string | undefined })} />
  )
}

const root = tv({ base: "relative" })

const list = tv({
  base: [
    "flex flex-wrap items-center gap-1",
    "data-[orientation=vertical]:flex-col data-[orientation=vertical]:flex-nowrap data-[orientation=vertical]:items-stretch",
  ],
})

// From 640px a panel hangs under its own section. Below, the list holds it, so it spans the bar.
const item = tv({ base: "data-[orientation=horizontal]:sm:relative" })

// A section in the bar and a link in a panel look alike. In a panel a link spans it.
const entry = tv({
  base: [
    "relative inline-flex min-h-12 pressable items-center gap-2 rounded-control px-3 py-2 text-start",
    "text-base font-semibold tracking-body text-ink no-underline",
    "transition-colors duration-(--duration-smooth) ease-smooth hover:bg-neutral-soft focus-ring",
    "data-[state=open]:bg-neutral-soft",
    "aria-[current=page]:text-primary-text",
    "aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:bottom-1",
    "aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-primary-edge",
    "in-data-[orientation=vertical]:flex in-data-[orientation=vertical]:w-full",
    "in-[[data-scope=navigation-menu][data-part=content]]:flex in-[[data-scope=navigation-menu][data-part=content]]:w-full",
    "disabled:cursor-not-allowed disabled:text-disabled-ink disabled:hover:bg-transparent",
  ],
})

const content = tv({
  base: [
    "z-50 grid gap-1 rounded-card border-2 border-strong bg-raised p-2 text-ink shadow-overlay",
    "data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out",
    "data-[orientation=horizontal]:absolute data-[orientation=horizontal]:inset-x-0 data-[orientation=horizontal]:top-full",
    "data-[orientation=horizontal]:mt-2 data-[orientation=horizontal]:origin-top",
    "data-[orientation=horizontal]:sm:end-auto data-[orientation=horizontal]:sm:w-max",
    "data-[orientation=horizontal]:sm:min-w-64 data-[orientation=horizontal]:sm:max-w-[calc(100vw-2rem)]",
    "data-[orientation=vertical]:mt-1 data-[orientation=vertical]:shadow-none",
  ],
})
