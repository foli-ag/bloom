import { Select as Seed } from "@foliag/seeds/select"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { groupLabel } from "../internal/overlay.js"

export type SelectGroupLabelProps = Omit<Seed.GroupLabelProps, "class" | "children"> & {
  /** The heading of the group, such as "Céréales" */
  children: JSX.Element
  class?: string | undefined
}

export function SelectGroupLabel(props: SelectGroupLabelProps): Element {
  return <Seed.Group.Label {...omit(props, "class")} class={groupLabel({ class: props.class })} />
}
