import { Popover as Seed } from "@foliag/seeds/popover"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type PopoverTitleProps = Omit<Seed.TitleProps, "class" | "children"> & {
  /** What the popover is about. It names the popover for a screen reader. */
  children: JSX.Element
  class?: string | undefined
}

export function PopoverTitle(props: PopoverTitleProps): Element {
  return <Seed.Title {...omit(props, "class")} class={title({ class: props.class })} />
}

const title = tv({ base: "text-lg font-semibold tracking-heading text-ink" })
