import { Drawer as Seed } from "@foliag/seeds/drawer"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type DrawerContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The drawer itself. It slides in from its edge, moves with the thumb while swiped, and eases back to its place when
 * let go short of closing. Its parts stack with even gaps, a long one scrolls inside, and at the bottom its foot clears
 * the home indicator. Under reduced motion it only fades.
 */
export function DrawerContent(props: DrawerContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={content({ class: props.class })} />
}

// Zag moves the panel with an inline `transform` while it is swiped and removes its transition until it is let go. The
// opening and closing slide on `translate`, which adds to it, so a drawer swiped away keeps going from where it is.
const content = tv({
  base: [
    "relative flex flex-col gap-4 overflow-y-auto overscroll-contain bg-raised p-5 text-ink shadow-overlay outline-none",
    "transition-transform duration-(--duration-sheet) ease-smooth",
    "data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out",
    "data-[swipe-direction=down]:max-h-[90dvh] data-[swipe-direction=down]:w-full data-[swipe-direction=down]:sm:max-w-lg",
    "data-[swipe-direction=down]:rounded-t-card data-[swipe-direction=down]:border-2 data-[swipe-direction=down]:border-b-0",
    "data-[swipe-direction=down]:border-strong data-[swipe-direction=down]:pt-0",
    "data-[swipe-direction=down]:pb-[max(1.25rem,env(safe-area-inset-bottom))]",
    "data-[swipe-direction=up]:max-h-[90dvh] data-[swipe-direction=up]:w-full data-[swipe-direction=up]:sm:max-w-lg",
    "data-[swipe-direction=up]:rounded-b-card data-[swipe-direction=up]:border-2 data-[swipe-direction=up]:border-t-0",
    "data-[swipe-direction=up]:border-strong data-[swipe-direction=up]:[--sheet-from:0_calc(var(--sheet-distance)*-1)]",
    "data-[swipe-direction=right]:h-full data-[swipe-direction=right]:w-[min(24rem,90vw)]",
    "data-[swipe-direction=right]:rounded-s-card data-[swipe-direction=right]:border-s-2 data-[swipe-direction=right]:border-strong",
    "data-[swipe-direction=right]:[--sheet-from:var(--sheet-distance)_0]",
    "data-[swipe-direction=left]:h-full data-[swipe-direction=left]:w-[min(24rem,90vw)]",
    "data-[swipe-direction=left]:rounded-e-card data-[swipe-direction=left]:border-e-2 data-[swipe-direction=left]:border-strong",
    "data-[swipe-direction=left]:[--sheet-from:calc(var(--sheet-distance)*-1)_0]",
  ],
})
