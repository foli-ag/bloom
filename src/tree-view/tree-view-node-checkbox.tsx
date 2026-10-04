import { TreeView as Seed } from "@foliag/seeds/tree-view"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type TreeViewNodeCheckboxProps = Omit<Seed.NodeCheckboxProps<"span">, "class" | "as" | "aria-label"> & {
  /** The node's words again, such as "Les Grands Champs". A box takes no name from the row, so it is required. */
  "aria-label": string
  /** A `Node.Checkbox.Indicator` */
  children?: JSX.Element
  class?: string | undefined
}

/**
 * A box at the start of a row, for a tree with `checkedValue`: checking a branch checks all it holds, and a branch
 * with some of its nodes checked shows a dash. A tap on it checks without selecting or opening the row.
 */
export function TreeViewNodeCheckbox(props: TreeViewNodeCheckboxProps): Element {
  return <Seed.Node.Checkbox as="span" {...omit(props, "class")} class={box({ class: props.class })} />
}

const box = tv({
  base: [
    "grid size-7 shrink-0 place-items-center rounded-box border-2 border-strong bg-raised text-on-primary",
    "motion-touch hover:border-ink active:scale-(--press-scale-small)",
    "data-[state=checked]:border-primary-edge data-[state=checked]:bg-primary",
    "data-[state=indeterminate]:border-primary-edge data-[state=indeterminate]:bg-primary",
    "data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled-ink",
  ],
})
