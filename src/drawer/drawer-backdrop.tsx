import { Drawer as Seed } from "@foliag/seeds/drawer"
import { Portal } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type DrawerBackdropProps = Omit<Seed.BackdropProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * The dim over the page. It clears as the drawer is swiped away, with the thumb. It is drawn at the end of `<body>`,
 * so nothing the drawer sits in can clip it.
 */
export function DrawerBackdrop(props: DrawerBackdropProps): Element {
  return (
    <Portal>
      <Seed.Backdrop {...omit(props, "class")} class={backdrop({ class: props.class })} />
    </Portal>
  )
}

const backdrop = tv({
  base: [
    "fixed inset-0 z-50 bg-scrim opacity-[calc(1-var(--drawer-swipe-progress,0))]",
    "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
  ],
})
