import { Carousel as Seed } from "@foliag/seeds/carousel"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type CarouselControlProps = Omit<Seed.ControlProps, "class"> & {
  class?: string | undefined
}

/** The row under the slides: the triggers at its ends and the indicators between them */
export function CarouselControl(props: CarouselControlProps): Element {
  return <Seed.Control {...omit(props, "class")} class={control({ class: props.class })} />
}

const control = tv({ base: "flex items-center justify-between gap-2" })
