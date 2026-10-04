import { Tabs as Seed } from "@foliag/seeds/tabs"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { segmentedTrack } from "../internal/choice.js"
import { useTabsVariant } from "./tabs-variant.js"

export type TabsListProps = Omit<Seed.ListProps, "class"> & {
  class?: string | undefined
}

/**
 * The row of tabs over a thin line, or in a track as `segmented`, which scrolls sideways when it is wider than the
 * screen. It has no visible name of its own: give it `aria-label`, such as the name of what its pages are about.
 */
export function TabsList(props: TabsListProps): Element {
  const variant = useTabsVariant()
  return <Seed.List {...omit(props, "class")} class={list({ variant: variant(), class: props.class })} />
}

// The line is an inset shadow and not a border, so it stays put as the row scrolls and the indicator can sit on it
// without being clipped. A segmented track is as wide as its tabs, and no wider than the page.
const list = tv({
  base: "relative flex shrink-0 [scrollbar-width:thin] data-[orientation=vertical]:flex-col",
  variants: {
    variant: {
      line: [
        "data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:shadow-[inset_0_-2px_0_var(--color-border)]",
        "data-[orientation=vertical]:shadow-[inset_-2px_0_0_var(--color-border)]",
        "rtl:data-[orientation=vertical]:shadow-[inset_2px_0_0_var(--color-border)]",
      ],
      segmented: [segmentedTrack(), "max-w-full self-start data-[orientation=horizontal]:overflow-x-auto"],
    },
  },
})
