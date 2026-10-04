import { Select as Seed, type CollectionItem } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import { keepOpenForSheetClose } from "../internal/sheet.jsx"
import { translations } from "./use-select.js"

export type SelectRootProps<T extends CollectionItem = any> = Omit<
  Seed.RootProps<T>,
  "as" | "class" | "lazyMount" | "unmountOnExit" | "translations"
> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * One choice, or several with `multiple`, from a list too long to show as radios. Its items come from
 * `createListCollection`. From 640px the list drops down from the field. On a phone it rises from the bottom as a
 * sheet, within reach of the thumb, with a `Trigger.Close` at its foot. The list mounts when it opens.
 *
 * Its parts stack with even gaps. `HiddenSelect` carries the value into a form, under `name`.
 *
 * @example
 * const cultures = createListCollection({ items: [{ label: "Blé tendre", value: "ble" }, …] })
 *
 * <Select.Root collection={cultures} name="culture">
 *   <Select.Label>Culture</Select.Label>
 *   <Select.Trigger>
 *     <Select.ValueText placeholder="Choisir une culture" />
 *     <Select.Indicator />
 *   </Select.Trigger>
 *   <Select.Positioner>
 *     <Select.Content>
 *       <For each={cultures.items}>
 *         {(item) => (
 *           <Select.Item item={item}>
 *             <Select.Item.Text>{item.label}</Select.Item.Text>
 *             <Select.Item.Indicator />
 *           </Select.Item>
 *         )}
 *       </For>
 *     </Select.Content>
 *     <Select.Trigger.Close as={Button} tone="neutral" variant="outline" block>Fermer</Select.Trigger.Close>
 *   </Select.Positioner>
 *   <Select.HiddenSelect />
 * </Select.Root>
 */
export function SelectRoot<T extends CollectionItem = any>(props: SelectRootProps<T>): Element {
  return (
    <Seed.Root
      {...omit(props, "class", "onInteractOutside")}
      lazyMount
      unmountOnExit
      translations={translations}
      onInteractOutside={keepOpenForSheetClose(props.onInteractOutside)}
      class={fieldRoot({ class: props.class })}
    />
  )
}
