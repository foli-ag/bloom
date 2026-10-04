import { Carousel as Seed } from "@foliag/seeds/carousel"
import { omit, untrack, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { forwardRef } from "../internal/pointer.js"
import { useCarouselPeek } from "./carousel-look.js"

export type CarouselGroupProps = Omit<Seed.GroupProps, "class"> & {
  class?: string | undefined
}

/**
 * The row of slides, which scrolls and snaps a page at a time. It takes focus, so a keyboard can scroll it and the ring
 * shows where it is. Under reduced motion the triggers and the dots change the page at once instead of gliding to it.
 *
 * On a `peek` root the slides are narrower than the row by twice `--peek`, and each page stops `--peek` from the row's
 * start (`scroll-padding`), so the slides on either side show at the edges. The browser cannot stop the first page
 * before the start or the last past the end, so those two sit flush with the row and show twice as much of their one
 * neighbour. Zag reads the same stops to count the pages, so the dots, the counter and a swipe agree.
 */
export function CarouselGroup(props: CarouselGroupProps): Element {
  const rest = omit(props, "class")
  const peek = useCarouselPeek()
  return (
    <Seed.Group
      tabindex={0}
      {...rest}
      ref={(element: HTMLElement) => {
        stillUnderReducedMotion(element)
        forwardRef(
          untrack(() => rest.ref),
          element,
        )
      }}
      class={group({ peek: peek(), class: props.class })}
    />
  )
}

/**
 * Zag moves to a page with `scrollTo({ behavior: "smooth" })`, which CSS cannot turn off, so a whole slide would glide
 * across the screen for a farmer who asked for less motion. Under reduced motion the scroll is made at once. A finger
 * still drags the row as it always does.
 */
function stillUnderReducedMotion(element: HTMLElement) {
  const scrollTo = element.scrollTo.bind(element)
  element.scrollTo = ((options?: ScrollToOptions | number, y?: number) => {
    if (typeof options === "number") return scrollTo(options, y ?? 0)
    const smooth = options?.behavior === "smooth" && reducedMotion()
    return scrollTo(smooth ? { ...options, behavior: "instant" } : options)
  }) as typeof element.scrollTo
}

/** The motion setting as `theme.css` reads it: `data-motion` on <html> first, then the system's */
function reducedMotion() {
  const setting = document.documentElement.getAttribute("data-motion")
  return setting ? setting === "reduced" : matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Zag lays the slides out from inline styles: a gap of `--slide-spacing` and slides of `--slide-item-size`, which the
// root sets. A peeking row needs a gap however the app set it, so `!` wins over the inline gap, and the group sets its
// own slide size, which its grid reads before the root's.
const group = tv({
  base: "rounded-card focus-ring",
  variants: {
    peek: {
      true: [
        "[--peek:2rem] [--peek-gap:max(var(--slide-spacing),0.75rem)] gap-(--peek-gap)! scroll-px-(--peek)",
        "[--slide-item-size:calc((100%_-_2*var(--peek))/var(--slides-per-page)_-_var(--peek-gap)*(var(--slides-per-page)_-_1)/var(--slides-per-page))]",
      ],
      false: "",
    },
  },
  defaultVariants: { peek: false },
})
