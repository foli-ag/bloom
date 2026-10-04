import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { NumberInput as Seed } from "@foliag/seeds/number-input"
import { omit, untrack, type Element } from "solid-js"
import { StepperTriggerContent, stepperTrigger } from "./number-input-trigger-part.jsx"
import { useNumberInputVariant } from "./number-input-variant.js"

export type NumberInputTriggerDecrementProps<As extends ValidComponent = "button"> = Seed.Trigger.DecrementProps<As>

/**
 * Takes a step off the value, and keeps taking while held. In a `field` control it is seeds' own, with no look: render it as a `Button` with words or a mark and
 * an `aria-label`. In a `stepper` it is the stepper's own end, drawn with a −: its children are the words that name it.
 */
export function NumberInputTriggerDecrement<As extends ValidComponent = "button">(
  props: NumberInputTriggerDecrementProps<As>,
): Element {
  const variant = useNumberInputVariant()
  if (untrack(variant) !== "stepper") return <Seed.Trigger.Decrement {...(props as Seed.Trigger.DecrementProps)} />
  const own = props as Seed.Trigger.DecrementProps & { class?: string }
  return (
    <Seed.Trigger.Decrement {...omit(own, "class", "children")} class={stepperTrigger({ class: own.class })}>
      <StepperTriggerContent mark="minus">{own.children}</StepperTriggerContent>
    </Seed.Trigger.Decrement>
  )
}
