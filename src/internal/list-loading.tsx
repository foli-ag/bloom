import type { JSX } from "@solidjs/web"
import { createContext, Repeat, Show, useContext, type Accessor, type Element } from "solid-js"
import { tv } from "tailwind-variants"

/** Whether a select's or a combobox's options are being fetched, as its `Root` was told with `loading` */
export const ListLoadingContext = /* @__PURE__ */ createContext<Accessor<boolean>>(() => false)

export const useListLoading = () => useContext(ListLoadingContext)

// Rows of different lengths, as real ones would be
const widths = [72, 48, 84, 60, 36]

/**
 * What a list shows while its options are on their way: rows of skeleton bars where the options will be, as tall as
 * they are, so the panel is the right size from the start. They are hidden from assistive technology; the app's words
 * go into a status, which a screen reader says, and which is there from the start so that it is heard as it fills.
 */
export function ListLoading(props: {
  scope: string
  rows?: number | undefined
  children: JSX.Element
  class?: string | undefined
}): Element {
  const loading = useListLoading()
  return (
    <div data-scope={props.scope} data-part="loading" class={root({ class: props.class })}>
      <div role="status" class="sr-only">
        <Show when={loading()}>{props.children}</Show>
      </div>
      <Show when={loading()}>
        <div aria-hidden="true" class="grid p-2">
          <Repeat count={props.rows ?? 3}>
            {(index) => (
              <div class="flex min-h-12 items-center px-3 text-base">
                <span class="skeleton h-[0.75em] rounded-full" style={{ width: `${widths[index % widths.length]}%` }} />
              </div>
            )}
          </Repeat>
        </div>
      </Show>
    </div>
  )
}

const root = tv({ base: "shrink-0" })
