import { Carousel as Seed, useCarouselContext } from "@foliag/seeds/carousel"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type CarouselIndicatorProps = Omit<Seed.IndicatorProps, "class" | "children"> & {
  class?: string | undefined
}

/**
 * A dot for a page, in a 48px target. The current page's dot is filled green and a little larger, and is marked as
 * current. Its name is `translations.indicator`.
 */
export function CarouselIndicator(props: CarouselIndicatorProps): Element {
  const api = useCarouselContext()
  return (
    <Seed.Indicator
      {...omit(props, "class")}
      aria-current={api().page === props.index ? "true" : undefined}
      class={indicator({ class: props.class })}
    />
  )
}

// The dot is drawn by `::before`, so the button around it stays a finger's width
const indicator = tv({
  base: [
    "group/dot relative inline-flex size-12 pressable items-center justify-center rounded-full focus-ring",
    "before:size-3.5 before:rounded-full before:border-2 before:border-strong before:bg-raised before:content-['']",
    "before:motion-touch hover:before:border-ink",
    "data-current:before:scale-125 data-current:before:border-primary-edge data-current:before:bg-primary-edge",
    "active:before:scale-(--press-scale-small)",
  ],
})
