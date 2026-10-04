import { Dialog as Seed } from "@foliag/seeds/dialog"
import { Portal } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type DialogPositionerProps = Omit<Seed.PositionerProps, "class"> & {
  class?: string | undefined
}

/**
 * Holds the dialog over the whole screen, at the bottom on a phone and in the middle from 640px. It is drawn at the
 * end of `<body>`, so nothing the dialog sits in can clip it.
 */
export function DialogPositioner(props: DialogPositionerProps): Element {
  return (
    <Portal>
      <Seed.Positioner {...omit(props, "class")} class={positioner({ class: props.class })} />
    </Portal>
  )
}

const positioner = tv({ base: "fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" })
