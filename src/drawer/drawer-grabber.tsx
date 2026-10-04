import { Drawer as Seed } from "@foliag/seeds/drawer"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type DrawerGrabberProps = Omit<Seed.GrabberProps, "class"> & {
  /** A `Grabber.Indicator` */
  children?: Element
  class?: string | undefined
}

/**
 * The strip along the top of a bottom drawer, 40px tall and as wide as the drawer, that drags it even where its
 * content scrolls. It is for the thumb only: the keyboard and a screen reader close the drawer with its
 * `Trigger.Close` or Escape.
 */
export function DrawerGrabber(props: DrawerGrabberProps): Element {
  return <Seed.Grabber {...omit(props, "class")} class={grabber({ class: props.class })} />
}

// It takes the drawer's top padding, so the title sits where it would without one
const grabber = tv({
  base: "-mx-5 -mb-2 flex h-10 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing",
})
