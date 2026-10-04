import { useComboboxContext } from "@foliag/seeds/combobox"
import type { JSX } from "@solidjs/web"
import { Show, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { useListLoading } from "../internal/list-loading.jsx"

export interface ComboboxEmptyProps {
  /** What to say when nothing matches, such as "Aucune commune trouvée" */
  children: JSX.Element
  class?: string | undefined
}

/**
 * Shown in place of the rows while nothing matches what was typed, and not while the options load, when nothing is
 * known yet. Bloom's own, outside the list, which may hold only options: it is a status, so a screen reader says it as
 * it appears, while focus stays in the field.
 */
export function ComboboxEmpty(props: ComboboxEmptyProps): Element {
  const api = useComboboxContext()
  const loading = useListLoading()
  return (
    <div role="status" data-scope="combobox" data-part="empty">
      <Show when={api().collection.size === 0 && !loading()}>
        <p class={empty({ class: props.class })}>{props.children}</p>
      </Show>
    </div>
  )
}

// It fades in, so the change reads as an answer and not as a flicker of the panel
const empty = tv({
  base: "px-5 py-4 text-base text-muted transition-opacity duration-(--duration-exit) ease-smooth starting:opacity-0",
})
