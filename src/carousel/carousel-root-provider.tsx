import { Carousel as Seed } from "@foliag/seeds/carousel"
import { omit, type Element } from "solid-js"
import { CarouselPeek } from "./carousel-look.js"
import { root } from "./carousel-root.jsx"

export type CarouselRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  /** As on `Root`: the slides next to the current one show at the edges of the row */
  peek?: boolean | undefined
  class?: string | undefined
}

/** A root for a carousel made with bloom's `useCarousel`, whose page the app then reads and sets from outside it */
export function CarouselRootProvider(props: CarouselRootProviderProps): Element {
  return (
    <CarouselPeek value={() => props.peek ?? false}>
      <Seed.RootProvider {...omit(props, "class", "peek")} class={root({ class: props.class })} />
    </CarouselPeek>
  )
}
