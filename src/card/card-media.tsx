import { Polymorphic } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { tv } from "tailwind-variants"
import { useCardContext } from "./card-context.js"

export interface CardMediaProps {
  /** A photo, a map or a chart, usually an `<img>` with its own `alt` and an aspect ratio */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A photo or a map that runs to the card's edges. First in the card it fills the top up to the edge and takes its
 * rounded corners; last, the bottom. What is inside is clipped to it.
 */
export function CardMedia(props: CardMediaProps): Element {
  const card = useCardContext()
  // Fixed for the card's life, so the element is never rebuilt
  const tag = card?.phrasing ? "span" : "div"
  return (
    <Polymorphic as={tag} data-scope="card" data-part="media" class={media({ class: props.class })}>
      {props.children}
    </Polymorphic>
  )
}

// The card's padding is taken back, and its corners less the 2px edge
const media = tv({
  base: [
    "-mx-5 block overflow-hidden *:block *:w-full",
    "first:-mt-5 first:rounded-t-[calc(var(--radius-card)-2px)] last:-mb-5 last:rounded-b-[calc(var(--radius-card)-2px)]",
  ],
})
