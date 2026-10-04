import { Dialog as Seed } from "@foliag/seeds/dialog"
import { omit, type Element } from "solid-js"
import { DialogLookContext, lookOf, type DialogPhone, type DialogSize } from "./dialog-look.js"

export type DialogRootProviderProps = Omit<Seed.RootProviderProps, "lazyMount" | "unmountOnExit"> & {
  /** As on `Root`: how wide the card is from 640px */
  size?: DialogSize | undefined
  /** As on `Root`: a sheet or the whole screen on a phone */
  phone?: DialogPhone | undefined
}

/** A root for a dialog made with `useDialog`, whose state the app then reads and sets from outside it */
export function DialogRootProvider(props: DialogRootProviderProps): Element {
  return (
    <DialogLookContext value={lookOf(props)}>
      <Seed.RootProvider {...omit(props, "size", "phone")} lazyMount unmountOnExit />
    </DialogLookContext>
  )
}
