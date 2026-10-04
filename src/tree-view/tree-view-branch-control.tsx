import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { row } from "../internal/tree-view.js"

export type TreeViewBranchControlProps = Omit<Seed.BranchControlProps, "class"> & {
  class?: string | undefined
}

/** The branch's row, holding its `Branch.Indicator` and `Branch.Text`. A tap opens or closes it. */
export function TreeViewBranchControl(props: TreeViewBranchControlProps): Element {
  return <Seed.Branch.Control {...omit(props, "class")} class={row({ class: props.class })} />
}
