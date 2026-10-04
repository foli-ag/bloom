import { Swap as Seed } from "@foliag/seeds/swap"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type SwapIndicatorProps = Omit<Seed.IndicatorProps, "class"> & {
  class?: string | undefined
}

/**
 * One of the two states. It pops in on the lively spring as it comes and fades out as it goes, and does not animate
 * on the first render. Under reduced motion it only fades.
 */
export function SwapIndicator(props: SwapIndicatorProps): Element {
  return <Seed.Indicator {...omit(props, "class")} hidden={false} class={indicator({ class: props.class })} />
}

// `inline-flex` and not inline, as `scale` does nothing to an inline box
const indicator = tv({
  base: [
    "inline-flex items-center gap-2 transition-[visibility] duration-0",
    "data-[state=open]:animate-pop-in data-[state=closed]:animate-fade-out",
  ],
})
