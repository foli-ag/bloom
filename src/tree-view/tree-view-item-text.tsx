import { TreeView as Seed } from "@foliag/seeds/tree-view"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { rowText } from "../internal/tree-view.js"

export type TreeViewItemTextProps = Omit<Seed.ItemTextProps, "class" | "children"> & {
  /** The item's words. They are its accessible name, so they are required. */
  children: JSX.Element
  class?: string | undefined
}

export function TreeViewItemText(props: TreeViewItemTextProps): Element {
  return <Seed.Item.Text {...omit(props, "class")} class={rowText({ class: props.class })} />
}
