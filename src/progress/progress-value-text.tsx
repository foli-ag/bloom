import { Progress as Seed, useProgressContext } from "@foliag/seeds/progress"
import { Presence } from "@foliag/seeds/presence"
import type { JSX } from "@solidjs/web"
import { createMemo, For, omit, untrack, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { Mark, tick } from "../internal/icons.jsx"
import { useProgressLook, type ProgressTone } from "./progress-look.js"

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

/**
 * The value next to the label, in the tone's color. It is empty while the value is not known.
 *
 * Under a `success`, `warning` or `danger` tone it starts with the tone's mark, a tick, a triangle or a circled "!",
 * so the tone shows as a shape and not as a color alone. The mark is decoration: the words say the same. It pops in
 * when the tone changes, the old one fading out under it, and fades out when the tone goes back to `primary`; a mark
 * there from the start is simply there.
 */
export function ProgressValueText(props: ProgressValueTextProps): Element {
  const api = useProgressContext()
  const look = useProgressLook()
  const tone = () => look?.tone() ?? "primary"
  // The tone the mark shows, kept while it fades out after the tone went back to primary
  const marked = createMemo<Exclude<ProgressTone, "primary"> | undefined>((last) => {
    const current = tone()
    return current === "primary" ? last : current
  })
  const format = untrack(() => props.children)
  const text = () => {
    if (!format) return api().valueAsString
    return api().indeterminate ? "" : format({ value: api().value, percent: api().percent })
  }
  return (
    <Seed.ValueText {...omit(props, "class", "children")} class={valueText({ class: props.class })}>
      <Presence
        as="span"
        present={tone() !== "primary"}
        lazyMount
        unmountOnExit
        skipAnimationOnMount
        aria-hidden="true"
        class={slot()}
      >
        <For each={marks}>
          {(mark) => <span class={markBox({ shown: marked() === mark.tone })}>{mark.draw()}</span>}
        </For>
      </Presence>
      <span>{text()}</span>
    </Seed.ValueText>
  )
}

const marks: { tone: Exclude<ProgressTone, "primary">; draw: () => JSX.Element }[] = [
  {
    tone: "success",
    draw: () => (
      <Mark stroke-width={3} class="size-5">
        <path d={tick} />
      </Mark>
    ),
  },
  {
    tone: "warning",
    draw: () => (
      <Mark stroke-width={2.5} class="size-5">
        <path d="M10.3 4.2 2.6 17.6A2 2 0 0 0 4.3 20.6h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9.5v4M12 17.2h.01" />
      </Mark>
    ),
  },
  {
    tone: "danger",
    draw: () => (
      <Mark stroke-width={2.5} class="size-5">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 7.5v5M12 16.2h.01" />
      </Mark>
    ),
  },
]

const valueText = tv({
  base: [
    "inline-flex items-center justify-end gap-1.5 text-base font-semibold tracking-body tabular-nums",
    "text-(--progress-text) transition-[color] duration-(--duration-smooth) ease-smooth",
  ],
})

// The mark's place pops in on the lively spring, from `@starting-style`, only once the root has been drawn
// (`skipAnimationOnMount` leaves `data-state` off a mark there from the start), and fades out on the exit clock while
// presence holds it mounted (`animate-hold`). Both are transitions, so a tone that changes back half way turns it round.
const slot = tv({
  base: [
    "inline-grid size-5 shrink-0 place-items-center",
    "transition-[opacity,scale] duration-(--duration-pop) ease-pop",
    "data-[state=open]:starting:scale-(--pop-in-scale) data-[state=open]:starting:opacity-0",
    "data-[state=closed]:scale-(--pop-in-scale) data-[state=closed]:opacity-0 data-[state=closed]:animate-hold",
    "data-[state=closed]:duration-(--duration-exit) data-[state=closed]:ease-smooth",
  ],
})

// The three marks share one cell, as the swap's indicators do: the one shown pops in as the old one fades and shrinks
// under it. A span scales, not the <svg>, which Chromium would scale on the main thread.
const markBox = tv({
  base: "col-start-1 row-start-1 inline-flex",
  variants: {
    shown: {
      true: "[transition:opacity_var(--duration-smooth)_var(--ease-smooth),scale_var(--duration-pop)_var(--ease-pop),visibility_0s]",
      false: [
        "invisible scale-(--pop-in-scale) opacity-0",
        "[transition:opacity_var(--duration-exit)_var(--ease-smooth),scale_var(--duration-exit)_var(--ease-smooth),visibility_0s_var(--duration-exit)]",
      ],
    },
  },
})
