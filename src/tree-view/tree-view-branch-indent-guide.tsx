import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type TreeViewBranchIndentGuideProps = Omit<Seed.BranchIndentGuideProps, "class" | "children"> & {
  class?: string | undefined
}

/** A line down the branch's children, under its chevron, that ties them to it. It is decoration. */
export function TreeViewBranchIndentGuide(props: TreeViewBranchIndentGuideProps): Element {
  return <Seed.Branch.IndentGuide {...omit(props, "class")} class={guide({ class: props.class })} />
}

// Under the center of the branch's 20px chevron: its row's start padding plus 10px. It runs under the rows, so a
// selected or hovered row is one whole tint, at every level.
const guide = tv({
  base: "pointer-events-none absolute inset-y-0 -z-10 start-[calc((var(--depth,1)-1)*1.5rem+1.375rem-1px)] w-0.5 bg-border",
})
