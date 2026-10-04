import { Dialog as Seed } from "@foliag/seeds/dialog"
import { Portal } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { useDialogLook } from "./dialog-look.js"

export type DialogPositionerProps = Omit<Seed.PositionerProps, "class"> & {
  class?: string | undefined
}

/**
 * Holds the dialog over the whole screen, at the bottom on a phone and in the middle from 640px. It is drawn at the
 * end of `<body>`, so nothing the dialog sits in can clip it.
 */
export function DialogPositioner(props: DialogPositionerProps): Element {
  const look = useDialogLook()
  return (
    <Portal>
      <Seed.Positioner {...omit(props, "class")} class={positioner({ phone: look.phone(), class: props.class })} />
    </Portal>
  )
}

// It carries the dialog's swell when a press on the dim leaves it open (`data-swell`, set by the content), from the
// bottom edge for a sheet
const positioner = tv({
  base: [
    "fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6",
    "max-sm:origin-bottom data-swell:animate-dialog-swell",
  ],
  variants: {
    // A dialog that takes the whole screen of a phone is stretched to it
    phone: { sheet: "", "full-screen": "max-sm:items-stretch" },
  },
})
