import { Carousel as Seed } from "@foliag/seeds/carousel"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type CarouselItemProps = Omit<Seed.ItemProps, "class"> & {
  class?: string | undefined
}

/** A slide, cut to the rounded corners of the row. Its name is `translations.item`. */
export function CarouselItem(props: CarouselItemProps): Element {
  return <Seed.Item {...omit(props, "class")} class={item({ class: props.class })} />
}

const item = tv({ base: "min-w-0 overflow-hidden rounded-card" })
