import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type TreeViewTreeProps = Omit<Seed.TreeProps, "class"> & {
  class?: string | undefined
}

/** Holds the top-level nodes, one under the other */
export function TreeViewTree(props: TreeViewTreeProps): Element {
  return <Seed.Tree {...omit(props, "class")} class={tree({ class: props.class })} />
}

const tree = tv({ base: "flex flex-col gap-0.5 outline-none" })
