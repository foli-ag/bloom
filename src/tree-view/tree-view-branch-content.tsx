import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
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
    <Seed.Branch.Content {...omit(props, "class", "children")} class={disclosureContent({ class: props.class })}>
      {/* What folds, which clips while it moves, around the rows */}
      <div>
        <div class={rows()}>{props.children}</div>
      </div>
    </Seed.Branch.Content>
  )
}

// The gap under the branch's own row is padding inside the fold, so it opens with the rows instead of before them
const rows = tv({ base: "relative flex flex-col gap-0.5 pt-0.5" })
