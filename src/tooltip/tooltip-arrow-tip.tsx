import { Tooltip as Seed } from "@foliag/seeds/tooltip"
import { omit, type Element } from "solid-js"

export type TooltipArrowTipProps = Omit<Seed.ArrowTipProps, "class" | "children"> & {
  class?: string | undefined
}

/** The point itself, in the tooltip's ink */
export function TooltipArrowTip(props: TooltipArrowTipProps): Element {
  return <Seed.Arrow.Tip {...omit(props, "class")} class={props.class} />
}
