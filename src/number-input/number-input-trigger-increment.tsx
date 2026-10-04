import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { NumberInput as Seed } from "@foliag/seeds/number-input"
import { omit, untrack, type Element } from "solid-js"
import { StepperTriggerContent, stepperTrigger } from "./number-input-trigger-part.jsx"
import { useNumberInputVariant } from "./number-input-variant.js"

export type NumberInputTriggerIncrementProps<As extends ValidComponent = "button"> = Seed.Trigger.IncrementProps<As>

/**
 * Adds a step to the value, and keeps adding while held. In a `field` control it is seeds' own, with no look: render it as a `Button` with words or a mark and
 * an `aria-label`. In a `stepper` it is the stepper's own end, drawn with a +: its children are the words that name it.
 */
export function NumberInputTriggerIncrement<As extends ValidComponent = "button">(
  props: NumberInputTriggerIncrementProps<As>,
): Element {
  const variant = useNumberInputVariant()
  if (untrack(variant) !== "stepper") return <Seed.Trigger.Increment {...(props as Seed.Trigger.IncrementProps)} />
  const own = props as Seed.Trigger.IncrementProps & { class?: string }
  return (
    <Seed.Trigger.Increment {...omit(own, "class", "children")} class={stepperTrigger({ class: own.class })}>
      <StepperTriggerContent mark="plus">{own.children}</StepperTriggerContent>
    </Seed.Trigger.Increment>
  )
}
