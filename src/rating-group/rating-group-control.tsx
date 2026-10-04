import { RatingGroup as Seed, useRatingGroupContext } from "@foliag/seeds/rating-group"
import type { JSX } from "@solidjs/web"
import { For, omit, Show, untrack, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { forwardRef, notePointer } from "../internal/pointer.js"
import { RatingGroupItem } from "./rating-group-item.jsx"

export type RatingGroupControlProps = Omit<Seed.ControlProps, "class"> & {
  /** An `Item` for each mark. With none, it holds one star for each of the root's `count`. */
  children?: JSX.Element
  class?: string | undefined
}

/** The row of stars, side by side without gaps so a finger sliding along them never falls between two */
export function RatingGroupControl(props: RatingGroupControlProps): Element {
  const api = useRatingGroupContext()
  const rest = omit(props, "class", "children")
  return (
    <Seed.Control
      {...rest}
      class={control({ class: props.class })}
      ref={(element: HTMLElement) => {
        notePointer(element)
        forwardRef(
          untrack(() => rest.ref),
          element,
        )
      }}
    >
      <Show
        when={props.children}
        fallback={<For each={api().items}>{(index) => <RatingGroupItem index={index} />}</For>}
      >
        {props.children}
      </Show>
    </Seed.Control>
  )
}

// Zag focuses the star that takes the mark itself, after a tap too, and the browser then rings it as it would for the
// keyboard. The stars draw their ring only after a key: the control turns `--focus-style` to none after a press.
const control = tv({
  base: "flex w-fit data-pointer:[--focus-style:none] data-disabled:cursor-not-allowed",
})
