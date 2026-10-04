import {
  usePasswordInput as useSeedsPasswordInput,
  type UsePasswordInputProps,
  type UsePasswordInputReturn,
} from "@foliag/seeds/password-input"

/**
 * Zag names the button "Show password" and "Hide password" in English. Empty, its name comes from the `Indicator`'s
 * words.
 */
export const translations = { visibilityTrigger: () => "" }

/** Seeds' `usePasswordInput`, for a `PasswordInput.RootProvider`, with zag's English label emptied as `Root` does */
export function usePasswordInput(
  props: UsePasswordInputProps | (() => UsePasswordInputProps) = {},
): UsePasswordInputReturn {
  return useSeedsPasswordInput(() => ({ ...(typeof props === "function" ? props() : props), translations }))
}
