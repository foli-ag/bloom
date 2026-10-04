import { Menu as Seed, useMenuContext } from "@foliag/seeds/menu"
import type { ValidComponent } from "@foliag/seeds/polymorphic"
import { Portal, type JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import type { VariantProps } from "../internal/variants.js"
import { indicatorChevron } from "../internal/disclosure.js"
import { Chevron, Mark, tick } from "../internal/icons.jsx"
import {
  groupLabel,
  option,
  optionIndicator,
  separator,
  panelList,
  sheetPanel,
  sheetPositioner,
} from "../internal/overlay.js"
import { keepOpenForSheetClose, SheetClose, type SheetCloseProps } from "../internal/sheet.jsx"

export type RootProps = Omit<Seed.RootProps, "lazyMount" | "unmountOnExit">

/**
 * Actions on one thing, behind one button: edit, duplicate, delete a field. From 640px they drop down from the
 * button. On a phone they rise from the bottom as a sheet, within reach of the thumb, with a close button at its foot.
 * The arrow keys move through the items and typing a letter jumps to the next one that starts with it.
 *
 * Submenus are not styled: on a phone one sheet would open over another. Group the items instead.
 *
 * @example
 * <Menu.Root onSelect={(details) => run(details.value)}>
 *   <Menu.Trigger as={Button} variant="outline">
 *     Actions <Menu.Indicator />
 *   </Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.List>
 *       <Menu.Item value="modifier">Modifier</Menu.Item>
 *       <Menu.Item value="supprimer" tone="danger">Supprimer</Menu.Item>
 *     </Menu.List>
 *     <Menu.Close as={Button} tone="neutral" variant="outline" block>Fermer</Menu.Close>
 *   </Menu.Content>
 * </Menu.Root>
 */
export function Root(props: RootProps): Element {
  return (
    <Seed.Root
      {...omit(props, "onInteractOutside")}
      lazyMount
      unmountOnExit
      onInteractOutside={keepOpenForSheetClose(props.onInteractOutside)}
    />
  )
}

export type TriggerProps<As extends ValidComponent = "button"> = Seed.TriggerProps<As>

/** Opens and closes the menu. It is announced as opening a menu, and gets focus back when the menu closes. */
export const Trigger: typeof Seed.Trigger.Open = Seed.Trigger.Open

export interface IndicatorProps {
  class?: string | undefined
}

/** A chevron for the trigger, after its words, that turns as the menu opens */
export function Indicator(props: IndicatorProps): Element {
  return (
    <Seed.Indicator as="span" class={indicatorChevron({ class: ["-me-1", props.class] })}>
      <Chevron class="size-5" />
    </Seed.Indicator>
  )
}

export interface ContentProps {
  /** A `Menu.List`, and a `Menu.Close` after it */
  children: JSX.Element
  class?: string | undefined
}

/** The panel that holds the items: a dropdown from 640px, a bottom sheet below */
export function Content(props: ContentProps): Element {
  const api = useMenuContext()
  const state = () => (api().open ? "open" : "closed")
  return (
    <Portal>
      <Seed.Positioner class={sheetPositioner({ holds: "list" })} data-state={state()}>
        <div
          class={sheetPanel({ scroll: "list", class: props.class })}
          data-state={state()}
          // Zag focuses the menu on the frame after the pointer moves onto an item. When a click on that item has
          // closed the menu, focus lands in it as it leaves, and then on nothing once it is gone. It goes back to the
          // trigger instead, where zag sent it.
          onFocusIn={() => {
            const trigger = api().getTriggerProps().id
            if (!api().open && trigger) document.getElementById(trigger)?.focus({ preventScroll: true })
          }}
        >
          {props.children}
        </div>
      </Seed.Positioner>
    </Portal>
  )
}

export type ListProps = Omit<Seed.ContentProps, "class"> & {
  class?: string | undefined
}

/** The items, which scroll inside the panel */
export function List(props: ListProps): Element {
  return <Seed.Content {...omit(props, "class")} class={panelList({ class: props.class })} />
}

type Tone = VariantProps<typeof option>["tone"]

export type ItemProps = Omit<Seed.ItemProps, "class" | "children"> & {
  /** Its words, such as "Modifier" */
  children: JSX.Element
  /** `danger` for an action that destroys something. Its words say so too, as red alone does not. */
  tone?: Tone
  class?: string | undefined
}

/** An action. Choosing it closes the menu and reports its `value` to `onSelect` on the root and on the item. */
function ItemRoot(props: ItemProps): Element {
  return <Seed.Item {...omit(props, "class", "tone")} class={option({ tone: props.tone, class: props.class })} />
}

export type ItemCheckboxProps = Omit<Seed.ItemCheckboxProps, "class" | "children"> & {
  /** Its words, such as "Afficher les parcelles en jachère" */
  children: JSX.Element
  class?: string | undefined
}

/** A setting that is on or off, ticked at its end while on */
function ItemCheckbox(props: ItemCheckboxProps): Element {
  return (
    <Seed.Item.Checkbox {...omit(props, "class", "children")} class={option({ class: props.class })}>
      <span class="min-w-0 flex-1">{props.children}</span>
      <OptionTick />
    </Seed.Item.Checkbox>
  )
}

export type ItemRadioProps = Omit<Seed.ItemRadioProps, "class" | "children"> & {
  /** Its words, such as "Par surface" */
  children: JSX.Element
  class?: string | undefined
}

/** One of the choices of a `Menu.Group.Radio`, ticked at its end while chosen */
function ItemRadio(props: ItemRadioProps): Element {
  return (
    <Seed.Item.Radio {...omit(props, "class", "children")} class={option({ class: props.class })}>
      <span class="min-w-0 flex-1">{props.children}</span>
      <OptionTick />
    </Seed.Item.Radio>
  )
}

function OptionTick(): Element {
  return (
    <Seed.Item.Indicator hidden={false} class={optionIndicator()}>
      <Mark class="size-6">
        <path d={tick} />
      </Mark>
    </Seed.Item.Indicator>
  )
}

export const Item = Object.assign(ItemRoot, { Checkbox: ItemCheckbox, Radio: ItemRadio })

export type GroupProps = Omit<Seed.GroupProps, "class"> & {
  class?: string | undefined
}

function GroupRoot(props: GroupProps): Element {
  return <Seed.Group {...omit(props, "class")} class={props.class} />
}

export type GroupLabelProps = Omit<Seed.GroupLabelProps, "class" | "children"> & {
  /** The heading of the group, such as "Trier" */
  children: JSX.Element
  class?: string | undefined
}

function GroupLabel(props: GroupLabelProps): Element {
  return <Seed.Group.Label {...omit(props, "class")} class={groupLabel({ class: props.class })} />
}

export type GroupRadioProps = Omit<Seed.GroupRadioProps, "class"> & {
  class?: string | undefined
}

/** Choices of which one is on, such as a sort order. It holds `value` and reports changes to `onValueChange`. */
function GroupRadio(props: GroupRadioProps): Element {
  return <Seed.Group.Radio {...omit(props, "class")} class={props.class} />
}

/** Items under a `Menu.Group.Label` */
export const Group = Object.assign(GroupRoot, { Label: GroupLabel, Radio: GroupRadio })

export type SeparatorProps = Omit<Seed.SeparatorProps, "class"> & {
  class?: string | undefined
}

export function Separator(props: SeparatorProps): Element {
  return <Seed.Separator {...omit(props, "class")} class={separator({ class: ["border-0", props.class] })} />
}

export type CloseProps<As extends ValidComponent = "button"> = SheetCloseProps<As>

/**
 * Closes the sheet without choosing, on a phone, and sends focus back to the trigger. From 640px the menu is a
 * dropdown and it is not shown. Render it as a `Button` that spans the sheet:
 * `<Menu.Close as={Button} tone="neutral" variant="outline" block>Fermer</Menu.Close>`.
 */
export function Close<As extends ValidComponent = "button">(props: CloseProps<As>): Element {
  const api = useMenuContext()
  return <SheetClose button={props} onClose={() => api().setOpen(false)} />
}
