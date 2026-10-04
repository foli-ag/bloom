import { Combobox as Seed } from "@foliag/seeds/combobox"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { groupLabel } from "../internal/overlay.js"

export type ComboboxGroupLabelProps = Omit<Seed.GroupLabelProps, "class" | "children"> & {
  /** The heading of the group */
  children: JSX.Element
  class?: string | undefined
}

export function ComboboxGroupLabel(props: ComboboxGroupLabelProps): Element {
  return <Seed.Group.Label {...omit(props, "class")} class={groupLabel({ class: props.class })} />
}
