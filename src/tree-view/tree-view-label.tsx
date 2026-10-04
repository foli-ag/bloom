import { TreeView as Seed } from "@foliag/seeds/tree-view"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { fieldLabel } from "../internal/field.js"

export type TreeViewLabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What the tree holds, such as "Parcelles". It is the tree's accessible name, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function TreeViewLabel(props: TreeViewLabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={fieldLabel({ class: props.class })} />
}
