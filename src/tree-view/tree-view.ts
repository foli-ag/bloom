import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { TreeViewBranch } from "./tree-view-branch.jsx"
import { TreeViewBranchContent } from "./tree-view-branch-content.jsx"
import { TreeViewBranchControl } from "./tree-view-branch-control.jsx"
import { TreeViewBranchIndentGuide } from "./tree-view-branch-indent-guide.jsx"
import { TreeViewBranchIndicator } from "./tree-view-branch-indicator.jsx"
import { TreeViewBranchText } from "./tree-view-branch-text.jsx"
import { TreeViewBranchTrigger } from "./tree-view-branch-trigger.jsx"
import { TreeViewItem } from "./tree-view-item.jsx"
import { TreeViewItemIndicator } from "./tree-view-item-indicator.jsx"
import { TreeViewItemText } from "./tree-view-item-text.jsx"

export type { TreeViewBranchProps as BranchProps } from "./tree-view-branch.jsx"
export type { TreeViewBranchContentProps as BranchContentProps } from "./tree-view-branch-content.jsx"
export type { TreeViewBranchControlProps as BranchControlProps } from "./tree-view-branch-control.jsx"
export type { TreeViewBranchIndentGuideProps as BranchIndentGuideProps } from "./tree-view-branch-indent-guide.jsx"
export type { TreeViewBranchIndicatorProps as BranchIndicatorProps } from "./tree-view-branch-indicator.jsx"
export type { TreeViewBranchTextProps as BranchTextProps } from "./tree-view-branch-text.jsx"
export type { TreeViewBranchTriggerProps as BranchTriggerProps } from "./tree-view-branch-trigger.jsx"
export type { TreeViewItemProps as ItemProps } from "./tree-view-item.jsx"
export type { TreeViewItemIndicatorProps as ItemIndicatorProps } from "./tree-view-item-indicator.jsx"
export type { TreeViewItemTextProps as ItemTextProps } from "./tree-view-item-text.jsx"
export { TreeViewLabel as Label, type TreeViewLabelProps as LabelProps } from "./tree-view-label.jsx"
export type { TreeViewNodeCheckboxProps as NodeCheckboxProps } from "./tree-view-node-checkbox.jsx"
export type { TreeViewNodeRenameInputProps as NodeRenameInputProps } from "./tree-view-node-rename-input.jsx"
export { TreeViewRoot as Root, type TreeViewRootProps as RootProps } from "./tree-view-root.jsx"
export { TreeViewTree as Tree, type TreeViewTreeProps as TreeProps } from "./tree-view-tree.jsx"
export type ContextProps = Seed.ContextProps
export type NodeContextProps = Seed.NodeContextProps
export type NodeProviderProps = Seed.NodeProviderProps
export type CheckedChangeDetails = Seed.CheckedChangeDetails
export type CheckedState = Seed.CheckedState
export type ExpandedChangeDetails = Seed.ExpandedChangeDetails
export type FocusChangeDetails = Seed.FocusChangeDetails
export type LoadChildrenCompleteDetails = Seed.LoadChildrenCompleteDetails
export type LoadChildrenDetails = Seed.LoadChildrenDetails
export type LoadChildrenErrorDetails = Seed.LoadChildrenErrorDetails
export type NodeProps = Seed.NodeProps
export type NodeState = Seed.NodeState
export type RenameCompleteDetails = Seed.RenameCompleteDetails
export type RenameStartDetails = Seed.RenameStartDetails
export type SelectionChangeDetails = Seed.SelectionChangeDetails

export const Branch = /* @__PURE__ */ Object.assign(TreeViewBranch, {
  Control: TreeViewBranchControl,
  Indicator: TreeViewBranchIndicator,
  Text: TreeViewBranchText,
  Trigger: TreeViewBranchTrigger,
  Content: TreeViewBranchContent,
  IndentGuide: TreeViewBranchIndentGuide,
})

export const Item = /* @__PURE__ */ Object.assign(TreeViewItem, {
  Text: TreeViewItemText,
  Indicator: TreeViewItemIndicator,
})

export * as Node from "./tree-view-node.js"

export {
  TreeViewRootProvider as RootProvider,
  type TreeViewRootProviderProps as RootProviderProps,
} from "./tree-view-root-provider.jsx"

// Seeds' own, with no look
export const Context: typeof Seed.Context = Seed.Context
