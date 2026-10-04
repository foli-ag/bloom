import { Combobox as Seed } from "@foliag/seeds/combobox"
import type { ValidComponent } from "@foliag/seeds/polymorphic"
import type { Element } from "solid-js"

export type ComboboxTriggerProps<As extends ValidComponent = "button"> = Seed.TriggerProps<As>

/**
 * Opens and closes the list. Seeds' own, with no look; the field opens it on a tap already, so most fields leave it
 * out and show an `Indicator`.
 */
export function ComboboxTrigger<As extends ValidComponent = "button">(props: ComboboxTriggerProps<As>): Element {
  return <Seed.Trigger {...(props as Seed.TriggerProps)} />
}
