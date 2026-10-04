import { Drawer as Seed } from "@foliag/seeds/drawer"
import type { Element } from "solid-js"

export type DrawerRootProviderProps = Omit<Seed.RootProviderProps, "lazyMount" | "unmountOnExit">

/** A root for a drawer made with `useDrawer`, whose state the app then reads and sets from outside it */
export function DrawerRootProvider(props: DrawerRootProviderProps): Element {
  return <Seed.RootProvider {...props} lazyMount unmountOnExit />
}
