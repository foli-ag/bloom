import { Select as Seed } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { useListLoading } from "../internal/list-loading.jsx"
import { panelList } from "../internal/overlay.js"

export type SelectContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The list of items, which scrolls inside the panel. The arrow keys move through it, Enter or a tap chooses. While the
 * options load it is marked busy and gives its place to the `Loading` rows.
 */
export function SelectContent(props: SelectContentProps): Element {
  const loading = useListLoading()
  return (
    <Seed.Content
      {...omit(props, "class")}
      aria-busy={loading() ? "true" : undefined}
      class={panelList({ class: props.class })}
    />
  )
}
