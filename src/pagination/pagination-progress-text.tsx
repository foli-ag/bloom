import { usePaginationContext } from "@foliag/seeds/pagination"
import type { JSX } from "@solidjs/web"
import { createEffect, createSignal, For, untrack, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { useCompact } from "./pagination-look.js"

export interface PaginationProgressTextDetails {
  /** The page shown, from 1 */
  page: number
  totalPages: number
}

export interface PaginationProgressTextProps {
  /** Where the farmer is, in the app's words and format: ``({ page, totalPages }) => `${page} / ${totalPages}` `` */
  children: (details: PaginationProgressTextDetails) => JSX.Element
  class?: string | undefined
}

/**
 * Where the farmer is among the pages, "3 / 12", between the triggers of a compact pagination, a part seeds does not
 * have. A screen reader hears it when it changes, as the triggers do not say where they led.
 *
 * As the page changes, the old position rolls out and the new one rolls in, a few pixels the way the farmer went: up
 * for the next page, down for the one before. Both are transitions, so going back half way rolls the old one back in
 * from where it is. Under reduced motion they only cross-fade. Nothing moves as the page loads. While a pagination is
 * not compact, or from 640px when it is compact on a phone, it is hidden.
 */
export function PaginationProgressText(props: PaginationProgressTextProps): Element {
  const api = usePaginationContext()
  const compact = useCompact()
  const format = untrack(() => props.children)
  // The pages whose position is on screen: the one shown, and those still rolling out. A page the farmer comes back to
  // keeps its place in the list, as moving its node would cut its transition short.
  const [shown, setShown] = createSignal([untrack(() => api().page)])
  const [direction, setDirection] = createSignal<"next" | "previous">("next")
  const [changed, setChanged] = createSignal(false)
  createEffect(
    () => api().page,
    (page, previous) => {
      if (previous === undefined || page === previous) return
      setDirection(page > previous ? "next" : "previous")
      setChanged(true)
      setShown((pages) => (pages.includes(page) ? pages : [...pages, page]))
      // A position that left before it had started to move has no transition to end: it goes once nothing runs on it
      requestAnimationFrame(() => requestAnimationFrame(sweep))
    },
  )
  const entries = new Map<number, HTMLElement>()
  const gone = (page: number) => {
    entries.delete(page)
    setShown((pages) => pages.filter((each) => each !== page))
  }
  const sweep = () => {
    for (const [page, entry] of entries) {
      if (page !== untrack(() => api().page) && entry.getAnimations().length === 0) gone(page)
    }
  }
  return (
    <span
      data-scope="pagination"
      data-part="progress-text"
      data-direction={direction()}
      data-changed={changed() ? "" : undefined}
      aria-live="polite"
      aria-atomic="true"
      class={text({ compact: compact(), class: props.class })}
    >
      <For each={shown()}>
        {(page) => (
          <span
            data-state={page === api().page ? "open" : "closed"}
            aria-hidden={page === api().page ? undefined : "true"}
            ref={(element) => entries.set(page, element)}
            onTransitionEnd={(event) => {
              if (page !== api().page && event.currentTarget.getAnimations().length === 0) gone(page)
            }}
            class={position()}
          >
            {format({ page, totalPages: api().totalPages })}
          </span>
        )}
      </For>
    </span>
  )
}

// The positions share one cell, so the words around them never move as one becomes the other. `--roll` is how far the
// new one comes from, half the enter distance, below for the next page and above for the one before.
const text = tv({
  base: [
    "inline-grid min-w-0 place-items-center text-center text-base font-semibold tracking-body text-ink tabular-nums",
    "[--roll:calc(var(--enter-distance)*0.5)] data-[direction=previous]:[--roll:calc(var(--enter-distance)*-0.5)]",
  ],
  variants: {
    compact: { row: "hidden", always: "flex-1", phone: "max-sm:flex-1 sm:hidden" },
  },
})

// It comes in on the smooth spring, and leaves on the quicker exit clock the other way, as what it replaced went
const position = tv({
  base: [
    "col-start-1 row-start-1 transition-[opacity,translate] duration-(--duration-smooth) ease-smooth",
    "in-data-changed:starting:translate-y-(--roll) in-data-changed:starting:opacity-0",
    "data-[state=closed]:-translate-y-(--roll) data-[state=closed]:opacity-0",
    "data-[state=closed]:duration-(--duration-exit)",
  ],
})
