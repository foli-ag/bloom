import { RadioGroup as Seed, useRadioGroupContext } from "@foliag/seeds/radio-group"
import type { JSX } from "@solidjs/web"
import { type Accessor, createContext, omit, useContext, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import {
  ChoicePartsContext,
  choiceDescription,
  choiceMedia,
  choiceRow,
  choiceTile,
  choiceWords,
  createChoiceParts,
  useChoicePart,
} from "../internal/choice.js"

type Variant = "row" | "card"

// The root's look, read by its items. A context and not a class on the root, so a group inside another one's item
// takes its own look.
const RootVariant = /* @__PURE__ */ createContext<Accessor<Variant>>(() => "row")

export type RootProps = Omit<Seed.RootProps, "class"> & {
  /**
   * How the choices are drawn. `row`, the default: a circle and its words, one row each. `card`: tiles, for choices
   * that deserve more than a line, with a mark or a picture, a title and a sentence each. Tiles sit side by side in a
   * grid that becomes one column on a phone, unless `orientation="vertical"` stacks them.
   */
  variant?: Variant | undefined
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * One choice among a few, all in view at once: with more than six or so, use a Select. Arrow keys move the choice
 * inside the group, Tab leaves it. Name the group with a `Label`, and put each choice in an `Item`.
 *
 * @example
 * <RadioGroup.Root name="culture" defaultValue="ble">
 *   <RadioGroup.Label>Culture</RadioGroup.Label>
 *   <RadioGroup.Item value="ble">Blé</RadioGroup.Item>
 *   <RadioGroup.Item value="mais">Maïs</RadioGroup.Item>
 * </RadioGroup.Root>
 *
 * <RadioGroup.Root name="irrigation" variant="card">
 *   <RadioGroup.Label>Irrigation</RadioGroup.Label>
 *   <RadioGroup.Item value="goutte">
 *     <RadioGroup.Item.Media><DropMark /></RadioGroup.Item.Media>
 *     <RadioGroup.Item.Text>Goutte à goutte</RadioGroup.Item.Text>
 *     <RadioGroup.Item.Description>Au pied de chaque rang, peu d'eau perdue</RadioGroup.Item.Description>
 *   </RadioGroup.Item>
 * </RadioGroup.Root>
 */
export function Root(props: RootProps): Element {
  const variant = () => props.variant ?? "row"
  return (
    <RootVariant value={variant}>
      <Seed.Root
        {...omit(props, "class", "variant", "orientation")}
        // Tiles go side by side unless the app stacks them
        orientation={props.orientation ?? (variant() === "card" ? "horizontal" : undefined)}
        class={root({ variant: variant(), class: props.class })}
      />
    </RootVariant>
  )
}

export type LabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What the farmer is choosing. It is the group's accessible name, so there is no default. */
  children: JSX.Element
  class?: string | undefined
}

export function Label(props: LabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={label({ class: props.class })} />
}

export type ItemProps = Omit<Seed.ItemProps, "class" | "children"> & {
  /**
   * The choice's words, which are its accessible name: plain words, or an `Item.Text` with an `Item.Description` under
   * it, and in a tile an `Item.Media` above them. With a description, put the title in `Item.Text`, so the choice is
   * named by its title and described by the sentence, instead of being named by both.
   */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A circle and its words as one row at least 48px tall: tapping anywhere on it chooses it. Stacked, each row is the
 * width of the group. Side by side, each is as wide as its words. In a `card` group it is a tile, the circle in its
 * top corner, and the whole tile is the target.
 */
function ItemRoot(props: ItemProps): Element {
  const rest = omit(props, "class", "children")
  const variant = useContext(RootVariant)
  const api = useRadioGroupContext()
  const parts = createChoiceParts()
  // Plain words are the title themselves, so the column takes the id zag names the radio by
  const text = () => (parts.titled() ? undefined : api().getItemTextProps({ value: props.value }))
  return (
    <Seed.Item
      {...rest}
      class={variant() === "card" ? choiceTile({ class: props.class }) : choiceRow({ class: props.class })}
    >
      <Seed.Item.Control class={control({ variant: variant() })} />
      <ChoicePartsContext value={parts}>
        <span
          id={text()?.id}
          data-scope={text() && "radio-group"}
          data-part={text() && "item-text"}
          class={choiceWords({ variant: variant() })}
        >
          {props.children}
        </span>
      </ChoicePartsContext>
      <Seed.Item.HiddenInput aria-describedby={parts.described() ? parts.descriptionId : undefined} />
    </Seed.Item>
  )
}

export type ItemTextProps = Omit<Seed.ItemTextProps, "class" | "children"> & {
  /** The choice's title. It is the radio's accessible name. */
  children: JSX.Element
  class?: string | undefined
}

/** The title of a choice that has a description under it. The radio is named by it alone. */
function ItemText(props: ItemTextProps): Element {
  useChoicePart("title")
  return <Seed.Item.Text {...omit(props, "class")} class={props.class} />
}

export type ItemDescriptionProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  /** A sentence that explains the choice. The radio is described by it, so a screen reader reads it after the name. */
  children: JSX.Element
  class?: string | undefined
}

/** A sentence under the title that explains the choice, muted but at 7:1, and read out after the radio's name */
function ItemDescription(props: ItemDescriptionProps): Element {
  const parts = useChoicePart("description")
  return (
    <span
      {...omit(props, "class")}
      id={parts?.descriptionId}
      data-scope="radio-group"
      data-part="item-description"
      class={choiceDescription({ class: props.class })}
    />
  )
}

export type ItemMediaProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  /** A drawn mark, an `<svg>` shown at 32px, or an `<img>` cropped to a 48px square */
  children: JSX.Element
  class?: string | undefined
}

/**
 * A mark or a small picture above a tile's title, such as a drawing of a drop for drip irrigation. It is decoration:
 * the title names the choice, so it is hidden from assistive technology.
 */
function ItemMedia(props: ItemMediaProps): Element {
  return (
    <span
      {...omit(props, "class")}
      aria-hidden="true"
      data-scope="radio-group"
      data-part="item-media"
      class={choiceMedia({ class: props.class })}
    />
  )
}

export const Item = /* @__PURE__ */ Object.assign(ItemRoot, {
  Text: ItemText,
  Description: ItemDescription,
  Media: ItemMedia,
})

// Tiles fill columns at least 15rem wide, so a phone shows one and a wide page as many as fit
const root = tv({
  variants: {
    variant: {
      row: "flex data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:flex-wrap data-[orientation=horizontal]:gap-x-6 data-[orientation=vertical]:flex-col",
      card: "grid gap-3 data-[orientation=horizontal]:grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))]",
    },
  },
})

const label = tv({
  base: "col-span-full mb-1 block text-base font-semibold tracking-body text-ink data-disabled:text-disabled-ink",
})

// The dot is the control's own pseudo-element, so the ring stays still while the dot springs in. It grows from the
// middle on the pop spring, and goes quicker, shrinking and fading on the exit clock with nothing past its end. Under
// reduced motion `--radio-dot-scale` is 1, so it only fades. Under the pointer an empty circle darkens its edge and a
// chosen one lightens, as a primary button does. A disabled circle is grey whatever its state, which its dot still
// shows. In a tile the ring is the tile's, and the circle sits in its top corner at the end.
const control = tv({
  base: [
    "grid size-7 shrink-0 place-items-center rounded-full border-2 border-strong bg-raised",
    "motion-touch [scale:var(--choice-press,1)] group-hover/row:border-ink",
    "after:size-3 after:rounded-full after:bg-on-primary after:opacity-0 after:scale-(--radio-dot-scale)",
    "after:[transition:scale_var(--duration-exit)_var(--ease-smooth),opacity_var(--duration-exit)_var(--ease-smooth)]",
    "not-data-disabled:data-[state=checked]:border-primary-edge not-data-disabled:data-[state=checked]:bg-primary",
    "data-[state=checked]:after:scale-100 data-[state=checked]:after:opacity-100",
    "data-[state=checked]:after:[transition:scale_var(--duration-pop)_var(--ease-pop),opacity_var(--duration-exit)_var(--ease-smooth)]",
    "group-hover/row:not-data-disabled:not-data-readonly:data-[state=checked]:bg-primary-400",
    "data-invalid:border-danger-text data-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "data-disabled:border-disabled data-disabled:bg-disabled data-disabled:after:bg-disabled-ink",
  ],
  variants: {
    variant: {
      row: [
        "focus-ring [--focus-inset:3px] data-invalid:[--color-focus:var(--color-danger-text)]",
        "not-data-disabled:data-[state=checked]:[--focus-gap:var(--color-surface)]",
      ],
      card: "col-start-2 row-start-1",
    },
  },
})
