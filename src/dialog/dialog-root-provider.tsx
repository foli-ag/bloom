import { Dialog as Seed } from "@foliag/seeds/dialog"
import type { Element } from "solid-js"

export type DialogRootProviderProps = Omit<Seed.RootProviderProps, "lazyMount" | "unmountOnExit">

/** A root for a dialog made with `useDialog`, whose state the app then reads and sets from outside it */
export function DialogRootProvider(props: DialogRootProviderProps): Element {
  return <Seed.RootProvider {...props} lazyMount unmountOnExit />
}
