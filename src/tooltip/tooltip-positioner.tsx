import { Tooltip as Seed } from "@foliag/seeds/tooltip"
import { Portal } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { floatingPositioner } from "../internal/overlay.js"

export type TooltipPositionerProps = Omit<Seed.PositionerProps, "class"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * Places the tooltip next to its trigger, and brings it out of the trigger's side. It is drawn at the end of `<body>`,
 * so nothing around it can clip it.
 */
export function TooltipPositioner(props: TooltipPositionerProps): Element {
  return (
    <Portal>
      <Seed.Positioner
        {...omit(props, "class")}
        class={floatingPositioner({ holds: "content", class: [positioner(), props.class] })}
      />
    </Portal>
  )
}

/**
 * Quicker and quieter than a panel, as a few words should not draw the eye away from what they describe: in and out
 * on the exit's quick spring, from a third of the enter distance, without growing. The content inside takes the same
 * timing. Moving from one trigger to the next while a tooltip shows swaps the words at once, as the eye is already
 * there, so zag's `data-instant` takes the drift's distance to 0. It does not stop the drift: that would start it again
 * as the tooltip closes, and zag takes `data-instant` off, and the tooltip would jump as it fades.
 */
const positioner = tv({
  base: [
    "z-50 [--drift:calc(var(--enter-distance)/3)] [--overlay-scale:1] [--presence-duration:var(--duration-exit)]",
    "has-[>[data-instant]]:[--drift:0px]",
  ],
})
