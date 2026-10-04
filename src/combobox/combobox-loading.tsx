import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { ListLoading } from "../internal/list-loading.jsx"

export interface ComboboxLoadingProps {
  /** What a screen reader says while the options load, such as "Recherche des communes…" */
  children: JSX.Element
  /** How many skeleton rows stand in for the options: 3 by default */
  rows?: number | undefined
  class?: string | undefined
}

/**
 * Rows of skeleton bars where the options will be, shown while the `Root` is `loading`, in the `Positioner` after the
 * `Content`. A part seeds does not have: its words, which a screen reader says as the search starts, are the app's,
 * and a listbox may hold only options.
 */
export function ComboboxLoading(props: ComboboxLoadingProps): Element {
  return (
    <ListLoading scope="combobox" rows={props.rows} class={props.class}>
      {props.children}
    </ListLoading>
  )
}
