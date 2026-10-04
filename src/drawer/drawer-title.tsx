import { Drawer as Seed } from "@foliag/seeds/drawer"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type DrawerTitleProps = Omit<Seed.TitleProps, "class" | "children"> & {
  /** What the drawer is about. It is the drawer's name for a screen reader, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function DrawerTitle(props: DrawerTitleProps): Element {
  return <Seed.Title {...omit(props, "class")} class={title({ class: props.class })} />
}

const title = tv({ base: "text-xl font-semibold tracking-heading text-ink" })
