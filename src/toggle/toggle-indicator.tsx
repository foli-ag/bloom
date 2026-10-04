import { Toggle as Seed } from "@foliag/seeds/toggle"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { Mark, tick } from "../internal/icons.jsx"

export type ToggleIndicatorProps = Omit<Seed.IndicatorProps<"span">, "class" | "children" | "fallback" | "as"> & {
  /** A mark of the app's own to show while pressed, instead of the tick */
  children?: JSX.Element
  /** A mark to show while not pressed, instead of an empty space the size of the tick */
  fallback?: JSX.Element
  class?: string | undefined
}

/**
 * A tick before the words that springs in as the toggle is pressed. While it is not pressed its place stays empty, so
 * the words do not move. It is decoration, hidden from assistive technology: the toggle is announced as pressed.
 */
export function ToggleIndicator(props: ToggleIndicatorProps): Element {
  return (
    <Seed.Indicator
      as="span"
      aria-hidden="true"
      {...omit(props, "class", "children", "fallback")}
      fallback={props.fallback ?? <span class="size-5" />}
      class={indicator({ class: props.class })}
    >
      {props.children ?? (
        <Mark stroke-width={3.5} class="size-5 animate-pop-in">
          <path d={tick} />
        </Mark>
      )}
    </Seed.Indicator>
  )
}

const indicator = tv({ base: "inline-flex shrink-0" })
