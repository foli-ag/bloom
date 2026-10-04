import { Splitter as Seed } from "@foliag/seeds/splitter"
import { SplitterResizeTrigger } from "./splitter-resize-trigger.jsx"
import { SplitterResizeTriggerIndicator } from "./splitter-resize-trigger-indicator.jsx"

export { SplitterPanel as Panel, type SplitterPanelProps as PanelProps } from "./splitter-panel.jsx"
export type { SplitterResizeTriggerProps as ResizeTriggerProps } from "./splitter-resize-trigger.jsx"
export type { SplitterResizeTriggerIndicatorProps as ResizeTriggerIndicatorProps } from "./splitter-resize-trigger-indicator.jsx"
export { SplitterRoot as Root, type SplitterRootProps as RootProps } from "./splitter-root.jsx"
export {
  SplitterRootProvider as RootProvider,
  type SplitterRootProviderProps as RootProviderProps,
} from "./splitter-root-provider.jsx"
export type ContextProps = Seed.ContextProps
export type ExpandCollapseDetails = Seed.ExpandCollapseDetails
export type PanelData = Seed.PanelData
export type PanelSize = Seed.PanelSize
export type ResizeDetails = Seed.ResizeDetails
export type ResizeEndDetails = Seed.ResizeEndDetails
export type ResizeTriggerId = Seed.ResizeTriggerId

export const ResizeTrigger = /* @__PURE__ */ Object.assign(SplitterResizeTrigger, {
  Indicator: SplitterResizeTriggerIndicator,
})

// Seeds' own, with no look
export const Context: typeof Seed.Context = Seed.Context
