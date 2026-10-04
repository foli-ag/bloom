import { Carousel as Seed } from "@foliag/seeds/carousel"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { translationsFrom, type CarouselTranslations } from "./use-carousel.js"

export type CarouselRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** The names of the slides and indicators, and the progress text. Required, as zag's are English. */
  translations: CarouselTranslations
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A row of slides seen one page at a time, such as the photos of a field. A finger swipes from one to the next and the
 * row snaps to each page. The triggers are seeds' own, with no look: render them as a `Button` with words.
 *
 * Autoplay is there, but a farmer reading a slide in the sun should not have it taken away: leave it off unless the
 * slides only decorate.
 *
 * @example
 * <Carousel.Root slideCount={photos.length} translations={{
 *   indicator: (index) => `Photo ${index + 1}`,
 *   item: (index, count) => `${index + 1} sur ${count}`,
 *   progressText: ({ page, totalPages }) => `${page} sur ${totalPages}`,
 * }}>
 *   <Carousel.Group>
 *     <For each={photos}>{(photo, index) => <Carousel.Item index={index()}><img src={photo.src} alt={photo.alt} /></Carousel.Item>}</For>
 *   </Carousel.Group>
 *   <Carousel.Control>
 *     <Carousel.Trigger.Prev as={Button} tone="neutral" variant="outline">Précédente</Carousel.Trigger.Prev>
 *     <Carousel.IndicatorGroup>
 *       <For each={photos}>{(_, index) => <Carousel.Indicator index={index()} />}</For>
 *     </Carousel.IndicatorGroup>
 *     <Carousel.Trigger.Next as={Button} tone="neutral" variant="outline">Suivante</Carousel.Trigger.Next>
 *   </Carousel.Control>
 * </Carousel.Root>
 */
export function CarouselRoot(props: CarouselRootProps): Element {
  return (
    <Seed.Root
      {...omit(props, "class", "translations")}
      translations={translationsFrom(props.translations)}
      class={root({ class: props.class })}
    />
  )
}

export const root = tv({ base: "grid w-full min-w-0 gap-3" })
