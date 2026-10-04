import { Swap as Seed } from "@foliag/seeds/swap"
import { omit, type Element } from "solid-js"
import { swapRoot } from "./swap-root.jsx"

export type SwapRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A swap made with `useSwap`, whose state the app then reads and sets from outside it */
export function SwapRootProvider(props: SwapRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={swapRoot({ class: props.class })} />
}
