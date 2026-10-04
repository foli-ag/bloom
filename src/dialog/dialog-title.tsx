import { Drawer as Seed } from "@foliag/seeds/drawer"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type DialogTitleProps = Omit<Seed.TitleProps, "class" | "children"> & {
  /** What the dialog is about. It is the dialog's name for a screen reader, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function DialogTitle(props: DialogTitleProps): Element {
  return <Seed.Title {...omit(props, "class")} class={title({ class: props.class })} />
}

const title = tv({ base: "text-xl font-semibold tracking-heading text-ink" })
