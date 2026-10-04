import { AngleSlider as Seed } from "@foliag/seeds/angle-slider"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type AngleSliderMarkerProps = Omit<Seed.MarkerProps, "class"> & {
  class?: string | undefined
}

/**
 * A tick on the rim at the angle `value`, such as every 90 degrees. The one the needle points at turns green. It is
 * decoration: put the words, N, E, S, O, outside the dial if they matter.
 */
export function AngleSliderMarker(props: AngleSliderMarkerProps): Element {
  return <Seed.Marker aria-hidden="true" {...omit(props, "class")} class={marker({ class: props.class })} />
}

const marker = tv({
  base: [
    "absolute inset-0",
    "before:absolute before:start-1/2 before:top-1 before:h-3 before:w-0.5 before:-translate-x-1/2",
    "before:rounded-full before:bg-strong before:content-['']",
    "data-[state=at-value]:before:bg-primary-edge",
  ],
})
