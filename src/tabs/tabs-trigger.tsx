import { Tabs as Seed } from "@foliag/seeds/tabs"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type TabsTriggerProps = Omit<Seed.TriggerProps, "class" | "children"> & {
  /** The page's name. It is the tab's name and its page's, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A tab, 48px tall. The chosen one turns to full ink and the `Indicator` slides under it, so the choice is not shown
 * by a color alone.
 */
export function TabsTrigger(props: TabsTriggerProps): Element {
  return <Seed.Trigger {...omit(props, "class")} class={trigger({ class: props.class })} />
}

// The ring is drawn inside, as the row scrolls and would clip one drawn outside
const trigger = tv({
  base: [
    "inline-flex min-h-12 shrink-0 pressable items-center justify-center gap-2 rounded-control px-4 py-2",
    "text-base font-semibold whitespace-nowrap tracking-body text-muted",
    "transition-colors duration-(--duration-smooth) ease-smooth hover:text-ink aria-selected:text-ink",
    "outline-none focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-focus",
    "data-[orientation=vertical]:justify-start",
    "data-disabled:cursor-not-allowed data-disabled:text-disabled-ink",
  ],
})
