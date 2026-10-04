import { Combobox as Seed } from "@foliag/seeds/combobox"
import { omit, type Element } from "solid-js"
import { useListLoading } from "../internal/list-loading.jsx"
import { panelList } from "../internal/overlay.js"

export type ComboboxContentProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/**
 * The rows, which scroll inside the panel. It is hidden while nothing matches, and marked busy while the options load,
 * when it gives its place to the `Loading` rows.
 */
export function ComboboxContent(props: ComboboxContentProps): Element {
  const loading = useListLoading()
  return (
    <Seed.Content
      {...omit(props, "class")}
      aria-busy={loading() ? "true" : undefined}
      class={panelList({ class: props.class })}
    />
  )
}
