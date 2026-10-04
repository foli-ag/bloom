import { Progress as Seed } from "@foliag/seeds/progress"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type ProgressCircleRangeProps = Omit<Seed.CircleRangeProps, "class"> & {
  class?: string | undefined
}

/**
 * The arc the value fills, from the top, in the green of an edge, which is 3:1 against the page. It closes on the
 * smooth spring. While the value is not known it is a quarter of the ring, and the ring turns.
 */
export function ProgressCircleRange(props: ProgressCircleRangeProps): Element {
  return <Seed.Circle.Range {...omit(props, "class")} class={range({ class: props.class })} />
}

const range = tv({
  base: [
    "stroke-primary-edge [stroke-linecap:round]",
    "transition-[stroke-dashoffset] duration-(--duration-smooth) ease-smooth",
    "data-[state=indeterminate]:[stroke-dasharray:calc(var(--circumference)*0.25)_var(--circumference)]",
  ],
})
