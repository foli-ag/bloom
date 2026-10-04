import { Dialog as Seed } from "@foliag/seeds/dialog"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type DialogContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The dialog itself. On a phone it is a sheet that rises from the bottom edge, from 640px a card that grows into place.
 * Its parts stack with even gaps, a long one scrolls inside, and on a phone its foot clears the home indicator.
 */
export function DialogContent(props: DialogContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={content({ class: props.class })} />
}

const content = tv({
  base: [
    "relative flex max-h-[90dvh] w-full flex-col gap-4 overflow-y-auto overscroll-contain bg-raised p-5 text-ink",
    "shadow-overlay outline-none",
    "max-sm:rounded-t-card max-sm:border-t-2 max-sm:border-strong max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]",
    "max-sm:data-[state=open]:animate-sheet-in max-sm:data-[state=closed]:animate-sheet-out",
    "sm:max-w-lg sm:rounded-card sm:border-2 sm:border-strong sm:p-6",
    "sm:data-[state=open]:animate-overlay-in sm:data-[state=closed]:animate-overlay-out",
  ],
})
