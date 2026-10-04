import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { indicatorChevron } from "../internal/disclosure.js"
import { Chevron, Mark } from "../internal/icons.jsx"

export type TreeViewBranchIndicatorProps = Omit<Seed.BranchIndicatorProps<"span">, "class" | "children" | "as"> & {
  class?: string | undefined
}

/**
 * A chevron before the words, pointing along the line while closed and turning down as the branch opens. While the
 * children of a tree with `loadChildren` are on their way, a ring turns in its place, so a slow connection does not
 * look like a tap that missed.
 */
export function TreeViewBranchIndicator(props: TreeViewBranchIndicatorProps): Element {
  return (
    <Seed.Branch.Indicator
      as="span"
      {...omit(props, "class")}
      class={indicatorChevron({
        class: [
          "group/indicator -rotate-90 rtl:rotate-90 data-[state=open]:rotate-0 rtl:data-[state=open]:rotate-0",
          props.class,
        ],
      })}
    >
      <Chevron class="size-5 group-data-loading/indicator:hidden" />
      <Mark class={ring()}>
        <circle cx="12" cy="12" r="9" class="opacity-25" />
        <path d="M12 3a9 9 0 0 1 9 9" />
      </Mark>
    </Seed.Branch.Indicator>
  )
}

// Bloom's spinner, a line of text tall. It keeps turning under reduced motion, as it is what says something is coming.
const ring = tv({ base: "hidden size-5 animate-spin-ring group-data-loading/indicator:block" })
