import { PasswordInput as Seed, usePasswordInputContext } from "@foliag/seeds/password-input"
import type { JSX } from "@solidjs/web"
import { createUniqueId, omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { Mark } from "../internal/icons.jsx"

export type PasswordInputIndicatorProps = Omit<Seed.IndicatorProps, "class" | "children" | "fallback"> & {
  /** What a press does while the password shows, such as "Masquer". It names the button, so it is required. */
  children: JSX.Element
  /** What a press does while the password is hidden, such as "Afficher" */
  fallback: JSX.Element
  class?: string | undefined
}

/**
 * The button's words, which change as the password shows and hides, after an eye that a line strikes through while the
 * password shows. Zag hides the indicator from assistive technology, as it expects an eye icon alone, so it is shown to
 * it again here and its words name the button.
 *
 * Both sets of words are laid out in the same place, so the button keeps the width of the longer one and the field
 * beside it never moves. One fades into the other, and the line is drawn across the eye or taken back.
 */
export function PasswordInputIndicator(props: PasswordInputIndicatorProps): Element {
  const api = usePasswordInputContext()
  const cut = createUniqueId()
  const visible = () => api().visible
  // Seeds swaps its children for `fallback` as the password shows. Both are these same nodes, built once, so nothing is
  // rebuilt and every change below is a transition that can turn round half way.
  const content = (
    <>
      <Mark class="size-5 shrink-0" stroke-width={2.5}>
        {/* The line cuts a gap through the eye as it is drawn, so it reads as a line across and not a scratch on top */}
        <mask id={cut}>
          <rect width="24" height="24" fill="white" stroke="none" />
          <path d={strike} pathLength="1" stroke="black" stroke-width="6" class={line({ shown: visible() })} />
        </mask>
        <g mask={`url(#${cut})`}>
          <path d="M2.5 12C4.5 7.6 8 5.5 12 5.5s7.5 2.1 9.5 6.5c-2 4.4-5.5 6.5-9.5 6.5S4.5 16.4 2.5 12Z" />
          <circle cx="12" cy="12" r="3" />
        </g>
        <path d={strike} pathLength="1" class={line({ shown: visible() })} />
      </Mark>
      <span class="grid">
        <span aria-hidden={visible() ? undefined : "true"} class={words({ shown: visible() })}>
          {props.children}
        </span>
        <span aria-hidden={visible() ? "true" : undefined} class={words({ shown: !visible() })}>
          {props.fallback}
        </span>
      </span>
    </>
  )
  return (
    // Solid 2 removes an attribute set to `false`, and seeds passes `false` on where it skips `undefined`
    <Seed.Indicator
      {...omit(props, "class", "children", "fallback")}
      aria-hidden={false}
      fallback={content}
      class={indicator({ class: props.class })}
    >
      {content}
    </Seed.Indicator>
  )
}

const strike = "M4 4 20 20"

const indicator = tv({ base: "inline-flex items-center gap-2" })

// A line is drawn by moving the dash along its path, which takes a repaint of a 20px glyph and no layout
const line = tv({
  base: "[stroke-dasharray:1] transition-[stroke-dashoffset] duration-(--duration-smooth) ease-smooth",
  variants: {
    shown: { true: "[stroke-dashoffset:0]", false: "[stroke-dashoffset:1]" },
  },
})

// The words leaving fade quicker than the ones arriving, so the two never read as one smudge
const words = tv({
  base: "col-start-1 row-start-1 text-center transition-[opacity,visibility] ease-smooth",
  variants: {
    shown: {
      true: "duration-(--duration-smooth)",
      false: "invisible opacity-0 duration-(--duration-exit)",
    },
  },
})
