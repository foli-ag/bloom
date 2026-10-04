import { AngleSlider as Seed } from "@foliag/seeds/angle-slider"
import { omit, untrack, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { createFollowing, forwardRef, notePointer } from "../internal/pointer.js"

export type AngleSliderControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/**
 * The dial, a 192px disc with an edge that reaches 3:1. It holds a `MarkerGroup` and the `Thumb`, laid over each
 * other. A press anywhere on it points the needle there, and the needle turns to it on the smooth spring; once the
 * finger moves, the needle follows it exactly.
 */
export function AngleSliderControl(props: AngleSliderControlProps): Element {
  const rest = omit(props, "class")
  const [following, follow] = createFollowing()
  return (
    <Seed.Control
      {...rest}
      ref={(element: HTMLElement) => {
        follow(element)
        notePointer(element)
        forwardRef(
          untrack(() => rest.ref),
          element,
        )
      }}
      data-following={following() ? "" : undefined}
      class={control({ class: props.class })}
    />
  )
}

// `--dial-glide` is how long the needle takes to turn to a new angle: the travel time, at once under reduced motion, and
// nothing while it follows the pointer. A dragged knob grows by `--hold-scale`. The needle's focus ring is gone after a
// press, as the ring is the keyboard's.
const control = tv({
  base: [
    "relative col-span-2 size-48 cursor-pointer justify-self-center rounded-full border-2 border-strong bg-raised",
    "data-pointer:[--focus-style:none]",
    "[--dial-glide:var(--duration-travel)] data-following:[--dial-glide:0s]",
    "data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled",
    // Invalid adds a second, inner line to the rim, as it does to a field, so that the change is not a color alone
    "data-invalid:border-danger-text data-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
  ],
})
