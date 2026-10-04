// A node is a branch or an item, so `Node` groups the parts that work inside both, as seeds does
import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { TreeViewNodeCheckbox } from "./tree-view-node-checkbox.jsx"
import { TreeViewNodeCheckboxIndicator } from "./tree-view-node-checkbox-indicator.jsx"

export { TreeViewNodeRenameInput as RenameInput } from "./tree-view-node-rename-input.jsx"

export const Checkbox = /* @__PURE__ */ Object.assign(TreeViewNodeCheckbox, {
  Indicator: TreeViewNodeCheckboxIndicator,
})

// Seeds' own, with no element or look
export const Context: typeof Seed.Node.Context = Seed.Node.Context
export const Provider: typeof Seed.Node.Provider = Seed.Node.Provider
