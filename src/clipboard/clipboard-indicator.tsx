import { Clipboard as Seed, useClipboardContext } from "@foliag/seeds/clipboard"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { Mark, tick } from "../internal/icons.jsx"

export type ClipboardIndicatorProps = Omit<Seed.IndicatorProps<"span">, "class" | "children" | "copied" | "as"> & {
  /** The trigger's words, such as "Copier". They are its name, so they are required. */
  children: JSX.Element
  /** The words that replace them for a moment after a copy, such as "Copié" */
  copied: JSX.Element
  class?: string | undefined
}

/**
 * The trigger's words, which become `copied`, after a tick, for a moment after a copy. The tick is drawn in as the words
 * change, and both fade back to the first words once the moment is over.
 *
 * Both sets of words are laid out in the same place, so the trigger keeps the width of the longer one and the value
 * beside it never moves.
 */
export function ClipboardIndicator(props: ClipboardIndicatorProps): Element {
  const api = useClipboardContext()
  const copied = () => api().copied
  // Seeds swaps its children for `copied` after a copy. Both are these same nodes, built once, so nothing is rebuilt and
  // every change below is a transition that can turn round half way.
  const content = (
    <span class="grid place-items-center">
      <span aria-hidden={copied() ? "true" : undefined} class={words({ shown: !copied() })}>
        {props.children}
      </span>
      <span aria-hidden={copied() ? undefined : "true"} class={words({ shown: copied(), class: "inline-flex gap-2" })}>
        <Mark stroke-width={3.5} class="size-5 shrink-0">
          <path d={tick} pathLength="1" class={drawn({ shown: copied() })} />
        </Mark>
        {props.copied}
      </span>
    </span>
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

const indicator = tv({ base: "inline-flex items-center" })

// The words leaving fade quicker than the ones arriving, so the two never read as one smudge
const words = tv({
  base: "col-start-1 row-start-1 items-center transition-[opacity,visibility] ease-smooth",
  variants: {
    shown: {
      true: "duration-(--duration-smooth)",
      false: "invisible opacity-0 duration-(--duration-exit)",
    },
  },
})

// The tick is drawn by moving the dash along it, like a checkbox's. It stays drawn while its words fade out, and is only
// taken back once they are gone.
const drawn = tv({
  base: "[stroke-dasharray:1] transition-[stroke-dashoffset] ease-smooth",
  variants: {
    shown: {
      true: "[stroke-dashoffset:0] duration-(--duration-smooth)",
      false: "[stroke-dashoffset:1] duration-0 delay-(--duration-exit)",
    },
  },
})
