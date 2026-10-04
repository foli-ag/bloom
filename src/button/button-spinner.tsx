import type { Element } from "solid-js"

/** A ring that turns, for a button that is busy. It carries no words: the button's own text does. */
export function ButtonSpinner(): Element {
  return (
    // The outer span pops in and the svg turns, as two animations cannot share one element
    <span aria-hidden="true" class="inline-flex animate-pop-in">
      <svg viewBox="0 0 24 24" fill="none" class="size-[1.25em] shrink-0 animate-spin-ring">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      </svg>
    </span>
  )
}
