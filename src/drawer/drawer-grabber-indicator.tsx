import { Drawer as Seed } from "@foliag/seeds/drawer"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type DrawerGrabberIndicatorProps = Omit<Seed.GrabberIndicatorProps, "class" | "children"> & {
  class?: string | undefined
}

/**
 * The bar in the middle of the grabber that shows the drawer can be pulled, in the color of an edge (3:1). It darkens
 * as soon as a thumb lands on the grabber, so the hold reads as taken.
 */
export function DrawerGrabberIndicator(props: DrawerGrabberIndicatorProps): Element {
  return <Seed.Grabber.Indicator {...omit(props, "class")} class={indicator({ class: props.class })} />
}

// Down at the pace of a press, back on the smooth spring
const indicator = tv({
  base: [
    "h-1.5 w-12 rounded-full bg-strong transition-colors duration-(--duration-smooth) ease-smooth",
    "group-pressing/grabber:bg-ink group-pressing/grabber:duration-(--duration-press) group-pressing/grabber:ease-press",
  ],
})
