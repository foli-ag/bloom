import { PasswordInput as Seed } from "@foliag/seeds/password-input"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type PasswordInputIndicatorProps = Omit<Seed.IndicatorProps, "class" | "children" | "fallback"> & {
  /** What a press does while the password shows, such as "Masquer". It names the button, so it is required. */
  children: JSX.Element
  /** What a press does while the password is hidden, such as "Afficher" */
  fallback: JSX.Element
  class?: string | undefined
}

/**
 * The button's words, which change as the password shows and hides. Zag hides the indicator from assistive
 * technology, as it expects an eye icon, so it is shown to it again here and its words name the button.
 */
export function PasswordInputIndicator(props: PasswordInputIndicatorProps): Element {
  // Solid 2 removes an attribute set to `false`, and seeds passes `false` on where it skips `undefined`
  return <Seed.Indicator {...omit(props, "class")} aria-hidden={false} class={indicator({ class: props.class })} />
}

const indicator = tv({ base: "inline-flex items-center gap-2" })
