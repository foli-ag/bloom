import { Select as Seed } from "@foliag/seeds/select"
import type { Element } from "solid-js"

export type SelectGroupProps = Seed.GroupProps

/** Items under a `Group.Label`. It has no look of its own. */
export function SelectGroup(props: SelectGroupProps): Element {
  return <Seed.Group {...props} />
}
