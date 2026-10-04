import { Clipboard as Seed, useClipboardContext } from "@foliag/seeds/clipboard"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { Mark, tick } from "../internal/icons.jsx"

export type ClipboardIndicatorProps = Omit<Seed.IndicatorProps<"span">, "class" | "children" | "copied" | "as"> & {
  /** The trigger's words, such as "Copier". They are its name, so they are required. */
  children: JSX.Element
  /** The words that replace them for a moment after a copy, such as "Copié" */
  copied: JSX.Element
  class?: string | undefined
}

/**
 * The trigger's words, after two sheets laid one on the other. For a moment after a copy the words become `copied` and
 * the sheets give way to a tick, drawn in as they fade. Both fade back once the moment is over.
 *
 * Both sets of words are laid out in the same place, as are the sheets and the tick, so the trigger keeps the width of
 * the longer words and the value beside it never moves.
 */
export function ClipboardIndicator(props: ClipboardIndicatorProps): Element {
  const api = useClipboardContext()
  const copied = () => api().copied
  // Seeds swaps its children for `copied` after a copy. Both are these same nodes, built once, so nothing is rebuilt and
  // every change below is a transition that can turn round half way.
  const content = (
    <>
      <Mark stroke-width={2.5} class="size-5 shrink-0">
        <g class={faded({ shown: !copied() })}>
          <rect x="8.5" y="8.5" width="12.5" height="12.5" rx="2" />
          <path d={sheet} />
        </g>
        <g class={faded({ shown: copied() })}>
          <path d={tick} pathLength="1" stroke-width={3} class={drawn({ shown: copied() })} />
        </g>
      </Mark>
      <span class="grid">
        <span aria-hidden={copied() ? "true" : undefined} class={faded({ shown: !copied(), class: words })}>
          {props.children}
        </span>
        <span aria-hidden={copied() ? undefined : "true"} class={faded({ shown: copied(), class: words })}>
          {props.copied}
        </span>
      </span>
    </>
  )
  return (
    <Seed.Indicator
      as="span"
      {...omit(props, "class", "children", "copied")}
      copied={content}
      class={indicator({ class: props.class })}
    >
      {content}
    </Seed.Indicator>
  )
}

// The sheet behind, showing only where it comes out from under the one in front
const sheet = "M4.5 15.5A1.5 1.5 0 0 1 3 14V5a2 2 0 0 1 2-2h9a1.5 1.5 0 0 1 1.5 1.5"

const indicator = tv({ base: "inline-flex items-center gap-2" })

const words = "col-start-1 row-start-1 text-center"

// What leaves fades quicker than what arrives, so the two never read as one smudge
const faded = tv({
  base: "transition-[opacity,visibility] ease-smooth",
  variants: {
    shown: {
      true: "duration-(--duration-smooth)",
      false: "invisible opacity-0 duration-(--duration-exit)",
    },
  },
})

// The tick is drawn by moving the dash along it, like a checkbox's. It stays drawn while it fades out, and is only taken
// back once it is gone.
const drawn = tv({
  base: "[stroke-dasharray:1] transition-[stroke-dashoffset] ease-smooth",
  variants: {
    shown: {
      true: "[stroke-dashoffset:0] duration-(--duration-smooth)",
      false: "[stroke-dashoffset:1] duration-0 delay-(--duration-exit)",
    },
  },
})
