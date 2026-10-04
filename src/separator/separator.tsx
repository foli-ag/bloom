import type { JSX } from "@solidjs/web"
import { children, createUniqueId, omit, Show, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type SeparatorProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "class" | "role"> & {
  /** Across, the default, or `vertical` between things in a row */
  orientation?: "horizontal" | "vertical" | undefined
  /**
   * Only a line for the eye, hidden from assistive technology, such as between two groups that headings already part.
   * By default it is a `separator`, which a screen reader announces as a break.
   */
  decorative?: boolean | undefined
  /** Words in the middle of the line, such as "ou" between two ways to sign in. They name the separator. */
  children?: JSX.Element
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A 2px line in the quiet edge color that parts two groups, across or down. With words, such as "ou", the line runs on
 * both sides of them. It has no margin: the gap of what holds it spaces it, like any other part.
 *
 * A screen reader hears a separator and its words, "ou, séparateur". A `decorative` one is left out, and its words, if
 * any, are read as plain text where they stand.
 *
 * @example
 * <Separator />
 * <Separator>ou</Separator>
 * <Separator orientation="vertical" decorative />
 */
export function Separator(props: SeparatorProps): Element {
  const rest = omit(props, "orientation", "decorative", "children", "class")
  const label = children(() => props.children)
  const labelId = createUniqueId()
  const labelled = () => label.toArray().length > 0
  const vertical = () => props.orientation === "vertical"
  return (
    <div
      {...rest}
      data-scope="separator"
      data-part="root"
      data-orientation={vertical() ? "vertical" : "horizontal"}
      role={props.decorative ? "none" : "separator"}
      aria-orientation={!props.decorative && vertical() ? "vertical" : undefined}
      aria-labelledby={!props.decorative && labelled() ? labelId : undefined}
      class={root({ vertical: vertical(), labelled: labelled(), class: props.class })}
    >
      <Show when={labelled()}>
        <span aria-hidden="true" class={line({ vertical: vertical() })} />
        <span id={labelId} data-part="label" class={text()}>
          {label()}
        </span>
        <span aria-hidden="true" class={line({ vertical: vertical() })} />
      </Show>
    </div>
  )
}

const root = tv({
  base: "shrink-0",
  variants: {
    vertical: { false: "w-full", true: "self-stretch" },
    labelled: { false: "bg-border", true: "flex items-center" },
  },
  compoundVariants: [
    { vertical: false, labelled: false, class: "h-0.5" },
    { vertical: true, labelled: false, class: "w-0.5" },
    { vertical: false, labelled: true, class: "gap-3" },
    { vertical: true, labelled: true, class: "flex-col gap-2" },
  ],
})

const line = tv({
  base: "flex-1 bg-border",
  variants: { vertical: { false: "h-0.5", true: "w-0.5" } },
})

const text = tv({ base: "text-sm font-semibold tracking-body text-muted" })
