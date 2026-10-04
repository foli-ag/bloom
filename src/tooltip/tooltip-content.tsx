import { Tooltip as Seed } from "@foliag/seeds/tooltip"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { floatingPanel } from "../internal/overlay.js"

export type TooltipContentProps = Omit<Seed.ContentProps, "class" | "children"> & {
  /** The words, and an `Arrow` if it points at its trigger. They are the trigger's description, so they are required. */
  children: JSX.Element
  class?: string | undefined
}

/**
 * The words, light on dark ink so they stand apart from the page, at most 20rem wide. They fade in as they come out of
 * the trigger's side, and fade out where they are.
 */
export function TooltipContent(props: TooltipContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={content({ class: props.class })} />
}

const content = tv({
  base: [
    "max-w-[min(20rem,var(--available-width,20rem))] rounded-box bg-ink px-3 py-2",
    "text-sm font-semibold tracking-body text-surface",
    "[--arrow-background:var(--color-ink)] [--arrow-size:0.75rem]",
    floatingPanel,
    // Swapped for the next one, as the positioner explains: no fade, and the one leaving goes at once, with no hold
    "data-instant:transition-none data-[state=closed]:data-instant:animate-none",
  ],
})
