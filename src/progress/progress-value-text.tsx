import { Progress as Seed, useProgressContext } from "@foliag/seeds/progress"
import type { JSX } from "@solidjs/web"
import { omit, untrack, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export interface ProgressValueDetails {
  /** Null while nobody knows how far along it is */
  value: number | null
  /** From 0 to 100 */
  percent: number
}

export type ProgressValueTextProps = Omit<Seed.ValueTextProps, "class" | "children"> & {
  /**
   * The value as the farmer reads it, ``({ value }) => `${value} photos sur 12` ``. Without it, it shows the root's
   * `translations.value`, which a screen reader says.
   */
  children?: ((details: ProgressValueDetails) => JSX.Element) | undefined
  class?: string | undefined
}

/** The value next to the label. It is empty while the value is not known. */
export function ProgressValueText(props: ProgressValueTextProps): Element {
  const api = useProgressContext()
  const format = untrack(() => props.children)
  // Seeds shows the root's `translations.value` when it is given no children at all
  const own = format
    ? {
        get children() {
          return api().indeterminate ? "" : format({ value: api().value, percent: api().percent })
        },
      }
    : {}
  return <Seed.ValueText {...omit(props, "class", "children")} {...own} class={valueText({ class: props.class })} />
}

const valueText = tv({ base: "text-base font-semibold tracking-body text-ink tabular-nums" })
