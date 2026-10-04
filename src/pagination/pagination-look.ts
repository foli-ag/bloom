import { createContext, useContext, type Accessor } from "solid-js"

/**
 * How the pages show: all of them in a row (`false`), or only the triggers with the position between them, at every
 * width (`true`) or on a phone (`"phone"`), below 640px
 */
export type PaginationCompact = boolean | "phone"

export const PaginationLook = /* @__PURE__ */ createContext<Accessor<PaginationCompact> | null>(null)

/** The compact setting of the root around a part, as a variant name */
export function useCompact(): () => "row" | "always" | "phone" {
  const compact = useContext(PaginationLook)
  return () => {
    const value = compact?.() ?? false
    return value === "phone" ? "phone" : value ? "always" : "row"
  }
}

/**
 * A trigger that can no longer be pressed, the next one on the last page, is disabled, and the browser then drops the
 * focus to the top of the page: a farmer going through the pages from the keyboard would lose their place. When that
 * happens the focus moves to the page now shown, or, with no page in view as in a compact pagination, to the trigger
 * that still goes the other way. A focus that leaves for anywhere else is left alone.
 */
export function keepFocus(root: HTMLElement) {
  root.addEventListener("focusout", (event) => {
    const left = event.target
    if (event.relatedTarget !== null || !(left instanceof HTMLElement) || !left.matches(":disabled")) return
    const current = root.querySelector<HTMLElement>("[data-part=item][aria-current=page]")
    const other = root.querySelector<HTMLElement>(
      ":is([data-part=prev-trigger],[data-part=next-trigger],[data-part=first-trigger],[data-part=last-trigger]):not(:disabled)",
    )
    const target = current?.checkVisibility() ? current : other
    target?.focus()
  })
}
