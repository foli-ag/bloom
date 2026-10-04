import type { JSX } from "@solidjs/web"
import type { Element } from "solid-js"
import { ListLoading } from "../internal/list-loading.jsx"

export interface SelectLoadingProps {
  /** What a screen reader says while the options load, such as "Chargement des cultures…" */
  children: JSX.Element
  /** How many skeleton rows stand in for the options: 3 by default */
  rows?: number | undefined
  class?: string | undefined
}

/**
 * Rows of skeleton bars where the options will be, shown while the `Root` is `loading`, in the `Positioner` after the
 * `Content`. A part seeds does not have, and a part rather than a look of the list, because its words, said to a screen
 * reader as the list opens on nothing yet, are the app's, and a listbox may hold only options.
 */
export function SelectLoading(props: SelectLoadingProps): Element {
  return (
    <ListLoading scope="select" rows={props.rows} class={props.class}>
      {props.children}
    </ListLoading>
  )
}
