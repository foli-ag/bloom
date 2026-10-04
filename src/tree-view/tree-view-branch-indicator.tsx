import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { indicatorChevron } from "../internal/disclosure.js"
import { Chevron } from "../internal/icons.jsx"

export type TreeViewBranchIndicatorProps = Omit<Seed.BranchIndicatorProps<"span">, "class" | "children" | "as"> & {
  class?: string | undefined
}

/** A chevron before the words, pointing along the line while closed and turning down as the branch opens */
export function TreeViewBranchIndicator(props: TreeViewBranchIndicatorProps): Element {
  return (
    <Seed.Branch.Indicator
      as="span"
      {...omit(props, "class")}
      class={indicatorChevron({
        class: ["-rotate-90 rtl:rotate-90 data-[state=open]:rotate-0 rtl:data-[state=open]:rotate-0", props.class],
      })}
    >
      <Chevron class="size-5" />
    </Seed.Branch.Indicator>
  )
}
