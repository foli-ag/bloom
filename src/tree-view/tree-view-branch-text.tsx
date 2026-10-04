import { TreeView as Seed } from "@foliag/seeds/tree-view"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { rowText } from "../internal/tree-view.js"

export type TreeViewBranchTextProps = Omit<Seed.BranchTextProps, "class" | "children"> & {
  /** The branch's words. They are its accessible name, so they are required. */
  children: JSX.Element
  class?: string | undefined
}

export function TreeViewBranchText(props: TreeViewBranchTextProps): Element {
  return <Seed.Branch.Text {...omit(props, "class")} class={rowText({ class: props.class })} />
}
