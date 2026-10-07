import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { omit, Show, untrack, type Element } from "solid-js"
import { tv, type VariantProps } from "../internal/variants.js"
import { ButtonSpinner } from "./button-spinner.jsx"
import { forwardRef } from "../internal/pointer.js"

export type ButtonProps<As extends ValidComponent = "button"> = PolymorphicProps<As, ButtonOwnProps>

interface ButtonOwnProps extends VariantProps<typeof button> {
  /** Its words. A button with no words has no name for a screen reader, so there is no icon-only button. */
  children: JSX.Element
  /** Merged after the component's own classes, and wins over them: `p-8` replaces the `px-5` it conflicts with */
  class?: string | undefined
  /**
   * An action is under way. The button keeps its place and focus, shows a spinner and ignores clicks and Enter, and
   * is announced as busy. The spinner has no words: change the button's own text, "Enregistrement…", so a screen
   * reader says what is happening.
   */
  loading?: boolean | undefined
}

/**
 * A touch target of 48px, or 56px as `size="lg"` for the main action on a screen. `tone` says what the action is,
 * and `variant` how loudly. Its words are its children.
 *
 * @example
 * <Button size="lg" block loading={saving()}>Enregistrer</Button>
 * <Button as="a" href="/champs" variant="outline">Mes champs</Button>
 */
export function Button<As extends ValidComponent = "button">(props: ButtonProps<As>): Element {
  const rest = omit(props, "tone", "variant", "size", "block", "loading", "class", "children")
  return (
    <Polymorphic
      as="button"
      // A button in a form submits it, so an app opts in with type="submit"
      type={props.as === undefined ? "button" : undefined}
      {...rest}
      class={button({
        tone: props.tone,
        variant: props.variant,
        size: props.size,
        block: props.block,
        class: props.class,
      })}
      aria-busy={props.loading ? "true" : undefined}
      ref={(element: HTMLElement) => {
        ignoreClicksWhile(element, () => props.loading === true)
        forwardRef(
          untrack(() => rest.ref),
          element,
        )
      }}
    >
      <Show when={props.loading}>
        <ButtonSpinner />
      </Show>
      {props.children}
    </Polymorphic>
  )
}

/**
 * `disabled` would drop the button out of the tab order and lose the farmer's place, so a busy button stays
 * focusable and swallows the click before the app's handler, or a form, sees it.
 */
function ignoreClicksWhile(element: HTMLElement, busy: () => boolean) {
  element.addEventListener(
    "click",
    (event) => {
      if (!busy()) return
      event.preventDefault()
      event.stopImmediatePropagation()
    },
    { capture: true },
  )
}

/**
 * Pressed and hovered states lighten the primary fill, because its ink is dark and gets more contrast, not less, on a
 * lighter ground. Danger and neutral fills move the other way, for the same reason.
 *
 * A phone has no hover, so every variant takes its hover look, or a step past it, while it is pressed. Its colors get
 * there as fast as it shrinks, so even a quick tap shows, and ease back on the smooth spring when it is let go. A
 * disabled or busy button shows no press, as the press does nothing. A button that opens a menu or a popover keeps its
 * hover look while what it opens is open (`aria-expanded`), as a select's field does.
 */
const button = tv({
  base: [
    "relative inline-flex items-center justify-center gap-2 rounded-control border-2 text-center",
    "pressable font-semibold tracking-body",
    "motion-press focus-ring",
    "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-ink",
    "aria-busy:cursor-progress",
  ],
  variants: {
    tone: { primary: "", neutral: "", danger: "" },
    variant: { solid: "", soft: "", outline: "", ghost: "" },
    size: {
      md: "min-h-12 px-5 py-2 text-base",
      lg: "min-h-14 px-6 py-3 text-lg",
    },
    block: { true: "w-full", false: "" },
  },
  compoundVariants: [
    {
      tone: "primary",
      variant: "solid",
      class:
        "border-primary-edge bg-primary text-on-primary hover:bg-primary-hover aria-expanded:bg-primary-hover pressing:bg-primary-pressed",
    },
    {
      tone: "primary",
      variant: "soft",
      class:
        "border-transparent bg-primary-soft text-primary-text hover:border-primary-edge aria-expanded:border-primary-edge pressing:border-primary-edge",
    },
    {
      tone: "primary",
      variant: "outline",
      class: [
        "border-primary-edge bg-transparent text-primary-text hover:bg-primary-soft aria-expanded:bg-primary-soft pressing:bg-primary-soft",
        "disabled:bg-transparent",
      ],
    },
    {
      tone: "primary",
      variant: "ghost",
      class: [
        "border-transparent bg-transparent text-primary-text hover:bg-primary-soft aria-expanded:bg-primary-soft pressing:bg-primary-soft",
        "disabled:bg-transparent",
      ],
    },
    {
      tone: "neutral",
      variant: "solid",
      class:
        "border-ink bg-ink text-surface hover:border-muted aria-expanded:border-muted hover:bg-muted aria-expanded:bg-muted pressing:border-muted pressing:bg-muted",
    },
    {
      tone: "neutral",
      variant: "soft",
      class:
        "border-transparent bg-neutral-soft text-ink hover:border-strong aria-expanded:border-strong pressing:border-strong",
    },
    {
      tone: "neutral",
      variant: "outline",
      class:
        "border-strong bg-transparent text-ink hover:bg-neutral-soft aria-expanded:bg-neutral-soft pressing:bg-neutral-soft disabled:bg-transparent",
    },
    {
      tone: "neutral",
      variant: "ghost",
      class: [
        "border-transparent bg-transparent text-ink hover:bg-neutral-soft aria-expanded:bg-neutral-soft pressing:bg-neutral-soft",
        "disabled:bg-transparent",
      ],
    },
    {
      tone: "danger",
      variant: "solid",
      class: [
        "border-danger bg-danger text-on-danger",
        "hover:bg-[color-mix(in_oklab,var(--color-danger)_85%,var(--color-ink))] aria-expanded:bg-[color-mix(in_oklab,var(--color-danger)_85%,var(--color-ink))]",
        "pressing:bg-[color-mix(in_oklab,var(--color-danger)_70%,var(--color-ink))]",
      ],
    },
    {
      tone: "danger",
      variant: "soft",
      class:
        "border-transparent bg-danger-soft text-danger-text hover:border-danger-text aria-expanded:border-danger-text pressing:border-danger-text",
    },
    {
      tone: "danger",
      variant: "outline",
      class: [
        "border-danger-text bg-transparent text-danger-text hover:bg-danger-soft aria-expanded:bg-danger-soft pressing:bg-danger-soft",
        "disabled:bg-transparent",
      ],
    },
    {
      tone: "danger",
      variant: "ghost",
      class: [
        "border-transparent bg-transparent text-danger-text hover:bg-danger-soft aria-expanded:bg-danger-soft pressing:bg-danger-soft",
        "disabled:bg-transparent",
      ],
    },
  ],
  defaultVariants: { tone: "primary", variant: "solid", size: "md", block: false },
})
