import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { fieldBox } from "../internal/field.js"

export type TreeViewNodeRenameInputProps = Omit<Seed.NodeRenameInputProps, "class" | "aria-label"> & {
  /** What is being renamed, such as "Nouveau nom de la parcelle". Zag's English name is emptied, so it is required. */
  "aria-label": string
  class?: string | undefined
}

/** The field that takes a node's place while it is renamed, for a tree with `canRename`. Enter keeps the name. */
export function TreeViewNodeRenameInput(props: TreeViewNodeRenameInputProps): Element {
  return <Seed.Node.RenameInput {...omit(props, "class")} class={fieldBox({ class: [input(), props.class] })} />
}

const input = tv({ base: "min-w-0 flex-1 px-3 py-1" })
