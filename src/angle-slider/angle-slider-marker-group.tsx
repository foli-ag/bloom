import { AngleSlider as Seed } from "@foliag/seeds/angle-slider"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type AngleSliderMarkerGroupProps = Omit<Seed.MarkerGroupProps, "class"> & {
  class?: string | undefined
}

/** Holds the `Marker`s over the dial, under the needle */
export function AngleSliderMarkerGroup(props: AngleSliderMarkerGroupProps): Element {
  return <Seed.MarkerGroup {...omit(props, "class")} class={markerGroup({ class: props.class })} />
}

const markerGroup = tv({ base: "pointer-events-none absolute inset-0" })
