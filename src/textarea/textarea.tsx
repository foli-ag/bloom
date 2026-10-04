import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import { createEffect, omit, onSettled, untrack, type Element } from "solid-js"
import { tv, type VariantProps } from "../internal/variants.js"
import { fieldBox } from "../internal/field.js"
import { forwardRef } from "../internal/pointer.js"

export type TextareaProps<As extends ValidComponent = "textarea"> = PolymorphicProps<As, TextareaOwnProps>

interface TextareaOwnProps extends VariantProps<typeof fieldBox> {
  /** Merged after the component's own classes, and wins over them: `max-h-80` lets it grow taller before it scrolls */
  class?: string | undefined
  /** The value is not accepted. Say why in text next to it and point at it with `aria-describedby`. */
  invalid?: boolean | undefined
}

/**
 * Text over several lines, such as a note on a field visit, in the same box as an `Input`: the 2px edge, the ring
 * inside it, the second line while invalid. It is two lines tall when empty, so it reads as room to write and not as a
 * one-line field, and it grows with the text, line by line, up to ten lines, after which it scrolls. A new line appears
 * at once under the caret: the box does not ease to its new height, which would trail behind the typing.
 *
 * It grows with `field-sizing: content`. A browser without it gets the same growth from a script that fits the box to
 * the text as it changes.
 *
 * It does not label itself: give it a visible `<label for>`.
 *
 * @example
 * <label for="note">Observations</label>
 * <Textarea id="note" name="note" aria-describedby="note-hint" />
 */
export function Textarea<As extends ValidComponent = "textarea">(props: TextareaProps<As>): Element {
  const rest = omit(props, "size", "invalid", "class")
  let field: HTMLTextAreaElement | undefined
  let fit: (() => void) | undefined
  onSettled(() => {
    if (!field || CSS.supports("field-sizing", "content")) return
    const own = field
    fit = () => fitToText(own)
    fit()
    own.addEventListener("input", fit)
    return () => own.removeEventListener("input", fit!)
  })
  // A value the app sets fires no event
  createEffect(
    () => (props as { value?: unknown }).value,
    () => fit?.(),
  )
  return (
    <Polymorphic
      as="textarea"
      rows={2}
      {...rest}
      ref={(element: HTMLTextAreaElement) => {
        field = element
        forwardRef(
          untrack(() => rest.ref),
          element,
        )
      }}
      class={fieldBox({ size: props.size, class: [textarea(), props.class] })}
      aria-invalid={props.invalid ? "true" : undefined}
    />
  )
}

/**
 * Where `field-sizing` is missing, the box takes the height of its text, within its own minimum and maximum. Measured
 * at `height: auto`, so it shrinks too when lines go.
 */
function fitToText(field: HTMLTextAreaElement) {
  const style = getComputedStyle(field)
  const edges = Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth)
  field.style.height = "auto"
  field.style.height = `${field.scrollHeight + edges}px`
}

// Two lines at least and ten at most, in the box's own line height (`lh`), with its padding and its edge. Lines wrap
// and never scroll sideways.
const textarea = tv({
  base: [
    "block resize-none px-4 py-2 placeholder:text-muted disabled:placeholder:text-disabled-ink",
    "min-h-[calc(2lh+1rem+4px)] max-h-[calc(10lh+1rem+4px)] overflow-y-auto [field-sizing:content]",
  ],
})
