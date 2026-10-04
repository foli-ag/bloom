import { Progress as Seed } from "@foliag/seeds/progress"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type ProgressRangeProps = Omit<Seed.RangeProps, "class"> & {
  class?: string | undefined
}

/**
 * The filled part of the bar. It grows on the smooth spring as the value moves, by its scale so nothing is laid out
 * again. While the value is not known, a short piece slides along the bar.
 */
export function ProgressRange(props: ProgressRangeProps): Element {
  return <Seed.Range {...omit(props, "class")} class={range({ class: props.class })} />
}

// The green of an edge and not the brand fill, because it is what shows how much, and the brand green is only 2.5:1.
// Zag sizes it with an inline width; it spans the bar instead and scales to `--percent`, which the root sets.
const range = tv({
  base: [
    "h-full rounded-full bg-primary-edge",
    "!w-full origin-left scale-x-[calc(var(--percent)/100)] rtl:origin-right",
    "transition-[scale] duration-(--duration-smooth) ease-smooth",
    "data-[state=indeterminate]:!w-1/3 data-[state=indeterminate]:scale-x-100 data-[state=indeterminate]:animate-progress-slide",
  ],
})
