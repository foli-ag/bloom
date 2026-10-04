import {
  type Progress,
  useProgress as useSeedsProgress,
  type UseProgressProps as SeedsProps,
  type UseProgressReturn,
} from "@foliag/seeds/progress"

export interface ProgressTranslations {
  /**
   * The value as a screen reader says it, ``({ percent }) => `${percent} %` ``, and what it says while `value` is null,
   * such as "Chargement". There is no default: zag's says "loading..." in English and writes the percent the American
   * way. A bar with no `Label` takes it as its name.
   */
  value: (details: Progress.ValueTranslationDetails) => string
}

export type UseProgressProps = Omit<SeedsProps, "translations"> & { translations: ProgressTranslations }

/** Seeds' `useProgress`, for a `Progress.RootProvider`, with the words a screen reader says required */
export function useProgress(props: UseProgressProps | (() => UseProgressProps)): UseProgressReturn {
  return useSeedsProgress(props)
}
