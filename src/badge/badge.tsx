import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { omit, Show, type Element } from "solid-js"
import { tv, type VariantProps } from "../internal/variants.js"
import { badgeLook } from "../internal/badge.js"
import { StatusMark } from "../internal/icons.jsx"

export type BadgeProps<As extends ValidComponent = "span"> = PolymorphicProps<As, BadgeOwnProps>

interface BadgeOwnProps extends VariantProps<typeof badgeLook> {
  /** Its words, such as "En retard" or a count. They carry the meaning, so they are required. */
  children: JSX.Element
  /**
   * A sign before the words: a `dot`, or the `mark` of its tone, a tick for success, a "!" in a triangle for a
   * warning, an "i" for information and a "!" in an octagon for danger. Neutral and primary have no mark of their own,
   * and show the dot. Both are decoration, hidden from assistive technology, as the words already say it.
   */
  indicator?: "dot" | "mark" | undefined
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A short status or a count next to what it is about: "En retard", "Validé", "3". Its tone says what kind of status it
 * is, and its variant how loudly: `soft` on a tint, `solid` on a fill, `outline` on an edge. The words carry the
 * meaning, never the color alone, and `indicator` adds a sign of the tone's shape. It is 16px text on a 28px label, so
 * it reads in the sun, and it is not a target: put it inside the link or the button it qualifies.
 *
 * For a count, give the words a meaning a screen reader can say, such as a visually hidden "alertes" after the number.
 *
 * @example
 * <Badge tone="warning" indicator="mark">En retard</Badge>
 * <Badge tone="danger" variant="solid">3</Badge>
 */
export function Badge<As extends ValidComponent = "span">(props: BadgeProps<As>): Element {
  const rest = omit(props, "tone", "variant", "indicator", "class", "children")
  const mark = () => {
    const tone = props.tone
    return props.indicator === "mark" && tone !== undefined && tone !== "neutral" && tone !== "primary"
      ? tone
      : undefined
  }
  return (
    <Polymorphic
      as="span"
      {...rest}
      class={badgeLook({ tone: props.tone, variant: props.variant, class: [badge(), props.class] })}
    >
      <Show when={mark()} fallback={<Show when={props.indicator}>{dot()}</Show>}>
        {(tone) => <StatusMark tone={tone()} class="size-4 shrink-0" />}
      </Show>
      {props.children}
    </Polymorphic>
  )
}

const dot = () => <span aria-hidden="true" class="size-2 shrink-0 rounded-full bg-current" />

// A count of one digit is as wide as it is tall, and its digits keep their width as it changes
const badge = tv({ base: "min-h-7 min-w-7 justify-center gap-1.5 px-2 text-sm tabular-nums" })
