import { HoverCard as Seed } from "@foliag/seeds/hover-card"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type HoverCardArrowTipProps = Omit<Seed.ArrowTipProps, "class" | "children"> & {
  class?: string | undefined
}

/** The point, filled like the card and edged on its two outer sides, which zag turns toward the trigger */
export function HoverCardArrowTip(props: HoverCardArrowTipProps): Element {
  return <Seed.Arrow.Tip {...omit(props, "class")} class={tip({ class: props.class })} />
}

const tip = tv({ base: "border-s-2 border-t-2 border-strong" })
