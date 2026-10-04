import {
  useNumberInput as useSeedsNumberInput,
  type UseNumberInputProps as SeedsProps,
  type UseNumberInputReturn,
} from "@foliag/seeds/number-input"

/** Zag names the two buttons "increment value" and "decrease value" in English. Empty, their names come from their words. */
export const translations = { incrementLabel: "", decrementLabel: "" }

/**
 * Zag reads and writes the number with `locale` only when `formatOptions` is set, and otherwise with `parseFloat`,
 * which stops at the French comma: "2,5" becomes 2. These options set it while changing nothing else: every decimal
 * kept and no thousands separator, which would jump into the field while the farmer types.
 */
export const numberFormat: Intl.NumberFormatOptions = { maximumFractionDigits: 20, useGrouping: false }

export type UseNumberInputProps = Omit<SeedsProps, "translations" | "locale"> & {
  /**
   * How numbers are written and read, such as "fr-FR". There is no default: zag's is "en-US", which reads "2,5" typed
   * by a French farmer as 2.
   */
  locale: string
}

/** Seeds' `useNumberInput`, for a `NumberInput.RootProvider`, set up as `NumberInput.Root` sets it */
export function useNumberInput(props: UseNumberInputProps | (() => UseNumberInputProps)): UseNumberInputReturn {
  return useSeedsNumberInput(() => {
    const own = typeof props === "function" ? props() : props
    return { ...own, formatOptions: own.formatOptions ?? numberFormat, translations }
  })
}
