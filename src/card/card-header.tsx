import { Polymorphic } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { useCardContext } from "./card-context.js"

export interface CardHeaderProps {
  /** A `Title`, a `Description` under it, and anything else, such as a badge, which sits at the end beside them */
  children: JSX.Element
  class?: string | undefined
}

/**
 * The top of a card: its title with its description close under it. Anything else in it, a `Badge` or a menu's
 * trigger, sits at the end of the title's line, so a status reads with the name it belongs to.
 */
export function CardHeader(props: CardHeaderProps): Element {
  const card = useCardContext()
  // Fixed for the card's life, so the element is never rebuilt
  const tag = card?.phrasing ? "span" : "div"
  return (
    <Polymorphic as={tag} data-scope="card" data-part="header" class={header({ class: props.class })}>
      {props.children}
    </Polymorphic>
  )
}

// Title and description stack in the first column, and skeletons standing in for them while the card loads.
// Anything else goes to the second, on the title's line
const header = tv({
  base: [
    "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 *:col-start-1",
    "[&>:not([data-part=title],[data-part=description],[data-scope=skeleton])]:col-start-2",
    "[&>:not([data-part=title],[data-part=description],[data-scope=skeleton])]:row-span-2",
    "[&>:not([data-part=title],[data-part=description],[data-scope=skeleton])]:row-start-1",
    "[&>:not([data-part=title],[data-part=description],[data-scope=skeleton])]:justify-self-end",
  ],
})
