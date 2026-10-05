import {
  usePinInput as useSeedsPinInput,
  type UsePinInputProps as SeedsProps,
  type UsePinInputReturn,
} from "@foliag/seeds/pin-input"

export interface PinInputTranslations {
  /**
   * The name of each box, such as ``(index, length) => `Chiffre ${index + 1} sur ${length}` ``. It is required, because
   * zag's is "pin code 1 of 6" in English, and a box has no words of its own.
   */
  inputLabel: (index: number, length: number) => string
}

export type UsePinInputProps = Omit<SeedsProps, "translations"> & { translations: PinInputTranslations }

/**
 * Seeds' `usePinInput`, for a `PinInput.RootProvider`, with the names of the boxes required and empty boxes left blank
 * as `PinInput.Root` does
 */
export function usePinInput(props: UsePinInputProps | (() => UsePinInputProps)): UsePinInputReturn {
  return useSeedsPinInput(() => ({ placeholder: "", ...(typeof props === "function" ? props() : props) }))
}
