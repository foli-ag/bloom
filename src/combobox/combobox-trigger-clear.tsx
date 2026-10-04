import { Combobox as Seed } from "@foliag/seeds/combobox"
import type { ValidComponent } from "@foliag/seeds/polymorphic"
import type { Element } from "solid-js"

export type ComboboxTriggerClearProps<As extends ValidComponent = "button"> = Seed.TriggerClearProps<As>

/**
 * Empties the choice and the field, and is hidden while nothing is chosen. Seeds' own, with no look: render it as a
 * quiet `Button` with its words.
 */
export function ComboboxTriggerClear<As extends ValidComponent = "button">(
  props: ComboboxTriggerClearProps<As>,
): Element {
  return <Seed.Trigger.Clear {...(props as Seed.TriggerClearProps)} />
}
