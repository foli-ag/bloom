import { useComboboxContext } from "@foliag/seeds/combobox"
import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { ChipGroup } from "../internal/chips.jsx"

export interface ComboboxChipGroupProps<T = any> {
  /** A `Chip` for a chosen item, in the order they were chosen */
  children: (item: T) => JSX.Element
}

/**
 * The choices of a `multiple` combobox as chips, first in its `Control`, before the `Input`. A part seeds does not
 * have. Choices stay as chips while typing narrows the list. A chip taken out shrinks away, and the chips after it and
 * the input slide back into its room; one chosen again on its way out turns round. A new one pops in at the end.
 */
export function ComboboxChipGroup<T = any>(props: ComboboxChipGroupProps<T>): Element {
  const api = useComboboxContext()
  return (
    <ChipGroup
      scope="combobox"
      items={api().selectedItems as T[]}
      valueOf={(item) => api().collection.getItemValue(item) ?? ""}
    >
      {props.children}
    </ChipGroup>
  )
}
