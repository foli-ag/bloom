import { Tooltip as Seed } from "@foliag/seeds/tooltip"
import { omit, type Element } from "solid-js"

export type TooltipArrowProps = Omit<Seed.ArrowProps, "class"> & {
  /** An `Arrow.Tip` */
  children?: Element
  class?: string | undefined
}

/** Points at the trigger. Zag places and sizes it, so it has no look of its own: the tip carries the color. */
export function TooltipArrow(props: TooltipArrowProps): Element {
  return <Seed.Arrow {...omit(props, "class")} class={props.class} />
}
