import { HoverCard as Seed } from "@foliag/seeds/hover-card"
import type { Element } from "solid-js"

export type HoverCardRootProviderProps = Omit<Seed.RootProviderProps, "lazyMount" | "unmountOnExit">

/** A root for a hover card made with `useHoverCard`, whose state the app then reads and sets from outside it */
export function HoverCardRootProvider(props: HoverCardRootProviderProps): Element {
  return <Seed.RootProvider {...props} lazyMount unmountOnExit />
}
