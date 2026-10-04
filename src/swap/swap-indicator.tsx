import { Swap as Seed } from "@foliag/seeds/swap"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type SwapIndicatorProps = Omit<Seed.IndicatorProps, "class"> & {
  class?: string | undefined
}

/**
 * One of the two states. It pops in on the lively spring as it comes, and fades and shrinks on the quicker exit clock as
 * it goes. Both are transitions, so a second press half way turns each one round from where it is. Nothing animates on
 * the first render. Under reduced motion it only fades.
 */
export function SwapIndicator(props: SwapIndicatorProps): Element {
  return <Seed.Indicator {...omit(props, "class")} hidden={false} class={indicator({ class: props.class })} />
}

// `inline-flex` and not inline, as `scale` does nothing to an inline box. This is how it comes; how it goes is on the
// root, which knows which one is shown.
const indicator = tv({
  base: [
    "inline-flex items-center gap-2",
    "[transition:opacity_var(--duration-smooth)_var(--ease-smooth),scale_var(--duration-pop)_var(--ease-pop),visibility_0s]",
  ],
})
