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
 * looks like a `ToggleGroup` segment on its own: 48px tall, filled with the primary color while pressed. With an
 * `Indicator`, its words sit in the middle while it is not pressed, and slide over as the tick springs in before them.
 *
 * @example
 * <Toggle.Root onPressedChange={setIrrigated}>
 *   <Toggle.Indicator />
 *   Irriguées
 * </Toggle.Root>
 */
export function ToggleRoot(props: ToggleRootProps): Element {
  return (
    <Seed.Root {...omit(props, "class", "children")} class={toggleRoot({ class: props.class })}>
      <span class={toggleContent()}>{props.children}</span>
    </Seed.Root>
  )
}

// With an indicator it is wider by the room the tick takes, half on each side, so the words sit in the middle while it
// is empty, and the tick and the words sit in the middle together once it shows.
export const toggleRoot = tv({
  base: [
    "inline-flex min-h-12 pressable items-center justify-center rounded-control border-2 border-strong bg-raised",
    "px-5 py-2 text-base font-semibold tracking-body text-ink has-[>span>[data-part=indicator]]:px-8",
    "motion-press hover:border-ink focus-ring",
    "not-disabled:data-[state=on]:border-primary-edge not-disabled:data-[state=on]:bg-primary",
    "not-disabled:data-[state=on]:text-on-primary not-disabled:data-[state=on]:hover:bg-primary-400",
    "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-ink",
  ],
})

// The indicator is out of the flow, just before the words. While it shows a mark, the words slide over by half of it
// and its gap, 12px, as a pressed segment's do. They cross on `--duration-travel`, at once under reduced motion.
export const toggleContent = tv({
  base: [
    "relative inline-flex items-center gap-2",
    "transition-[translate] duration-(--duration-travel) ease-smooth",
    "has-[>[data-part=indicator][data-state=on]]:translate-x-3 rtl:has-[>[data-part=indicator][data-state=on]]:-translate-x-3",
    "has-[>[data-part=indicator][data-fallback]]:translate-x-3 rtl:has-[>[data-part=indicator][data-fallback]]:-translate-x-3",
  ],
})
