import { Clipboard as Seed } from "@foliag/seeds/clipboard"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type ClipboardLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What the value is. It names the field, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function ClipboardLabel(props: ClipboardLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}
