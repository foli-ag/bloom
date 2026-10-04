import { Toggle as Seed } from "@foliag/seeds/toggle"

export { ToggleIndicator as Indicator, type ToggleIndicatorProps as IndicatorProps } from "./toggle-indicator.jsx"
export { ToggleRoot as Root, type ToggleRootProps as RootProps } from "./toggle-root.jsx"
export {
  ToggleRootProvider as RootProvider,
  type ToggleRootProviderProps as RootProviderProps,
} from "./toggle-root-provider.jsx"
export type ContextProps = Seed.ContextProps

// Seeds' own, with no look
export const Context: typeof Seed.Context = Seed.Context
