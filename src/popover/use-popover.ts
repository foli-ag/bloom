import { usePopover as useSeedsPopover, type UsePopoverProps, type UsePopoverReturn } from "@foliag/seeds/popover"

/** Zag names the close trigger "close" in English. Empty, its name comes from the button's own words. */
export const translations = { closeTriggerLabel: "" }

/** Seeds' `usePopover`, for a `Popover.RootProvider`, with zag's English label emptied as `Popover.Root` does */
export function usePopover(props: UsePopoverProps | (() => UsePopoverProps) = {}): UsePopoverReturn {
  return useSeedsPopover(() => ({ ...(typeof props === "function" ? props() : props), translations }))
}
