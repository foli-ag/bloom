import { NumberInput as Seed } from "@foliag/seeds/number-input"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { fieldFrame } from "../internal/field.js"
import { NumberInputVariantContext, type NumberInputVariant } from "./number-input-variant.js"

export type NumberInputControlProps = Omit<Seed.ControlProps, "class"> & {
  /**
   * `field`, the default, puts the field between two buttons of the app's, rendered as a `Button`. `stepper` joins two
   * large buttons of its own and the value in one box, for a quantity counted more than typed: a number of bags, of
   * rows, of animals.
   */
  variant?: NumberInputVariant | undefined
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A row holding the field between its two buttons, each at the thumb's 48px.
 *
 * As a `stepper` it is one box, 56px tall, the field's edge around a − and a + of 48px at either end and the value large
 * and centred between them. The box takes the field's states as one control: darker under the pointer, the ring while
 * the value has the focus, the invalid line, greyed when disabled.
 *
 * @example
 * <NumberInput.Control variant="stepper">
 *   <NumberInput.Trigger.Decrement>Un sac de moins</NumberInput.Trigger.Decrement>
 *   <NumberInput.Input />
 *   <NumberInput.Trigger.Increment>Un sac de plus</NumberInput.Trigger.Increment>
 * </NumberInput.Control>
 */
export function NumberInputControl(props: NumberInputControlProps): Element {
  const variant = () => props.variant ?? "field"
  return (
    <NumberInputVariantContext value={variant}>
      <Seed.Control
        {...omit(props, "class", "variant")}
        data-variant={variant()}
        class={
          variant() === "stepper"
            ? fieldFrame({ size: "lg", class: [stepper(), props.class] })
            : control({ class: props.class })
        }
      />
    </NumberInputVariantContext>
  )
}

const control = tv({ base: "flex items-stretch gap-2" })

// The buttons sit 2px inside the edge, and the box's corners are rounder by as much, so the two curves run side by side
const stepper = tv({ base: "items-center gap-0.5 rounded-card p-0.5" })
