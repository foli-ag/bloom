import { NumberInput as Seed, useNumberInputContext } from "@foliag/seeds/number-input"
import { createEffect, omit, untrack, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { fieldBox, fieldFrameInput } from "../internal/field.js"
import { forwardRef } from "../internal/pointer.js"
import { useNumberInputVariant } from "./number-input-variant.js"

export type NumberInputInputProps = Omit<Seed.InputProps, "class"> & {
  class?: string | undefined
}

/**
 * The field, its digits centered and of even width, so the number does not shift as it steps.
 *
 * In a stepper it has no box of its own, as the stepper is the box, and its number is large. A value stepped by a button
 * or an arrow key rolls in from the side it moves to, up from below as it grows and down from above as it shrinks, so
 * the eye catches the change without the number jumping. Typing does not roll it, nor does a held button after its
 * first step, whose quick steps would only blur. Under reduced motion it only fades in.
 */
export function NumberInputInput(props: NumberInputInputProps): Element {
  const variant = untrack(useNumberInputVariant())
  if (variant !== "stepper") {
    return <Seed.Input {...omit(props, "class")} class={fieldBox({ class: [input(), props.class] })} />
  }
  const api = useNumberInputContext()
  let field: HTMLElement | undefined
  // When the farmer last typed: a value that changes right after comes from the typing
  let typed = Number.NEGATIVE_INFINITY
  let last = 0
  let roll: Animation | undefined
  let previous = untrack(() => api().valueAsNumber)
  createEffect(
    () => api().valueAsNumber,
    (value) => {
      // Zag reports the same number again as it formats it: only a new one rolls
      const from = previous
      if (value === from || (Number.isNaN(value) && Number.isNaN(from))) return
      previous = value
      const now = performance.now()
      const quick = now - last < 200
      last = now
      if (now - typed < 100) return
      if (!field || quick || Number.isNaN(value) || Number.isNaN(from)) return
      roll?.cancel()
      roll = rollIn(field, value > from ? 1 : -1)
    },
    { defer: true },
  )
  return (
    <Seed.Input
      {...omit(props, "class")}
      ref={(element: HTMLElement) => {
        field = element
        element.addEventListener("input", () => {
          typed = performance.now()
        })
        forwardRef(
          untrack(() => props.ref),
          element,
        )
      }}
      class={fieldFrameInput({ class: [stepper(), props.class] })}
    />
  )
}

/**
 * The number comes from half the enter distance on the side it moves to, faint, and settles on the smooth spring. The
 * distance and the curve are the theme's tokens, so reduced motion leaves the fade.
 */
function rollIn(field: HTMLElement, direction: 1 | -1): Animation {
  const style = getComputedStyle(field)
  const distance = `calc(${style.getPropertyValue("--enter-distance") || "0px"} * ${direction * 0.5})`
  return field.animate(
    [
      { translate: `0 ${distance}`, opacity: 0.35 },
      { translate: "0 0", opacity: 1 },
    ],
    {
      duration: Number.parseFloat(style.getPropertyValue("--duration-smooth")) || 450,
      easing: style.getPropertyValue("--ease-smooth").trim() || "ease-out",
    },
  )
}

const input = tv({ base: "min-w-0 flex-1 px-4 py-2 text-center tabular-nums" })

// The box is the stepper's, so the field only holds the number, at 24px between the two buttons
const stepper = tv({ base: "px-2 text-center text-xl font-semibold tabular-nums" })
