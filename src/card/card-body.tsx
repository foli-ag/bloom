import { Polymorphic } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { tv } from "tailwind-variants"
import { useCardContext } from "./card-context.js"

export interface CardBodyProps {
  /** What the card holds: text, a list of figures, a chart */
  children: JSX.Element
  class?: string | undefined
}

/** What the card holds, between its header and its actions */
export function CardBody(props: CardBodyProps): Element {
  const card = useCardContext()
  // Fixed for the card's life, so the element is never rebuilt
  const tag = card?.phrasing ? "span" : "div"
  return (
    <Polymorphic as={tag} data-scope="card" data-part="body" class={body({ class: props.class })}>
      {props.children}
    </Polymorphic>
  )
}

const body = tv({ base: "block min-w-0 text-base text-ink" })
