import { Carousel as Seed } from "@foliag/seeds/carousel"
import { omit, type Element } from "solid-js"
import { root } from "./carousel-root.jsx"

export type CarouselRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for a carousel made with bloom's `useCarousel`, whose page the app then reads and sets from outside it */
export function CarouselRootProvider(props: CarouselRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={root({ class: props.class })} />
}
