import { Dialog as Seed } from "@foliag/seeds/dialog"
import { Portal } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type DialogBackdropProps = Omit<Seed.BackdropProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/** The dim over the page. It is drawn at the end of `<body>`, so nothing the dialog sits in can clip it. */
export function DialogBackdrop(props: DialogBackdropProps): Element {
  return (
    <Portal>
      <Seed.Backdrop {...omit(props, "class")} class={backdrop({ class: props.class })} />
    </Portal>
  )
}

// On a phone it dims on the clock of the sheet, so the two arrive together
const backdrop = tv({
  base: "fixed inset-0 z-50 bg-scrim presence-fade max-sm:[--presence-duration:var(--duration-sheet)]",
})
