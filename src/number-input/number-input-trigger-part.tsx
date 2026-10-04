import type { JSX } from "@solidjs/web"
import { tv } from "../internal/variants.js"
import { Mark } from "../internal/icons.jsx"

/**
 * One end of a stepper, a 48px square on a soft ground with a mark drawn by bloom. Its words name it for a screen
 * reader. It shrinks a little under the finger and its edge darkens with the press. At the bound it steps no further:
 * its ground goes and its mark greys, and it takes no press.
 *
 * Zag keeps it out of the tab order, as the arrow keys step the value, and focuses it itself when a finger presses it,
 * which closes a phone's keyboard: it shows no ring.
 */
export const stepperTrigger = tv({
  base: [
    "relative grid size-12 shrink-0 place-items-center rounded-control border-2 border-transparent bg-neutral-soft",
    "pressable motion-press text-ink outline-none [--press-scale:var(--press-scale-small)]",
    "hover:border-strong pressing:border-ink",
    "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-disabled-ink disabled:hover:border-transparent",
  ],
})

/** The mark and, read by a screen reader only, the words */
export function StepperTriggerContent(props: { mark: "minus" | "plus"; children: JSX.Element }) {
  return (
    <>
      <Mark class="size-6">
        <path d="M5 12h14" />
        {props.mark === "plus" ? <path d="M12 5v14" /> : null}
      </Mark>
      <span class="sr-only">{props.children}</span>
    </>
  )
}
