import { HoverCard as Seed } from "@foliag/seeds/hover-card"
import { Portal } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { floatingPositioner } from "../internal/overlay.js"

export type HoverCardPositionerProps = Omit<Seed.PositionerProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * Places the card next to its trigger, and brings it out of the trigger's side. It is drawn at the end of `<body>`, so
 * nothing around it can clip it.
 */
export function HoverCardPositioner(props: HoverCardPositionerProps): Element {
  return (
    <Portal>
      <Seed.Positioner
        {...omit(props, "class")}
        class={floatingPositioner({ holds: "content", class: [positioner(), props.class] })}
      />
    </Portal>
  )
}

const positioner = tv({ base: "z-50" })
