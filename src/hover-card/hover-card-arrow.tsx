import { HoverCard as Seed } from "@foliag/seeds/hover-card"
import { omit, type Element } from "solid-js"

export type HoverCardArrowProps = Omit<Seed.ArrowProps, "class"> & {
  /** An `Arrow.Tip` */
  children?: Element
  class?: string | undefined
}

/** Points at the trigger. Zag places and sizes it, so it has no look of its own: the tip carries the card's edge. */
export function HoverCardArrow(props: HoverCardArrowProps): Element {
  return <Seed.Arrow {...omit(props, "class")} class={props.class} />
}
