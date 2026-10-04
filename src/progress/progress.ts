import { Progress as Seed } from "@foliag/seeds/progress"
import { ProgressCircle } from "./progress-circle.jsx"
import { ProgressCircleRange } from "./progress-circle-range.jsx"
import { ProgressCircleTrack } from "./progress-circle-track.jsx"

export type { ProgressCircleProps as CircleProps } from "./progress-circle.jsx"
export type { ProgressCircleRangeProps as CircleRangeProps } from "./progress-circle-range.jsx"
export type { ProgressCircleTrackProps as CircleTrackProps } from "./progress-circle-track.jsx"
export { ProgressLabel as Label, type ProgressLabelProps as LabelProps } from "./progress-label.jsx"
export { ProgressRange as Range, type ProgressRangeProps as RangeProps } from "./progress-range.jsx"
export { ProgressRoot as Root, type ProgressRootProps as RootProps } from "./progress-root.jsx"
export { ProgressTrack as Track, type ProgressTrackProps as TrackProps } from "./progress-track.jsx"
export {
  ProgressValueText as ValueText,
  type ProgressValueTextProps as ValueTextProps,
  type ProgressValueDetails as ValueDetails,
} from "./progress-value-text.jsx"
export type ContextProps = Seed.ContextProps
export type ViewProps = Seed.ViewProps
export type ProgressState = Seed.ProgressState
export type ValueChangeDetails = Seed.ValueChangeDetails
export type ValueTranslationDetails = Seed.ValueTranslationDetails

export const Circle = /* @__PURE__ */ Object.assign(ProgressCircle, {
  Track: ProgressCircleTrack,
  Range: ProgressCircleRange,
})

export {
  ProgressRootProvider as RootProvider,
  type ProgressRootProviderProps as RootProviderProps,
} from "./progress-root-provider.jsx"

// Seeds' own, with no look. `View` shows its words only in one state, such as "Envoyé" once complete.
export const View: typeof Seed.View = Seed.View
export const Context: typeof Seed.Context = Seed.Context
