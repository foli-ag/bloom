import { Clipboard as Seed } from "@foliag/seeds/clipboard"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type ClipboardIndicatorProps = Omit<Seed.IndicatorProps<"span">, "class" | "children" | "copied" | "as"> & {
  /** The trigger's words, such as "Copier". They are its name, so they are required. */
  children: JSX.Element
  /** The words that replace them for a moment after a copy, such as "Copié" */
  copied: JSX.Element
  class?: string | undefined
}

/** The trigger's words, which become `copied` after a copy and pop in as they change */
export function ClipboardIndicator(props: ClipboardIndicatorProps): Element {
  return (
    <Seed.Indicator
      as="span"
      {...omit(props, "class", "children", "copied")}
      copied={<span class="inline-block animate-pop-in">{props.copied}</span>}
      class={indicator({ class: props.class })}
    >
      {props.children}
    </Seed.Indicator>
  )
}

const indicator = tv({ base: "inline-flex items-center gap-2" })
