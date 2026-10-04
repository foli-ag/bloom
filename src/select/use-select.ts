import {
  useSelect as useSeedsSelect,
  type CollectionItem,
  type UseSelectProps,
  type UseSelectReturn,
} from "@foliag/seeds/select"
import { keepOpenForSheetClose } from "../internal/sheet.jsx"

/** Zag names the clear trigger "Clear value" in English. Empty, its name comes from the button's own words. */
export const translations = { clearTriggerLabel: "" }

/**
 * Seeds' `useSelect`, for a `Select.RootProvider`, set up as `Select.Root` sets it: no English label, and a tap on
 * the sheet's close button lets the button close the sheet
 */
export function useSelect<T extends CollectionItem = any>(
  props: UseSelectProps<T> | (() => UseSelectProps<T>),
): UseSelectReturn<T> {
  return useSeedsSelect<T>(() => {
    const own = typeof props === "function" ? props() : props
    return { ...own, translations, onInteractOutside: keepOpenForSheetClose(own.onInteractOutside) }
  })
}
