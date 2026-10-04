import {
  useCarousel as useSeedsCarousel,
  type Carousel,
  type UseCarouselProps as SeedsProps,
  type UseCarouselReturn,
} from "@foliag/seeds/carousel"

/** The words a carousel announces that no part of it shows. There are no defaults: zag's are English. */
export interface CarouselTranslations {
  /** An indicator's name, such as ``(index) => `Photo ${index + 1}` `` */
  indicator: (index: number) => string
  /** A slide's name, such as ``(index, count) => `${index + 1} sur ${count}` `` */
  item: (index: number, count: number) => string
  /** What `ProgressText` shows, such as ``({ page, totalPages }) => `${page} sur ${totalPages}` `` */
  progressText: (details: Carousel.ProgressTextDetails) => string
}

/** The app's words, and zag's English names for the triggers emptied, so each trigger is named by its own words */
export function translationsFrom(own: CarouselTranslations) {
  return {
    indicator: own.indicator,
    item: own.item,
    progressText: own.progressText,
    nextTrigger: "",
    prevTrigger: "",
    autoplayStart: "",
    autoplayStop: "",
  }
}

export type UseCarouselProps = Omit<SeedsProps, "translations"> & {
  translations: CarouselTranslations
}

/** Seeds' `useCarousel`, for a `Carousel.RootProvider`, set up as `Carousel.Root` sets it */
export function useCarousel(props: UseCarouselProps | (() => UseCarouselProps)): UseCarouselReturn {
  return useSeedsCarousel(() => {
    const own = typeof props === "function" ? props() : props
    return { ...own, translations: translationsFrom(own.translations) }
  })
}
