import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"

interface MarkProps {
  class?: string | undefined
  /** Thicker for a small mark, so it still reads in the sun. 3 by default. */
  "stroke-width"?: number | undefined
  children: JSX.Element
}

/**
 * The few marks components draw on their own, as inline strokes in the text color, so nothing is fetched. They are
 * decoration: the words next to them name the control, so they are hidden from assistive technology.
 */
export function Mark(props: MarkProps): Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={props["stroke-width"] ?? 3}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class={props.class}
    >
      {props.children}
    </svg>
  )
}

/** The tick of a checked box, an on switch and a pressed segment. `pathLength="1"` on it lets a dash draw it in. */
export const tick = "M5 12.5 9.5 17 19 7"

export function Chevron(props: { class?: string | undefined }): Element {
  return (
    <Mark class={props.class}>
      <path d="m6 9 6 6 6-6" />
    </Mark>
  )
}
