import { Combobox as Seed, useComboboxContext } from "@foliag/seeds/combobox"
import { Portal, type JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { dropdownPanel, floatingPositioner } from "../internal/overlay.js"

export type ComboboxPositionerProps = Omit<Seed.PositionerProps, "class" | "children"> & {
  /** The `Content`, then a `Loading` and an `Empty` */
  children: JSX.Element
  class?: string | undefined
}

/**
 * The panel under the field, at least as wide as it, and only as tall as the room below it. Where there is no room
 * below, it opens above the field, and stays there while the list narrows. It is drawn at the end of `<body>`.
 */
export function ComboboxPositioner(props: ComboboxPositionerProps): Element {
  const api = useComboboxContext()
  return (
    <Portal>
      <Seed.Positioner
        {...omit(props, "class", "children")}
        class={floatingPositioner({ holds: "list", class: positioner() })}
      >
        <div class={dropdownPanel({ class: props.class })} data-state={api().open ? "open" : "closed"}>
          {props.children}
        </div>
      </Seed.Positioner>
    </Portal>
  )
}

// The positioner keeps the height of the longest list there is room for, and the panel sits at the field's end of
// it. As typing narrows the list, the panel shrinks towards the field while the positioner holds its size, so zag
// never moves it, or flips it to the other side of the field, in the middle of a word.
const positioner = tv({
  base: "flex h-[min(20rem,var(--available-height,20rem))] flex-col has-[>*>[data-side=top]]:justify-end",
})
