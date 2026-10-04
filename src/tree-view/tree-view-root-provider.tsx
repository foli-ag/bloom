import { TreeView as Seed, type TreeNode } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { root } from "./tree-view-root.jsx"

export type TreeViewRootProviderProps<T extends TreeNode = TreeNode> = Omit<Seed.RootProviderProps<T>, "class"> & {
  class?: string | undefined
}

/** A root for a tree made with bloom's `useTreeView`, whose state the app then reads and sets from outside it */
export function TreeViewRootProvider<T extends TreeNode = TreeNode>(props: TreeViewRootProviderProps<T>): Element {
  return (
    <Seed.RootProvider<T>
      {...(omit(props, "class") as Seed.RootProviderProps<T>)}
      class={root({ class: props.class })}
    />
  )
}
