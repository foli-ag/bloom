import { TreeView as Seed } from "@foliag/seeds/tree-view"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { Mark, tick } from "../internal/icons.jsx"
import { optionIndicator } from "../internal/overlay.js"

export type TreeViewItemIndicatorProps = Omit<Seed.ItemIndicatorProps<"span">, "class" | "children" | "as"> & {
  class?: string | undefined
}

/**
 * A tick at the end of a selected item. It pops in as the item is selected and fades as it is left, and an item
 * selected from the start shows its tick still.
 */
export function TreeViewItemIndicator(props: TreeViewItemIndicatorProps): Element {
  return (
    <Seed.Item.Indicator
      as="span"
      hidden={false}
      {...omit(props, "class")}
      class={optionIndicator({ class: [indicator(), props.class] })}
    >
      <Mark class="size-6">
        <path d={tick} />
      </Mark>
    </Seed.Item.Indicator>
  )
}

// Zag hides the indicator of an item that is not selected. It stays laid out instead, so the tick can leave on a
// transition, and it is keyed on `data-selected`, which this indicator carries where a select's carries `data-state`.
const indicator = tv({
  base: [
    "not-data-selected:scale-(--pop-in-scale) not-data-selected:opacity-0",
    "not-data-selected:duration-(--duration-exit) not-data-selected:ease-smooth",
  ],
})
