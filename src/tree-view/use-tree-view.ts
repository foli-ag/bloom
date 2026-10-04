import {
  useTreeView as useSeedsTreeView,
  type TreeNode,
  type UseTreeViewProps,
  type UseTreeViewReturn,
} from "@foliag/seeds/tree-view"

/**
 * Zag names the tree "Tree View" and the rename field "Rename tree item" in English. Empty, the tree takes its name
 * from its `Label` and the rename field from its own `aria-label`.
 */
export const translations = { treeLabel: "", renameInputLabel: "" }

/** Seeds' `useTreeView`, for a `TreeView.RootProvider`, with zag's English labels emptied as `TreeView.Root` does */
export function useTreeView<T extends TreeNode = TreeNode>(
  props: UseTreeViewProps<T> | (() => UseTreeViewProps<T>),
): UseTreeViewReturn<T> {
  return useSeedsTreeView<T>(() => ({ ...(typeof props === "function" ? props() : props), translations }))
}
