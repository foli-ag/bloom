import {
  type RatingGroup,
  useRatingGroup as useSeedsRatingGroup,
  type UseRatingGroupProps as SeedsProps,
  type UseRatingGroupReturn,
} from "@foliag/seeds/rating-group"

export interface RatingGroupTranslations {
  /**
   * What a screen reader calls each item, ``(index) => `${index} sur 5` ``. A star has no words, so this is its name.
   * There is no default: zag's says "3 stars" in English.
   */
  ratingValueText: (index: number) => string
}

export type UseRatingGroupProps = Omit<SeedsProps, "translations"> & { translations: RatingGroupTranslations }

/** Seeds' `useRatingGroup`, for a `RatingGroup.RootProvider`, with the names of the items required */
export function useRatingGroup(props: UseRatingGroupProps | (() => UseRatingGroupProps)): UseRatingGroupReturn {
  return useSeedsRatingGroup(props)
}

export type { RatingGroup }
