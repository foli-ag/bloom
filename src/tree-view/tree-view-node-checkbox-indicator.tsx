import { TreeView as Seed } from "@foliag/seeds/tree-view"
import type { Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { Mark, tick } from "../internal/icons.jsx"

/**
 * The tick of a checked node, or the dash of a branch with some of its nodes checked. It is drawn in as the box fills,
 * as a `Checkbox`'s is.
 */
export function TreeViewNodeCheckboxIndicator(): Element {
  return (
    <Seed.Node.Checkbox.Indicator
      indeterminate={
        <Mark stroke-width={3.5} class="size-5">
          <path d="M6 12h12" pathLength="1" class={drawn()} />
        </Mark>
      }
    >
      <Mark stroke-width={3.5} class="size-5">
        <path d={tick} pathLength="1" class={drawn()} />
      </Mark>
    </Seed.Node.Checkbox.Indicator>
  )
}

// Seeds mounts the mark as the state changes, so it starts undrawn on its first frame and draws along its path: a
// repaint of a 20px glyph and no layout
const drawn = tv({
  base: [
    "[stroke-dasharray:1] [stroke-dashoffset:0] starting:[stroke-dashoffset:1]",
    "transition-[stroke-dashoffset] duration-(--duration-smooth) ease-smooth",
  ],
})
