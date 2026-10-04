import { Select as Seed } from "@foliag/seeds/select"
import type { Element } from "solid-js"

export type SelectItemContextProps = Seed.ItemContextProps

/** Seeds' own: renders its children with the state of the item around it */
export function SelectItemContext(props: SelectItemContextProps): Element {
  return <Seed.Item.Context {...props} />
}
