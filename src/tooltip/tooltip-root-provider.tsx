import { Tooltip as Seed } from "@foliag/seeds/tooltip"
import type { Element } from "solid-js"

export type TooltipRootProviderProps = Omit<Seed.RootProviderProps, "lazyMount" | "unmountOnExit">

/** A root for a tooltip made with `useTooltip`, whose state the app then reads and sets from outside it */
export function TooltipRootProvider(props: TooltipRootProviderProps): Element {
  return <Seed.RootProvider {...props} lazyMount unmountOnExit />
}
