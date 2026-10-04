import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv, type VariantProps } from "tailwind-variants"

export type InputProps<As extends ValidComponent = "input"> = PolymorphicProps<As, InputOwnProps>

interface InputOwnProps extends VariantProps<typeof input> {
  /** Merged after the component's own classes, and wins over them: `p-8` replaces the `px-5` it conflicts with */
  class?: string | undefined
  /** The value is not accepted. Say why in text next to the input and point at it with `aria-describedby`. */
  invalid?: boolean | undefined
}

/**
 * A text field at the 48px touch size, or 56px as `size="lg"`. Text is 18px, which also keeps iOS from zooming in on
 * focus. It does not label itself: give it a visible `<label for>` or `aria-label`, because a placeholder disappears
 * as soon as the farmer starts typing.
 *
 * @example
 * <label for="parcelle">Nom de la parcelle</label>
 * <Input id="parcelle" name="parcelle" aria-describedby="parcelle-hint" />
 */
export function Input<As extends ValidComponent = "input">(props: InputProps<As>): Element {
  const rest = omit(props, "size", "invalid", "class")
  return (
    <Polymorphic
      as="input"
      {...rest}
      class={input({ size: props.size, class: props.class })}
      aria-invalid={props.invalid ? "true" : undefined}
    />
  )
}

// Invalid adds a second, inner line to the edge, so the change is not a color alone and nothing shifts by a pixel.
const input = tv({
  base: [
    "block w-full rounded-control border-2 border-strong bg-raised px-4 py-2 font-medium tracking-body text-ink",
    "placeholder:text-muted",
    "transition-colors duration-(--duration-smooth) ease-smooth",
    "hover:border-ink focus-visible:border-ink focus-ring",
    "aria-invalid:border-danger-text aria-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-ink",
  ],
  variants: {
    size: {
      md: "min-h-12 text-base",
      lg: "min-h-14 text-lg",
    },
  },
  defaultVariants: { size: "md" },
})
