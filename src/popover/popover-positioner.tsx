import { Popover as Seed, usePopoverContext } from "@foliag/seeds/popover"
import { Portal } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { sheetPositioner } from "../internal/overlay.js"

export type PopoverPositionerProps = Omit<Seed.PositionerProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * Places the content under its trigger from 640px. On a phone it is the dim over the whole screen, holding the
 * content at the bottom, and a tap on it closes the popover. It is drawn at the end of `<body>`.
 */
export function PopoverPositioner(props: PopoverPositionerProps): Element {
  const api = usePopoverContext()
  return (
    <Portal>
      <Seed.Positioner
        {...omit(props, "class")}
        // Hidden with the content once it has closed, or the dim would stay over the page on a phone
        class={sheetPositioner({ class: ["has-[>[hidden]]:hidden", props.class] })}
        data-state={api().open ? "open" : "closed"}
      />
    </Portal>
  )
}
