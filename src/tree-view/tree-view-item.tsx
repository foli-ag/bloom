import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { row } from "../internal/tree-view.js"

export type TreeViewItemProps = Omit<Seed.ItemProps, "class"> & {
  class?: string | undefined
}

/** A node with no children, a row holding its `Item.Text` and `Item.Indicator`. A tap selects it. */
export function TreeViewItem(props: TreeViewItemProps): Element {
  return <Seed.Item {...omit(props, "class")} class={row({ class: props.class })} />
}
