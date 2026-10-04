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

// The dot is drawn by `::before`, so the button around it stays a finger's width. Its focus ring is the dot's own,
// inside its edge, as a ring the size of the target would circle empty space around a dot a quarter of its size.
const indicator = tv({
  base: [
    "group/dot relative inline-flex size-12 pressable items-center justify-center rounded-full outline-none",
    "focus-visible:before:outline-3 focus-visible:before:-outline-offset-3 focus-visible:before:outline-solid",
    "focus-visible:before:outline-focus data-current:focus-visible:before:shadow-[inset_0_0_0_1px_var(--color-surface)]",
    "before:size-3.5 before:rounded-full before:border-2 before:border-strong before:bg-raised before:content-['']",
    "before:motion-touch hover:before:border-ink",
    "data-current:before:scale-125 data-current:before:border-primary-edge data-current:before:bg-primary-edge",
    "active:before:scale-(--press-scale-small)",
  ],
})
