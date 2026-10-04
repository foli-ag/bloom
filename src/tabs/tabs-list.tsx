import { Tabs as Seed } from "@foliag/seeds/tabs"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type TabsListProps = Omit<Seed.ListProps, "class"> & {
  class?: string | undefined
}

/**
 * The row of tabs over a thin line, which scrolls sideways when it is wider than the screen. It has no visible name of
 * its own: give it `aria-label`, such as the name of what its pages are about.
 */
export function TabsList(props: TabsListProps): Element {
  return <Seed.List {...omit(props, "class")} class={list({ class: props.class })} />
}

// The line is an inset shadow and not a border, so it stays put as the row scrolls and the indicator can sit on it
// without being clipped
const list = tv({
  base: [
    "relative flex shrink-0 [scrollbar-width:thin]",
    "data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:shadow-[inset_0_-2px_0_var(--color-border)]",
    "data-[orientation=vertical]:flex-col data-[orientation=vertical]:shadow-[inset_-2px_0_0_var(--color-border)]",
    "rtl:data-[orientation=vertical]:shadow-[inset_2px_0_0_var(--color-border)]",
  ],
})
