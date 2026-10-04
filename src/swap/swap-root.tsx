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

// The indicator not shown fades and shrinks to where the next one will pop in from, then turns hidden with
// `visibility`, which keeps its room in the cell, as `display: none` would not, and leaves it out of the button's name.
// A delayed transition on `visibility` holds it visible until the fade has played. These are the root's, as only the
// root knows which one is shown, on the first render too.
export const swapRoot = tv({
  base: [
    "place-items-center",
    "[&[data-swap=on]>[data-type=off]]:invisible [&[data-swap=on]>[data-type=off]]:opacity-0",
    "[&[data-swap=on]>[data-type=off]]:scale-(--pop-in-scale)",
    "[&[data-swap=on]>[data-type=off]]:[transition:opacity_var(--duration-exit)_var(--ease-smooth),scale_var(--duration-exit)_var(--ease-smooth),visibility_0s_var(--duration-exit)]",
    "[&[data-swap=off]>[data-type=on]]:invisible [&[data-swap=off]>[data-type=on]]:opacity-0",
    "[&[data-swap=off]>[data-type=on]]:scale-(--pop-in-scale)",
    "[&[data-swap=off]>[data-type=on]]:[transition:opacity_var(--duration-exit)_var(--ease-smooth),scale_var(--duration-exit)_var(--ease-smooth),visibility_0s_var(--duration-exit)]",
  ],
})
