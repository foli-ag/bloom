import {
  useClipboard as useSeedsClipboard,
  type UseClipboardProps as SeedsProps,
  type UseClipboardReturn,
} from "@foliag/seeds/clipboard"

/**
 * Zag names the trigger "Copy to clipboard", then "Copied to clipboard", in English. Empty, its name comes from its
 * words, which the `Indicator` inside it swaps.
 */
export const translations = { triggerLabel: () => "" }

export type UseClipboardProps = Omit<SeedsProps, "translations">

/** Seeds' `useClipboard`, for a `Clipboard.RootProvider`, with zag's English label emptied as `Clipboard.Root` does */
export function useClipboard(props: UseClipboardProps | (() => UseClipboardProps) = {}): UseClipboardReturn {
  return useSeedsClipboard(() => ({ ...(typeof props === "function" ? props() : props), translations }))
}
