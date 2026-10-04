import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type TreeViewBranchProps = Omit<Seed.BranchProps, "class"> & {
  class?: string | undefined
}

/** A node with children: its `Branch.Control` row, and its `Branch.Content` under it while open */
export function TreeViewBranch(props: TreeViewBranchProps): Element {
  return <Seed.Branch {...omit(props, "class")} class={branch({ class: props.class })} />
}

const branch = tv({ base: "flex flex-col gap-0.5 outline-none" })
