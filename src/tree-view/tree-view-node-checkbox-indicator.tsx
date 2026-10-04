import { TreeView as Seed } from "@foliag/seeds/tree-view"
import type { Element } from "solid-js"
import { Mark, tick } from "../internal/icons.jsx"

/** The tick of a checked node, or the dash of a branch with some of its nodes checked, popping in as it changes */
export function TreeViewNodeCheckboxIndicator(): Element {
  return (
    <Seed.Node.Checkbox.Indicator
      indeterminate={
        <Mark stroke-width={3.5} class="size-5 animate-pop-in">
          <path d="M6 12h12" />
        </Mark>
      }
    >
      <Mark stroke-width={3.5} class="size-5 animate-pop-in">
        <path d={tick} />
      </Mark>
    </Seed.Node.Checkbox.Indicator>
  )
}
