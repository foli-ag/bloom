import { HoverCard as Seed } from "@foliag/seeds/hover-card"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { floatingPanel } from "../internal/overlay.js"

export type HoverCardContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The card, at most 24rem wide, with the edge and shadow of a panel. Its parts stack with even gaps. It comes out of
 * the link's side as a floating panel does.
 */
export function HoverCardContent(props: HoverCardContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={content({ class: props.class })} />
}

const content = tv({
  base: [
    "flex w-max max-w-[min(24rem,var(--available-width,24rem))] flex-col gap-2 rounded-card border-2 border-strong",
    "bg-raised p-4 text-ink shadow-overlay",
    "[--arrow-background:var(--color-raised)] [--arrow-size:0.875rem]",
    "origin-(--transform-origin)",
    floatingPanel,
  ],
})
