import { PinInput as Seed } from "@foliag/seeds/pin-input"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import type { PinInputTranslations } from "./use-pin-input.js"

export type PinInputRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** The names of the boxes. Each box is one character and has no words, so they are required. */
  translations: PinInputTranslations
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A short code typed one character to a box, such as the one an SMS sends. Focus moves on as each is typed and back on
 * Backspace, and pasting the whole code fills every box. `otp` lets a phone offer the code from the SMS it just
 * received. Digits only by default, with the phone's number pad.
 *
 * Its parts stack with even gaps. `HiddenInput` carries the code into a form as one string, under `name`.
 *
 * @example
 * <PinInput.Root name="code" otp translations={{ inputLabel: (index, length) => `Chiffre ${index + 1} sur ${length}` }}>
 *   <PinInput.Label>Code reçu par SMS</PinInput.Label>
 *   <PinInput.Control>
 *     <For each={[0, 1, 2, 3, 4, 5]}>{(index) => <PinInput.Input index={index} />}</For>
 *   </PinInput.Control>
 *   <PinInput.HiddenInput />
 * </PinInput.Root>
 */
export function PinInputRoot(props: PinInputRootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={fieldRoot({ class: props.class })} />
}
