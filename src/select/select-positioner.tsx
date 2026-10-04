import { Select as Seed, useSelectContext } from "@foliag/seeds/select"
import { Portal, type JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { sheetPanel, sheetPositioner } from "../internal/overlay.js"

export type SelectPositionerProps = Omit<Seed.PositionerProps, "class" | "children"> & {
  /** The `Content`, and a `Trigger.Close` after it */
  children: JSX.Element
  class?: string | undefined
}

/**
 * Places the list under the field from 640px, in a panel at least as wide as the field. On a phone it is the dim over
 * the whole screen, holding the panel at the bottom as a sheet, and a tap on the dim closes it. It is drawn at the end
 * of `<body>`, so nothing the select sits in can clip it.
 */
export function SelectPositioner(props: SelectPositionerProps): Element {
  const api = useSelectContext()
  const state = () => (api().open ? "open" : "closed")
  return (
    <Portal>
      <Seed.Positioner
        {...omit(props, "class", "children")}
        class={sheetPositioner({ holds: "list", class: props.class })}
        data-state={state()}
      >
        <div class={sheetPanel({ scroll: "list" })} data-state={state()}>
          {props.children}
        </div>
      </Seed.Positioner>
    </Portal>
  )
}
