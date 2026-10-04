import { Carousel as Seed } from "@foliag/seeds/carousel"

export { CarouselControl as Control, type CarouselControlProps as ControlProps } from "./carousel-control.jsx"
export { CarouselGroup as Group, type CarouselGroupProps as GroupProps } from "./carousel-group.jsx"
export { CarouselIndicator as Indicator, type CarouselIndicatorProps as IndicatorProps } from "./carousel-indicator.jsx"
export {
  CarouselIndicatorGroup as IndicatorGroup,
  type CarouselIndicatorGroupProps as IndicatorGroupProps,
} from "./carousel-indicator-group.jsx"
export { CarouselItem as Item, type CarouselItemProps as ItemProps } from "./carousel-item.jsx"
export {
  CarouselProgressText as ProgressText,
  type CarouselProgressTextProps as ProgressTextProps,
} from "./carousel-progress-text.jsx"
export { CarouselRoot as Root, type CarouselRootProps as RootProps } from "./carousel-root.jsx"
export {
  CarouselRootProvider as RootProvider,
  type CarouselRootProviderProps as RootProviderProps,
} from "./carousel-root-provider.jsx"
export type { CarouselTranslations as Translations } from "./use-carousel.js"
export type AutoplayIndicatorProps = Seed.AutoplayIndicatorProps
export type ContextProps = Seed.ContextProps
export type AutoplayStatusDetails = Seed.AutoplayStatusDetails
export type DragStatusDetails = Seed.DragStatusDetails
export type PageChangeDetails = Seed.PageChangeDetails
export type ProgressTextDetails = Seed.ProgressTextDetails

// Seeds' own, with no look. The triggers render as a `Button` with words, and the autoplay indicator swaps them.
export const Trigger: typeof Seed.Trigger = Seed.Trigger
export const AutoplayIndicator: typeof Seed.AutoplayIndicator = Seed.AutoplayIndicator
export const Context: typeof Seed.Context = Seed.Context
