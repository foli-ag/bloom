import { TreeView as Seed, type TreeNode } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { translations } from "./use-tree-view.js"

export type TreeViewRootProps<T extends TreeNode = TreeNode> = Omit<
  Seed.RootProps<T>,
  "as" | "class" | "translations"
> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * Nested things that open and close, such as a farm's blocks and the fields in each. A tap on a branch opens it, a tap
 * on an item selects it. From the keyboard the up and down arrows move, the right arrow opens a branch and goes into
 * it, the left one comes back out and closes it. Its nodes come from `createTreeCollection`.
 *
 * Each row is 48px tall and steps in by 24px at each level, so keep trees shallow on a phone: three levels fit.
 *
 * @example
 * <TreeView.Root collection={farm}>
 *   <TreeView.Label>Parcelles</TreeView.Label>
 *   <TreeView.Tree>
 *     <For each={farm.rootNode.children}>{(node, index) => <Node node={node} indexPath={[index()]} />}</For>
 *   </TreeView.Tree>
 * </TreeView.Root>
 *
 * // A branch, or an item when the node has no children
 * <TreeView.Node.Provider node={node} indexPath={indexPath}>
 *   <TreeView.Branch>
 *     <TreeView.Branch.Control>
 *       <TreeView.Branch.Indicator />
 *       <TreeView.Branch.Text>{node.label}</TreeView.Branch.Text>
 *     </TreeView.Branch.Control>
 *     <TreeView.Branch.Content>
 *       <TreeView.Branch.IndentGuide />
 *       …the children
 *     </TreeView.Branch.Content>
 *   </TreeView.Branch>
 * </TreeView.Node.Provider>
 */
export function TreeViewRoot<T extends TreeNode = TreeNode>(props: TreeViewRootProps<T>): Element {
  return (
    <Seed.Root<T>
      {...(omit(props, "class") as Seed.RootProps<T>)}
      translations={translations}
      class={root({ class: props.class })}
    />
  )
}

export const root = tv({ base: "grid gap-2 text-ink" })
