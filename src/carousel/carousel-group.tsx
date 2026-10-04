import { Carousel as Seed } from "@foliag/seeds/carousel"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type CarouselGroupProps = Omit<Seed.GroupProps, "class"> & {
  class?: string | undefined
}

/**
 * The row of slides, which scrolls and snaps a page at a time. It takes focus, so a keyboard can scroll it and the ring
 * shows where it is.
 */
export function CarouselGroup(props: CarouselGroupProps): Element {
  return <Seed.Group tabindex={0} {...omit(props, "class")} class={group({ class: props.class })} />
}

const group = tv({ base: "rounded-card focus-ring" })
