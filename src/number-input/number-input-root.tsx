import { NumberInput as Seed } from "@foliag/seeds/number-input"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import { numberFormat, translations } from "./use-number-input.js"

export type NumberInputRootProps = Omit<Seed.RootProps, "class" | "translations" | "locale"> & {
  /**
   * How numbers are written and read, such as "fr-FR". There is no default: zag's is "en-US", which reads "2,5" typed
   * by a French farmer as 2.
   */
  locale: string
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A number typed, or stepped with two buttons on either side of it, such as a dose or a number of rows. The arrow keys
 * step it too. A value past `min` or `max` is put back in range when the field loses focus. The keyboard a phone shows
 * is the one with digits and a decimal separator.
 *
 * Its parts stack with even gaps. The two buttons are seeds' own, with no look: render them as a `Button` with words.
 *
 * @example
 * <NumberInput.Root name="dose" locale="fr-FR" min={0} step={0.5} defaultValue="2,5">
 *   <NumberInput.Label>Dose (L/ha)</NumberInput.Label>
 *   <NumberInput.Control>
 *     <NumberInput.Trigger.Decrement as={Button} tone="neutral" variant="outline" aria-label="Moins 0,5">−</NumberInput.Trigger.Decrement>
 *     <NumberInput.Input />
 *     <NumberInput.Trigger.Increment as={Button} tone="neutral" variant="outline" aria-label="Plus 0,5">+</NumberInput.Trigger.Increment>
 *   </NumberInput.Control>
 * </NumberInput.Root>
 */
export function NumberInputRoot(props: NumberInputRootProps): Element {
  return (
    <Seed.Root
      {...omit(props, "class")}
      formatOptions={props.formatOptions ?? numberFormat}
      translations={translations}
      class={fieldRoot({ class: props.class })}
    />
  )
}
