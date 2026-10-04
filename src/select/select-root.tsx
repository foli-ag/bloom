import { Select as Seed, type CollectionItem } from "@foliag/seeds/select"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import { ListLoadingContext } from "../internal/list-loading.jsx"
import { keepOpenForSheetClose } from "../internal/sheet.jsx"
import { translations } from "./use-select.js"

export type SelectRootProps<T extends CollectionItem = any> = Omit<
  Seed.RootProps<T>,
  "as" | "class" | "lazyMount" | "unmountOnExit" | "translations"
> & {
  /**
   * The options are on their way, such as from a server as the list opens. The list is marked busy and its `Loading`
   * shows rows of skeleton bars in their place, until the app sets it back to `false` with the collection filled.
   */
  loading?: boolean | undefined
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * One choice, or several with `multiple`, from a list too long to show as radios. Its items come from
 * `createListCollection`. From 640px the list drops down from the field. On a phone it rises from the bottom as a
 * sheet, within reach of the thumb, with a `Trigger.Close` at its foot. The list mounts when it opens.
 *
 * Several choices can show as chips in the field, each with a button that takes it out: put a `ChipGroup` and the
 * `Trigger` in a `Control`. Its parts stack with even gaps. `HiddenSelect` carries the value into a form, under `name`.
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
 *
 * <Select.Root collection={cultures} multiple>
 *   <Select.Label>Cultures</Select.Label>
 *   <Select.Control>
 *     <Select.ChipGroup>
 *       {(item) => (
 *         <Select.Chip item={item}>
 *           <Select.Chip.Text>{item.label}</Select.Chip.Text>
 *           <Select.Chip.Trigger>Retirer {item.label}</Select.Chip.Trigger>
 *         </Select.Chip>
 *       )}
 *     </Select.ChipGroup>
 *     <Select.Trigger>
 *       <Select.ValueText placeholder="Choisir des cultures" />
 *       <Select.Indicator />
 *     </Select.Trigger>
 *   </Select.Control>
 *   …
 * </Select.Root>
 */
export function SelectRoot<T extends CollectionItem = any>(props: SelectRootProps<T>): Element {
  return (
    <ListLoadingContext value={() => props.loading === true}>
      <Seed.Root
        {...omit(props, "class", "onInteractOutside", "loading")}
        lazyMount
        unmountOnExit
        translations={translations}
        onInteractOutside={keepOpenForSheetClose(props.onInteractOutside)}
        class={fieldRoot({ class: props.class })}
      />
    </ListLoadingContext>
  )
}
