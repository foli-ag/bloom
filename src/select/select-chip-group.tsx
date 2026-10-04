import { useSelectContext } from "@foliag/seeds/select"
import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { ChipGroup } from "../internal/chips.jsx"

export interface SelectChipGroupProps<T = any> {
  /** A `Chip` for a chosen item, in the order they were chosen */
  children: (item: T) => JSX.Element
}

/**
 * The choices of a `multiple` select as chips, first in its `Control`. A part seeds does not have. A chip taken out,
 * from its cross or in the list, shrinks away, and the chips after it slide back into its room; one chosen again on its
 * way out turns round. A new one pops in at the end.
 */
export function SelectChipGroup<T = any>(props: SelectChipGroupProps<T>): Element {
  const api = useSelectContext()
  return (
    <ChipGroup
      scope="select"
      items={api().selectedItems as T[]}
      valueOf={(item) => api().collection.getItemValue(item) ?? ""}
    >
      {props.children}
    </ChipGroup>
  )
}
