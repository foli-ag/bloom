import { Toggle as Seed } from "@foliag/seeds/toggle"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type ToggleRootProps = Omit<Seed.RootProps, "class" | "children"> & {
  /**
   * Its words, which stay the same pressed or not: a screen reader says "pressed" itself. Usually an `Indicator`
   * first, the tick that shows it is pressed.
   */
  children: JSX.Element
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A button that stays pressed until it is pressed again, such as a filter that shows only the irrigated parcels. It
 * looks like a `ToggleGroup` segment on its own: 48px tall, filled with the primary color while pressed.
 *
 * @example
 * <Toggle.Root onPressedChange={setIrrigated}>
 *   <Toggle.Indicator />
 *   Irriguées
 * </Toggle.Root>
 */
export function ToggleRoot(props: ToggleRootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={toggleRoot({ class: props.class })} />
}

export const toggleRoot = tv({
  base: [
    "inline-flex min-h-12 pressable items-center justify-center gap-2 rounded-control border-2 border-strong bg-raised",
    "px-5 py-2 text-base font-semibold tracking-body text-ink",
    "motion-press hover:border-ink focus-ring",
    "data-[state=on]:border-primary-edge data-[state=on]:bg-primary data-[state=on]:text-on-primary",
    "data-[state=on]:hover:bg-primary-400",
    "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-ink",
  ],
})
