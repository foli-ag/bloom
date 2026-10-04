import { Drawer as Seed } from "@foliag/seeds/drawer"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type DrawerGrabberIndicatorProps = Omit<Seed.GrabberIndicatorProps, "class" | "children"> & {
  class?: string | undefined
}

/** The bar in the middle of the grabber that shows the drawer can be pulled, in the color of an edge (3:1) */
export function DrawerGrabberIndicator(props: DrawerGrabberIndicatorProps): Element {
  return <Seed.Grabber.Indicator {...omit(props, "class")} class={indicator({ class: props.class })} />
}

const indicator = tv({ base: "h-1.5 w-12 rounded-full bg-strong" })
