import { Tooltip as Seed } from "@foliag/seeds/tooltip"
import { Portal } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type TooltipPositionerProps = Omit<Seed.PositionerProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/** Places the tooltip next to its trigger. It is drawn at the end of `<body>`, so nothing around it can clip it. */
export function TooltipPositioner(props: TooltipPositionerProps): Element {
  return (
    <Portal>
      <Seed.Positioner {...omit(props, "class")} class={positioner({ class: props.class })} />
    </Portal>
  )
}

const positioner = tv({ base: "z-50" })
