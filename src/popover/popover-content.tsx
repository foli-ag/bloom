import { Popover as Seed } from "@foliag/seeds/popover"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { sheetPanel } from "../internal/overlay.js"

export type PopoverContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/** The panel, at most 24rem wide from 640px and a sheet on a phone. Its parts stack with even gaps, and a long one scrolls. */
export function PopoverContent(props: PopoverContentProps): Element {
  return (
    <Seed.Content {...omit(props, "class")} class={sheetPanel({ scroll: "panel", class: [content(), props.class] })} />
  )
}

// On a phone the bottom padding also clears the home indicator. Beside its trigger it narrows to the room there is.
const content = tv({
  base: [
    "gap-3 p-5 max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]",
    "sm:w-max sm:max-w-[min(24rem,var(--available-width,24rem))]",
  ],
})
