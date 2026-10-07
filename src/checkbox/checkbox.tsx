import { Checkbox as Seed } from "@foliag/seeds/checkbox"
import type { JSX } from "@solidjs/web"
import { createUniqueId, omit, useContext, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import {
  ChoiceDescriptionId,
  choiceDescription,
  choiceMedia,
  choiceRow,
  choiceTile,
  choiceWords,
  drawnMark,
} from "../internal/choice.js"
import { Mark, tick } from "../internal/icons.jsx"

export type CheckboxProps = Omit<Seed.RootProps, "children" | "class"> & {
  /**
   * The words next to the box, which are its accessible name, so there is no default and no way to omit them: plain
   * words, or a `Checkbox.Label` with a `Checkbox.Description` under it, and in a tile a `Checkbox.Media` above them.
   * With a description, put the title in `Checkbox.Label`, so the box is named by its title and described by the
   * sentence, instead of being named by both.
   */
  children: JSX.Element
  /**
   * How it is drawn. `row`, the default: a box and its words as one row. `card`: a tile, for a choice that deserves
   * more than a line, with a mark or a picture, a title and a sentence. Lay tiles out in a grid of the app's, such as
   * `grid gap-3 sm:grid-cols-2`, so they become one column on a phone.
   */
  variant?: "row" | "card" | undefined
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A box and its words as one row, the width of its container and at least 48px tall: tapping anywhere on it ticks the
 * box. The box goes down with the finger and comes back up as it fills and the tick draws in, all on one clock.
 * Unticked, the tick fades out quicker than it came. As a `card`, it is a tile with the box in its top corner, and the
 * whole tile is the target.
 *
 * @example
 * <Checkbox name="irrigue" onCheckedChange={(details) => setIrrigated(details.checked === true)}>Irrigué</Checkbox>
 *
 * <Checkbox name="bio">
 *   <Checkbox.Label>Agriculture biologique</Checkbox.Label>
 *   <Checkbox.Description>Sans produit de synthèse depuis trois ans</Checkbox.Description>
 * </Checkbox>
 */
function CheckboxRoot(props: CheckboxProps): Element {
  const rest = omit(props, "children", "class", "variant")
  const descriptionId = createUniqueId()
  const variant = () => props.variant ?? "row"
  return (
    <Seed.Root
      {...rest}
      class={variant() === "card" ? choiceTile({ class: props.class }) : choiceRow({ class: props.class })}
    >
      <Seed.Control class={control({ variant: variant() })}>
        <Mark stroke-width={3.5} class="size-5">
          <path d={tick} pathLength="1" class={drawnMark({ shown: "checked" })} />
          <path d="M6 12h12" pathLength="1" class={drawnMark({ shown: "indeterminate" })} />
        </Mark>
      </Seed.Control>
      <ChoiceDescriptionId value={descriptionId}>
        <span class={choiceWords({ variant: variant() })}>{props.children}</span>
      </ChoiceDescriptionId>
      <Seed.HiddenInput aria-describedby={descriptionId} />
    </Seed.Root>
  )
}

export type LabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** The choice's title. It is the checkbox's accessible name. */
  children: JSX.Element
  class?: string | undefined
}

/** The title of a choice that has a description under it. The box is named by it alone. */
function Label(props: LabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={props.class} />
}

export type DescriptionProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  /** A sentence that explains the choice. The box is described by it, so a screen reader reads it after the name. */
  children: JSX.Element
  class?: string | undefined
}

/** A sentence under the title that explains the choice, muted but at 7:1, and read out after the box's name */
function Description(props: DescriptionProps): Element {
  return (
    <span
      {...omit(props, "class")}
      id={useContext(ChoiceDescriptionId)}
      data-scope="checkbox"
      data-part="description"
      class={choiceDescription({ class: props.class })}
    />
  )
}

export type MediaProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  /** A drawn mark, an `<svg>` shown at 32px, or an `<img>` cropped to a 48px square */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A mark or a small picture above a tile's title. It is decoration: the title names the choice, so it is hidden from
 * assistive technology.
 */
function Media(props: MediaProps): Element {
  return (
    <span
      {...omit(props, "class")}
      aria-hidden="true"
      data-scope="checkbox"
      data-part="media"
      class={choiceMedia({ class: props.class })}
    />
  )
}

export const Checkbox = /* @__PURE__ */ Object.assign(CheckboxRoot, { Label, Description, Media })

// The box carries its state as data attributes from the checkbox machine. It is hidden from assistive technology, the
// native input is what they read. Under the pointer an empty box darkens its edge and a filled one lightens, as a
// primary button does: its ink is dark, so a lighter fill has more contrast, not less. A disabled box is grey whatever
// its state, which its tick or dash still shows. In a tile the ring is the tile's, and the box sits in its top corner
// at the end.
const control = tv({
  base: [
    "grid size-7 shrink-0 place-items-center rounded-box border-2 border-strong bg-raised text-on-primary",
    "motion-touch [scale:var(--choice-press,1)] group-hover/row:border-ink",
    "not-data-disabled:data-[state=checked]:border-primary-edge not-data-disabled:data-[state=checked]:bg-primary",
    "not-data-disabled:data-[state=indeterminate]:border-primary-edge not-data-disabled:data-[state=indeterminate]:bg-primary",
    "group-hover/row:not-data-disabled:not-data-readonly:data-[state=checked]:bg-primary-hover",
    "group-hover/row:not-data-disabled:not-data-readonly:data-[state=indeterminate]:bg-primary-hover",
    "data-invalid:border-danger-text data-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled-ink",
  ],
  variants: {
    variant: {
      row: ["focus-ring data-invalid:[--color-focus:var(--color-danger-text)]"],
      card: "col-start-2 row-start-1",
    },
  },
})
