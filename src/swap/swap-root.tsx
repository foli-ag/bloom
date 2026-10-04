import { Swap as Seed } from "@foliag/seeds/swap"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type SwapRootProps = Omit<Seed.RootProps, "class" | "lazyMount" | "unmountOnExit"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * Shows one of two indicators, the "on" one while `swap` is set, and springs from one to the other: the new one pops
 * in as the old one fades out in the same place. Both stay mounted in one cell, as wide as the wider, so what is around
 * them does not move. Use it inside a button whose words or mark change after an action, such as "Enregistrer" turning into
 * "Enregistré".
 *
 * @example
 * <Button onClick={save}>
 *   <Swap.Root swap={saved()}>
 *     <Swap.Indicator type="off">Enregistrer</Swap.Indicator>
 *     <Swap.Indicator type="on">Enregistré</Swap.Indicator>
 *   </Swap.Root>
 * </Button>
 */
export function SwapRoot(props: SwapRootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={swapRoot({ class: props.class })} />
}

// The indicator not shown is hidden with `visibility`, which keeps its room in the cell, as `display: none` would not.
// It turns hidden only once its exit has played: a transition on `visibility` holds it visible for its length.
export const swapRoot = tv({
  base: [
    "place-items-center",
    "[&[data-swap=on]>[data-type=off]]:invisible [&[data-swap=on]>[data-type=off]]:delay-(--duration-exit)",
    "[&[data-swap=off]>[data-type=on]]:invisible [&[data-swap=off]>[data-type=on]]:delay-(--duration-exit)",
  ],
})
