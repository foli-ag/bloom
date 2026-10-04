import {
  useEditable as useSeedsEditable,
  type UseEditableProps as SeedsProps,
  type UseEditableReturn,
} from "@foliag/seeds/editable"

/**
 * Zag names the preview and the triggers "edit", "submit" and "cancel", and the field "editable input", in English.
 * Empty, the triggers take their names from their words and the field and the preview from the `Label`.
 */
export const translations = { edit: "", submit: "", cancel: "", input: "" }

export type UseEditableProps = Omit<SeedsProps, "translations">

/** Seeds' `useEditable`, for an `Editable.RootProvider`, with zag's English labels emptied as `Editable.Root` does */
export function useEditable(props: UseEditableProps | (() => UseEditableProps) = {}): UseEditableReturn {
  return useSeedsEditable(() => ({ ...(typeof props === "function" ? props() : props), translations }))
}
