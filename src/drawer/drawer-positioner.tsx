import { Drawer as Seed } from "@foliag/seeds/drawer"
import { Portal } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type DrawerPositionerProps = Omit<Seed.PositionerProps, "class"> & {
  class?: string | undefined
}

/**
 * Holds the drawer against its edge, the bottom one unless `swipeDirection` says otherwise. It is drawn at the end of
 * `<body>`, so nothing the drawer sits in can clip it.
 */
export function DrawerPositioner(props: DrawerPositionerProps): Element {
  return (
    <Portal>
      <Seed.Positioner {...omit(props, "class")} class={positioner({ class: props.class })} />
    </Portal>
  )
}

// A drawer on the left or the right edge places itself with an auto margin, as `justify-start` would follow the
// writing direction and `data-swipe-direction` is physical
const positioner = tv({
  base: [
    "fixed inset-0 z-50 flex",
    "data-[swipe-direction=down]:items-end data-[swipe-direction=down]:justify-center",
    "data-[swipe-direction=up]:items-start data-[swipe-direction=up]:justify-center",
  ],
})
