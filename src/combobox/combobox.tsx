import { Combobox as Seed, useComboboxContext, type CollectionItem } from "@foliag/seeds/combobox"
import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { Portal, type JSX } from "@solidjs/web"
import { omit, Show, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { triggerChevron } from "../internal/disclosure.js"
import { Chevron, Mark, tick } from "../internal/icons.jsx"
import { dropdownPanel, groupLabel, option, optionIndicator, panelList } from "../internal/overlay.js"

export type RootProps<T extends CollectionItem = any> = Omit<
  Seed.RootProps<T>,
  "as" | "class" | "lazyMount" | "unmountOnExit" | "translations"
> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A choice from a list too long to scroll through, narrowed down by typing: a commune, a variety, a product. The app
 * filters the collection as `onInputValueChange` reports what was typed. A tap on the field opens the list.
 *
 * The list drops down from the field at every width. On a phone the keyboard covers the bottom of the screen, so a
 * bottom sheet would sit under it. Give the page `interactive-widget=resizes-content` in its viewport meta, so the
 * list measures the room left above the keyboard.
 *
 * @example
 * <Combobox.Root collection={communes()} onInputValueChange={(details) => filter(details.inputValue)}>
 *   <Combobox.Label>Commune</Combobox.Label>
 *   <Combobox.Input />
 *   <Combobox.Content>
 *     <Combobox.List>
 *       <For each={communes().items}>{(item) => <Combobox.Item item={item}>{item.label}</Combobox.Item>}</For>
 *     </Combobox.List>
 *     <Combobox.Empty>Aucune commune trouvée</Combobox.Empty>
 *   </Combobox.Content>
 * </Combobox.Root>
 */
export function Root<T extends CollectionItem = any>(props: RootProps<T>): Element {
  return (
    <Seed.Root
      openOnClick
      {...omit(props, "class")}
      lazyMount
      unmountOnExit
      // Zag names its buttons in English. Empty, a name comes from the button's own words.
      translations={{ triggerLabel: "", clearTriggerLabel: "" }}
      class={root({ class: props.class })}
    />
  )
}

export type LabelProps = Omit<Seed.LabelProps, "class" | "children"> & {
  /** What is looked for, such as "Commune". It names the field, so it is required. */
  children: JSX.Element
  class?: string | undefined
}

export function Label(props: LabelProps): Element {
  return <Seed.Label {...omit(props, "class")} class={label({ class: props.class })} />
}

export type InputProps = Omit<Seed.InputProps, "class"> & {
  class?: string | undefined
}

/**
 * The field, 48px tall, with a chevron that turns as the list opens. The chevron is only a sign: the whole field
 * opens the list, and the arrow keys move through it while focus stays in the field.
 */
export function Input(props: InputProps): Element {
  return (
    <Seed.Control class="group/trigger relative">
      <Seed.Input {...omit(props, "class")} class={input({ class: props.class })} />
      <Chevron class={triggerChevron({ class: "pointer-events-none absolute end-4 top-1/2 -mt-2.5 text-ink" })} />
    </Seed.Control>
  )
}

export type ClearProps<As extends ValidComponent = "button"> = Seed.TriggerClearProps<As>

/**
 * Empties the choice and the field, and is hidden while nothing is chosen. It is a bare button that takes its look
 * from what it renders as, usually a quiet `Button` with its words:
 * `<Combobox.Clear as={Button} variant="ghost">Effacer</Combobox.Clear>`.
 */
export const Clear: typeof Seed.Trigger.Clear = Seed.Trigger.Clear

export interface ContentProps {
  /** A `Combobox.List`, and a `Combobox.Empty` after it */
  children: JSX.Element
  class?: string | undefined
}

/** The panel under the field, at least as wide as it, and only as tall as the room below it */
export function Content(props: ContentProps): Element {
  const api = useComboboxContext()
  return (
    <Portal>
      <Seed.Positioner>
        <div class={dropdownPanel({ class: props.class })} data-state={api().open ? "open" : "closed"}>
          {props.children}
        </div>
      </Seed.Positioner>
    </Portal>
  )
}

export type ListProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/** The rows, which scroll inside the panel. It is hidden while nothing matches. */
export function List(props: ListProps): Element {
  return <Seed.Content {...omit(props, "class")} class={panelList({ class: props.class })} />
}

export type ItemProps = Omit<Seed.ItemProps, "class" | "children"> & {
  /** Its words, usually the item's label */
  children: JSX.Element
  class?: string | undefined
}

/** A row of the list, ticked at its end while chosen */
export function Item(props: ItemProps): Element {
  return (
    <Seed.Item {...omit(props, "class", "children")} class={option({ class: props.class })}>
      <Seed.Item.Text class="min-w-0 flex-1">{props.children}</Seed.Item.Text>
      <Seed.Item.Indicator class={optionIndicator()}>
        <Mark class="size-6 animate-pop-in">
          <path d={tick} />
        </Mark>
      </Seed.Item.Indicator>
    </Seed.Item>
  )
}

export interface EmptyProps {
  /** What to say when nothing matches, such as "Aucune commune trouvée" */
  children: JSX.Element
  class?: string | undefined
}

/**
 * Shown in place of the rows while nothing matches what was typed. It is a status, so a screen reader says it as it
 * appears, while focus stays in the field.
 */
export function Empty(props: EmptyProps): Element {
  const api = useComboboxContext()
  return (
    <div role="status">
      <Show when={api().collection.size === 0}>
        <p class={empty({ class: props.class })}>{props.children}</p>
      </Show>
    </div>
  )
}

export type GroupProps = Omit<Seed.GroupProps, "class"> & {
  class?: string | undefined
}

function GroupRoot(props: GroupProps): Element {
  return <Seed.Group {...omit(props, "class")} class={props.class} />
}

export type GroupLabelProps = Omit<Seed.GroupLabelProps, "class" | "children"> & {
  /** The heading of the group */
  children: JSX.Element
  class?: string | undefined
}

function GroupLabel(props: GroupLabelProps): Element {
  return <Seed.Group.Label {...omit(props, "class")} class={groupLabel({ class: props.class })} />
}

/** Items under a heading. Give the group an `id` and its label the same `htmlFor`. */
export const Group = Object.assign(GroupRoot, { Label: GroupLabel })

const root = tv({ base: "grid gap-2" })

const label = tv({
  base: "text-base font-semibold tracking-body text-ink data-disabled:text-disabled-ink",
})

// The same field as `Input`, with room at its end for the chevron
const input = tv({
  base: [
    "block min-h-12 w-full rounded-control border-2 border-strong bg-raised py-2 ps-4 pe-12 text-base font-medium",
    "tracking-body text-ink placeholder:text-muted",
    "transition-colors duration-(--duration-smooth) ease-smooth hover:border-ink focus-visible:border-ink focus-ring",
    "data-[state=open]:border-ink",
    "aria-invalid:border-danger-text aria-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-ink",
  ],
})

const empty = tv({ base: "px-5 py-4 text-base text-muted" })
