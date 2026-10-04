import { AngleSlider as Seed } from "@foliag/seeds/angle-slider"

export { AngleSliderControl as Control, type AngleSliderControlProps as ControlProps } from "./angle-slider-control.jsx"
export { AngleSliderLabel as Label, type AngleSliderLabelProps as LabelProps } from "./angle-slider-label.jsx"
export { AngleSliderMarker as Marker, type AngleSliderMarkerProps as MarkerProps } from "./angle-slider-marker.jsx"
export {
  AngleSliderMarkerGroup as MarkerGroup,
  type AngleSliderMarkerGroupProps as MarkerGroupProps,
} from "./angle-slider-marker-group.jsx"
export { AngleSliderRoot as Root, type AngleSliderRootProps as RootProps } from "./angle-slider-root.jsx"
export {
  AngleSliderRootProvider as RootProvider,
  type AngleSliderRootProviderProps as RootProviderProps,
} from "./angle-slider-root-provider.jsx"
export { AngleSliderThumb as Thumb, type AngleSliderThumbProps as ThumbProps } from "./angle-slider-thumb.jsx"
export {
  AngleSliderValueText as ValueText,
  type AngleSliderValueTextProps as ValueTextProps,
} from "./angle-slider-value-text.jsx"
export type ContextProps = Seed.ContextProps
export type HiddenInputProps = Seed.HiddenInputProps
export type ValueChangeDetails = Seed.ValueChangeDetails

// Seeds' own, with no look
export const Context: typeof Seed.Context = Seed.Context
export const HiddenInput: typeof Seed.HiddenInput = Seed.HiddenInput
