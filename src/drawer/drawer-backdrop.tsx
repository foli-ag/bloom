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
      <Seed.Backdrop {...omit(props, "class")} class={backdrop({ class: props.class })}>
        <div class={dim()} />
      </Seed.Backdrop>
    </Portal>
  )
}

// Two layers, so their two jobs never fight. The backdrop comes and goes as `presence-fade` does, on the drawer's
// clock, so the dim and the drawer arrive together, and a swipe's exit is as quick as the drawer's. The dim inside it
// follows the thumb with no transition (`--drawer-swipe-progress`), and eases back with the drawer when let go short.
// Zag keeps its swipe flag a frame past the thumb, into a drawer opened again during its exit: that frame only holds
// the dim, which has not changed, while the backdrop turns round from where it is.
const backdrop = tv({
  base: [
    "fixed inset-0 z-50 starting:opacity-0 transition-opacity duration-(--duration-sheet) ease-smooth",
    "data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=closed]:animate-hold",
    "data-[state=closed]:duration-(--duration-exit)",
    "data-[state=closed]:data-swiping:duration-[calc(var(--duration-exit)*var(--drawer-swipe-strength,1))]",
  ],
})

const dim = tv({
  base: [
    "size-full bg-scrim opacity-[calc(1-var(--drawer-swipe-progress,0))]",
    "transition-opacity duration-(--duration-sheet) ease-smooth in-data-swiping:duration-0",
  ],
})
