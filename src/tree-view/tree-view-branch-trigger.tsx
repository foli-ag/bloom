import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { TreeView as Seed } from "@foliag/seeds/tree-view"
import type { Element } from "solid-js"

export type TreeViewBranchTriggerProps<As extends ValidComponent = "button"> = Seed.BranchTriggerProps<As>

/**
 * Opens or closes its branch, for a button of the app's own inside the row. Seeds' own, with no look: render it as a
 * `Button` with words. `Branch.Control` already opens the branch, so most trees do not need it.
 */
export function TreeViewBranchTrigger<As extends ValidComponent = "button">(
  props: TreeViewBranchTriggerProps<As>,
): Element {
  return <Seed.Branch.Trigger {...(props as Seed.BranchTriggerProps)} />
}
