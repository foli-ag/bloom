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

/** The tones a status can take, each with a mark of its own shape, so a status is never told by its color alone */
export type StatusTone = "info" | "success" | "warning" | "danger"

/**
 * The mark of a status: an "i" in a circle for information, a tick in a circle for success, a "!" in a triangle for a
 * warning and in an octagon for danger. The outlines differ as well as the signs, so two statuses side by side read
 * apart in the sun, on a grey screen or to a farmer who does not see red from green. An alert draws it at the size of
 * a line of its text, a badge a little smaller.
 */
export function StatusMark(props: {
  tone: StatusTone
  class?: string | undefined
  "stroke-width"?: number | undefined
}): Element {
  return (
    <Mark class={props.class} stroke-width={props["stroke-width"] ?? 2.5}>
      <path d={statusMarks[props.tone]} />
    </Mark>
  )
}

// The signs' dots are lines of no length, which their round caps turn into dots as wide as the stroke
const statusMarks: Record<StatusTone, string> = {
  info: "M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM12 11v5.5M12 7.5h.01",
  success: "M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM8 12.25l2.75 2.75L16 9.5",
  warning: "M10.27 4 2.6 17.5a2 2 0 0 0 1.73 3h15.34a2 2 0 0 0 1.73-3L13.73 4a2 2 0 0 0-3.46 0ZM12 9.5v4M12 17h.01",
  danger: "M8.4 2.5h7.2l5.4 5.4v7.2l-5.4 5.4H8.4L3 15.1V7.9ZM12 7.5V13M12 16.5h.01",
}

/** A cross, for a button that takes something away: a chip's */
export const cross = "M7 7l10 10M17 7 7 17"

/** Three dots in a row, for what stands in for parts left out, such as the start of a long breadcrumb trail */
export const ellipsis = "M5 12h.01M12 12h.01M19 12h.01"
