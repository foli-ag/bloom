import { Drawer as Seed } from "@foliag/seeds/drawer"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type DrawerContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The drawer itself. It slides in from its edge, moves with the thumb while swiped, and eases back to its place when
 * let go short of closing. Its parts stack with even gaps, a long one scrolls inside, and its outer edges clear the
 * notch and the home indicator. Under reduced motion it only fades.
 */
export function DrawerContent(props: DrawerContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={content({ class: props.class })} />
}

// It moves as `presence-sheet` does, which follows the thumb. A drawer on the bottom edge comes from there, as a sheet
// does, and one on another edge names it with `--sheet-from`, which takes off the distance already swiped. Its edges are
// physical, as `data-swipe-direction` is. While its grabber is held it does not scroll (`data-grabbed`).
const content = tv({
  base: [
    "relative flex flex-col gap-4 overflow-y-auto overscroll-contain bg-raised p-5 text-ink shadow-overlay outline-none",
    "presence-sheet data-grabbed:overflow-hidden",

    "data-[swipe-direction=down]:max-h-[90dvh] data-[swipe-direction=down]:w-full data-[swipe-direction=down]:sm:max-w-lg",
    "data-[swipe-direction=down]:rounded-t-card data-[swipe-direction=down]:border-2 data-[swipe-direction=down]:border-b-0",
    "data-[swipe-direction=down]:border-strong data-[swipe-direction=down]:max-sm:border-x-0",
    "data-[swipe-direction=down]:pb-[max(1.25rem,env(safe-area-inset-bottom))]",

    "data-[swipe-direction=up]:max-h-[90dvh] data-[swipe-direction=up]:w-full data-[swipe-direction=up]:sm:max-w-lg",
    "data-[swipe-direction=up]:rounded-b-card data-[swipe-direction=up]:border-2 data-[swipe-direction=up]:border-t-0",
    "data-[swipe-direction=up]:border-strong data-[swipe-direction=up]:max-sm:border-x-0",
    "data-[swipe-direction=up]:pt-[max(1.25rem,env(safe-area-inset-top))]",
    "data-[swipe-direction=up]:[--sheet-from:0_calc(min(var(--drawer-translate-y)*-1,var(--sheet-distance))-var(--sheet-distance))]",

    "data-[swipe-direction=right]:ml-auto data-[swipe-direction=right]:h-full data-[swipe-direction=right]:w-[min(24rem,90vw)]",
    "data-[swipe-direction=right]:rounded-l-card data-[swipe-direction=right]:border-l-2 data-[swipe-direction=right]:border-strong",
    "data-[swipe-direction=right]:pt-[max(1.25rem,env(safe-area-inset-top))]",
    "data-[swipe-direction=right]:pr-[max(1.25rem,env(safe-area-inset-right))]",
    "data-[swipe-direction=right]:pb-[max(1.25rem,env(safe-area-inset-bottom))]",
    "data-[swipe-direction=right]:[--sheet-from:calc(var(--sheet-distance)-min(var(--drawer-translate-x),var(--sheet-distance)))_0]",

    "data-[swipe-direction=left]:mr-auto data-[swipe-direction=left]:h-full data-[swipe-direction=left]:w-[min(24rem,90vw)]",
    "data-[swipe-direction=left]:rounded-r-card data-[swipe-direction=left]:border-r-2 data-[swipe-direction=left]:border-strong",
    "data-[swipe-direction=left]:pt-[max(1.25rem,env(safe-area-inset-top))]",
    "data-[swipe-direction=left]:pl-[max(1.25rem,env(safe-area-inset-left))]",
    "data-[swipe-direction=left]:pb-[max(1.25rem,env(safe-area-inset-bottom))]",
    "data-[swipe-direction=left]:[--sheet-from:calc(min(var(--drawer-translate-x)*-1,var(--sheet-distance))-var(--sheet-distance))_0]",
  ],
})
