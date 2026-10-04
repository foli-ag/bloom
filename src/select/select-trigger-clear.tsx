import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { Select as Seed } from "@foliag/seeds/select"
import type { Element } from "solid-js"

export type SelectTriggerClearProps<As extends ValidComponent = "button"> = Seed.TriggerClearProps<As>

/**
 * Empties the choice, and sends focus back to the field. It is hidden while nothing is chosen. Seeds' own, with no
 * look: render it as a quiet `Button` with its words.
 */
export function SelectTriggerClear<As extends ValidComponent = "button">(props: SelectTriggerClearProps<As>): Element {
  return <Seed.Trigger.Clear {...(props as Seed.TriggerClearProps)} />
}
