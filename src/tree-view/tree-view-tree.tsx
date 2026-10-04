import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type TreeViewTreeProps = Omit<Seed.TreeProps, "class"> & {
  class?: string | undefined
}

/** Holds the top-level nodes, one under the other */
export function TreeViewTree(props: TreeViewTreeProps): Element {
  return <Seed.Tree {...omit(props, "class")} class={tree({ class: props.class })} />
}

// A layer of its own, so the guides can sit under the rows (see `Branch.IndentGuide`)
const tree = tv({ base: "isolate flex flex-col gap-0.5 outline-none" })
