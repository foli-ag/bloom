import {
  usePagination as useSeedsPagination,
  type Pagination,
  type UsePaginationProps as SeedsProps,
  type UsePaginationReturn,
} from "@foliag/seeds/pagination"

/** The words a pagination announces that no part of it shows. There are no defaults: zag's are English. */
export interface PaginationTranslations {
  /** The navigation's name, such as "Pages des interventions" */
  rootLabel: string
  /** A page's name, such as ``({ page, totalPages }) => `Page ${page} sur ${totalPages}` `` */
  itemLabel: (details: Pagination.ItemLabelDetails) => string
}

/**
 * The app's words, and zag's English names for the four triggers emptied, so each trigger is named by its own words
 */
export function translationsFrom(own: PaginationTranslations) {
  return {
    rootLabel: own.rootLabel,
    itemLabel: own.itemLabel,
    firstTriggerLabel: "",
    prevTriggerLabel: "",
    nextTriggerLabel: "",
    lastTriggerLabel: "",
  }
}

export type UsePaginationProps = Omit<SeedsProps, "translations"> & {
  translations: PaginationTranslations
}

/** Seeds' `usePagination`, for a `Pagination.RootProvider`, set up as `Pagination.Root` sets it */
export function usePagination(props: UsePaginationProps | (() => UsePaginationProps)): UsePaginationReturn {
  return useSeedsPagination(() => {
    const own = typeof props === "function" ? props() : props
    return { ...own, translations: translationsFrom(own.translations) }
  })
}
