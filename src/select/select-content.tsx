import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { panelList } from "../internal/overlay.js"

export type SelectContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/** The list of items, which scrolls inside the panel. The arrow keys move through it, Enter or a tap chooses. */
export function SelectContent(props: SelectContentProps): Element {
  return <Seed.Content {...omit(props, "class")} class={panelList({ class: props.class })} />
}
