import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { Mark, tick } from "../internal/icons.jsx"
import { optionIndicator } from "../internal/overlay.js"

export type TreeViewItemIndicatorProps = Omit<Seed.ItemIndicatorProps<"span">, "class" | "children" | "as"> & {
  class?: string | undefined
}

/** A tick at the end of a selected item, which pops in as it is selected */
export function TreeViewItemIndicator(props: TreeViewItemIndicatorProps): Element {
  return (
    <Seed.Item.Indicator as="span" {...omit(props, "class")} class={optionIndicator({ class: props.class })}>
      <Mark class="size-6 animate-pop-in">
        <path d={tick} />
      </Mark>
    </Seed.Item.Indicator>
  )
}
