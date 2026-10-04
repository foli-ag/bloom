import { Tabs as Seed } from "@foliag/seeds/tabs"

export { TabsContent as Content, type TabsContentProps as ContentProps } from "./tabs-content.jsx"
export { TabsIndicator as Indicator, type TabsIndicatorProps as IndicatorProps } from "./tabs-indicator.jsx"
export { TabsList as List, type TabsListProps as ListProps } from "./tabs-list.jsx"
export { TabsRoot as Root, type TabsRootProps as RootProps } from "./tabs-root.jsx"
export {
  TabsRootProvider as RootProvider,
  type TabsRootProviderProps as RootProviderProps,
} from "./tabs-root-provider.jsx"
export { TabsTrigger as Trigger, type TabsTriggerProps as TriggerProps } from "./tabs-trigger.jsx"
export type ContextProps = Seed.ContextProps
export type FocusChangeDetails = Seed.FocusChangeDetails
export type NavigateDetails = Seed.NavigateDetails
export type TriggerState = Seed.TriggerState
export type ValueChangeDetails = Seed.ValueChangeDetails

// Seeds' own, with no look
export const Context: typeof Seed.Context = Seed.Context
