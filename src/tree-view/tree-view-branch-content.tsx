import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { disclosureContent } from "../internal/disclosure.js"

export type TreeViewBranchContentProps = Omit<Seed.BranchContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The children of the branch. It grows to its height as the branch opens and folds back as it closes, a fade under
 * reduced motion, and they leave once it has closed.
 */
export function TreeViewBranchContent(props: TreeViewBranchContentProps): Element {
  return (
    <Seed.Branch.Content
      {...omit(props, "class")}
      class={disclosureContent({ class: ["relative flex flex-col gap-0.5", props.class] })}
    />
  )
}
