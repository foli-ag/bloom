import { Swap as Seed } from "@foliag/seeds/swap"

export { SwapIndicator as Indicator, type SwapIndicatorProps as IndicatorProps } from "./swap-indicator.jsx"
export { SwapRoot as Root, type SwapRootProps as RootProps } from "./swap-root.jsx"
export {
  SwapRootProvider as RootProvider,
  type SwapRootProviderProps as RootProviderProps,
} from "./swap-root-provider.jsx"
export type ContextProps = Seed.ContextProps

// Seeds' own, with no look
export const Context: typeof Seed.Context = Seed.Context
