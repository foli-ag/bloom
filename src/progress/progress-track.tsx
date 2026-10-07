import { Progress as Seed, useProgressContext } from "@foliag/seeds/progress"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { useProgressLook } from "./progress-look.js"

export type ProgressTrackProps = Omit<Seed.TrackProps, "class"> & {
  class?: string | undefined
}

/**
 * The bar, which is what a screen reader finds. It holds the `Range`. On a `segmented` root it only holds the row of
 * segments, each with an edge of its own.
 */
export function ProgressTrack(props: ProgressTrackProps): Element {
  const name = useBarName()
  const look = useProgressLook()
  return (
    <Seed.Track
      {...omit(props, "class")}
      aria-labelledby={name.labelledBy()}
      aria-valuetext={name.valueText()}
      class={track({ segmented: look?.segmented() ?? false, class: props.class })}
    />
  )
}

/**
 * Zag names the bar by its value. The bar points at the `Label`'s id, so with one it is named by it instead, and the
 * value is its value text: a screen reader says "Envoi des photos, 40 %" and not "40 %" alone. Without one the id is
 * nowhere on the page, and the name stays the value.
 */
export function useBarName() {
  const api = useProgressContext()
  return {
    labelledBy: () => api().getLabelProps().id,
    valueText: () => api().valueAsString,
  }
}

// The line has a 2px edge that reaches 3:1 against the page, as a slider's does
const track = tv({
  base: "relative col-span-2 h-3 w-full",
  variants: {
    segmented: {
      false: "overflow-hidden rounded-full border-2 border-strong bg-neutral-soft",
      true: "",
    },
  },
  defaultVariants: { segmented: false },
})
