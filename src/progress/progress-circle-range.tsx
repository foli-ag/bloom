import { Progress as Seed } from "@foliag/seeds/progress"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type ProgressCircleRangeProps = Omit<Seed.CircleRangeProps, "class"> & {
  class?: string | undefined
}

/**
 * The arc the value fills, from the top, in the tone's fill, which is 3:1 against the track and the page. It closes on
 * the smooth spring, and its color eases when the tone changes. While the value is not known it is a quarter of the
 * ring, and the ring turns.
 */
export function ProgressCircleRange(props: ProgressCircleRangeProps): Element {
  return <Seed.Circle.Range {...omit(props, "class")} class={range({ class: props.class })} />
}

const range = tv({
  base: [
    "stroke-(--progress-fill) [stroke-linecap:round]",
    "transition-[stroke-dashoffset,stroke] duration-(--duration-smooth) ease-smooth",
    "data-[state=indeterminate]:[stroke-dasharray:calc(var(--circumference)*0.25)_var(--circumference)]",
  ],
})
