import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { omit, untrack, type Element } from "solid-js"
import { tv, type VariantProps } from "../internal/variants.js"
import { fieldBox, fieldFrame, fieldFrameInput } from "../internal/field.js"
import { forwardRef } from "../internal/pointer.js"
import { InputEnd } from "./input-end.jsx"
import { InputStart } from "./input-start.jsx"

export type InputProps<As extends ValidComponent = "input"> = PolymorphicProps<As, InputOwnProps>

interface InputOwnProps extends VariantProps<typeof fieldBox> {
  /**
   * Merged after the component's own classes, and wins over them: `p-8` replaces the `px-5` it conflicts with. With
   * children, it goes on the box around the input and its parts.
   */
  class?: string | undefined
  /** The value is not accepted. Say why in text next to the input and point at it with `aria-describedby`. */
  invalid?: boolean | undefined
  /** `Input.Start` and `Input.End`, drawn in the field's box with the input, in any order */
  children?: JSX.Element
}

/**
 * A text field at the 48px touch size, or 56px as `size="lg"`. Text is 18px, which also keeps iOS from zooming in on
 * focus. It does not label itself: give it a visible `<label for>` or `aria-label`, because a placeholder disappears
 * as soon as the farmer starts typing.
 *
 * It is the box every bloom field is drawn in: invalid adds a second, inner line to the edge, so the change is not a
 * color alone and nothing shifts by a pixel.
 *
 * With `Input.Start` or `Input.End` as children, the box is drawn around the input and them, and takes the input's
 * states as one control: hover, the focus ring, invalid and disabled. Every prop still goes to the input. A press on a
 * mark or a unit puts the caret in the field, as a press on the field's own padding would; a button in a part stays a
 * button, named by its own words.
 *
 * @example
 * <label for="parcelle">Nom de la parcelle</label>
 * <Input id="parcelle" name="parcelle" aria-describedby="parcelle-hint" />
 *
 * <label for="surface">Surface</label>
 * <Input id="surface" name="surface" inputmode="decimal">
 *   <Input.End>ha</Input.End>
 * </Input>
 */
function InputField<As extends ValidComponent = "input">(props: InputProps<As>): Element {
  const rest = omit(props, "size", "invalid", "class", "children")
  // Whether there are parts is known once: the input is the same element either way, and moving it into a box later
  // would lose its focus and what is being typed
  if (!untrack(() => "children" in props)) {
    return (
      <Polymorphic
        as="input"
        {...rest}
        class={fieldBox({ size: props.size, class: [input(), props.class] })}
        aria-invalid={props.invalid ? "true" : undefined}
      />
    )
  }
  let field: HTMLElement | undefined
  return (
    <div
      class={fieldFrame({ size: props.size, class: [frame(), props.class] })}
      // A unit greyed with a disabled field is part of a control that does nothing, as the input's own text is
      aria-disabled={(props as { disabled?: boolean }).disabled ? "true" : undefined}
      onMouseDown={(event) => focusFromPart(event, field)}
    >
      <Polymorphic
        as="input"
        {...rest}
        ref={(element: HTMLElement) => {
          field = element
          forwardRef(
            untrack(() => rest.ref),
            element,
          )
        }}
        class={fieldFrameInput()}
        aria-invalid={props.invalid ? "true" : undefined}
      />
      {props.children}
    </div>
  )
}

/**
 * A press on the box outside the input, on a mark or a unit, puts the caret at the end of the text, as a press past the
 * end of the text does. The input keeps the focus if it had it, so the ring does not blink and a phone's keyboard does
 * not close and open again. A press on a button, a link or another field inside a part is left to it.
 */
function focusFromPart(event: MouseEvent, field: HTMLElement | undefined) {
  const box = event.currentTarget as HTMLElement
  const target = event.target as HTMLElement
  if (!field || event.button !== 0 || target === field) return
  const control = target.closest("button, a[href], input, select, textarea, [tabindex]")
  if (control && box.contains(control)) return
  event.preventDefault()
  if (field.ownerDocument.activeElement === field) return
  field.focus()
  if (field instanceof HTMLInputElement) {
    // Types such as `email` and `number` have no caret to place
    try {
      field.setSelectionRange(field.value.length, field.value.length)
    } catch {}
  }
}

const input = tv({ base: "block px-4 py-2 placeholder:text-muted disabled:placeholder:text-disabled-ink" })

// The input's padding beside a part shrinks to the gap a mark or a unit needs from the text
const frame = tv({
  base: ["group/field cursor-text", "[&:has(>[data-part=start])>input]:ps-3 [&:has(>[data-part=end])>input]:pe-3"],
})

/**
 * A text field, with `Input.Start` and `Input.End` for what sits in its box before and after the text.
 */
export const Input = /* @__PURE__ */ Object.assign(InputField, { Start: InputStart, End: InputEnd })
