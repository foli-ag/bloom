import { Carousel as Seed } from "@foliag/seeds/carousel"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type CarouselIndicatorGroupProps = Omit<Seed.IndicatorGroupProps, "class"> & {
  class?: string | undefined
}

/** The dots, side by side. The arrow keys, Home and End move between pages from them. */
export function CarouselIndicatorGroup(props: CarouselIndicatorGroupProps): Element {
  return <Seed.IndicatorGroup {...omit(props, "class")} class={indicatorGroup({ class: props.class })} />
}

const indicatorGroup = tv({ base: "flex flex-wrap items-center justify-center" })
