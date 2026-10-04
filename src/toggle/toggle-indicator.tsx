import { Toggle as Seed } from "@foliag/seeds/toggle"
import type { JSX } from "@solidjs/web"
import { omit, Show, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { Mark, tick } from "../internal/icons.jsx"

export type ToggleIndicatorProps = Omit<Seed.IndicatorProps<"span">, "class" | "children" | "fallback" | "as"> & {
  /** A mark of the app's own to show while pressed, instead of the tick */
  children?: JSX.Element
  /** A mark to show while not pressed, instead of nothing */
  fallback?: JSX.Element
  class?: string | undefined
}

/**
 * A tick before the words that springs in as the toggle is pressed, and fades out as it is let go. While it is empty the
 * words sit in the middle of the toggle, and they slide over as it fills. It is decoration, hidden from assistive
 * technology: the toggle is announced as pressed.
 */
export function ToggleIndicator(props: ToggleIndicatorProps): Element {
  // The seeds part shows its children while pressed and its fallback otherwise. Both are this one node, so neither mark
  // is taken out as the toggle changes: each fades out as well as in, and turns round from where it is.
  const marks = (
    <span class="grid">
      <span class={mark({ shown: "on" })}>
        {props.children ?? (
          <Mark stroke-width={3.5} class="size-5">
            <path d={tick} />
          </Mark>
        )}
      </span>
      <Show when={props.fallback}>
        <span class={mark({ shown: "off" })}>{props.fallback}</span>
      </Show>
    </span>
  )
  return (
    <Seed.Indicator
      as="span"
      aria-hidden="true"
      {...omit(props, "class", "children", "fallback")}
      data-fallback={props.fallback === undefined ? undefined : ""}
      fallback={marks}
      class={indicator({ class: props.class })}
    >
      {marks}
    </Seed.Indicator>
  )
}

// Out of the flow, 4px before the words, which make room for it (`toggleContent` in the root)
const indicator = tv({ base: "group/indicator absolute end-full top-1/2 me-1 flex -translate-y-1/2" })

// A mark pops in on the lively spring and leaves quicker, fading and shrinking on the exit clock with nothing past its
// end. Under reduced motion it only fades.
const mark = tv({
  base: [
    "inline-flex scale-(--pop-in-scale) opacity-0 [grid-area:1/1]",
    "[transition:scale_var(--duration-exit)_var(--ease-smooth),opacity_var(--duration-exit)_var(--ease-smooth)]",
  ],
  variants: {
    shown: {
      on: [
        "group-data-[state=on]/indicator:scale-100 group-data-[state=on]/indicator:opacity-100",
        "group-data-[state=on]/indicator:[transition:scale_var(--duration-pop)_var(--ease-pop),opacity_var(--duration-exit)_var(--ease-smooth)]",
      ],
      off: [
        "group-data-[state=off]/indicator:scale-100 group-data-[state=off]/indicator:opacity-100",
        "group-data-[state=off]/indicator:[transition:scale_var(--duration-pop)_var(--ease-pop),opacity_var(--duration-exit)_var(--ease-smooth)]",
      ],
    },
  },
})
