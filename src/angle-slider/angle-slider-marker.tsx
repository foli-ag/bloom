import { AngleSlider as Seed } from "@foliag/seeds/angle-slider"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type AngleSliderMarkerProps = Omit<Seed.MarkerProps, "class"> & {
  class?: string | undefined
}

/**
 * A tick on the rim at the angle `value`, such as every 90 degrees. The knob covers the one it points at. It is
 * decoration: put the words, N, E, S, O, outside the dial if they matter.
 */
export function AngleSliderMarker(props: AngleSliderMarkerProps): Element {
  return <Seed.Marker aria-hidden="true" {...omit(props, "class")} class={marker({ class: props.class })} />
}

// 2px further in than the knob, so that the knob hides all of it and not only its middle
const marker = tv({
  base: [
    "absolute inset-0",
    "before:absolute before:start-1/2 before:top-1.5 before:h-3 before:w-0.5 before:-translate-x-1/2",
    "before:rounded-full before:bg-strong before:content-['']",
    "data-disabled:before:bg-disabled-ink",
  ],
})
