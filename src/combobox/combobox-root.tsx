import { Combobox as Seed, type CollectionItem } from "@foliag/seeds/combobox"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import { ListLoadingContext } from "../internal/list-loading.jsx"

export type ComboboxRootProps<T extends CollectionItem = any> = Omit<
  Seed.RootProps<T>,
  "as" | "class" | "lazyMount" | "unmountOnExit" | "translations"
> & {
  /**
   * The options are on their way, such as from a server as the farmer types. The list is marked busy and its `Loading`
   * shows rows of skeleton bars in their place. Set it while the list has nothing to show yet; while it refines results
   * already shown, keep them and leave it off, so the list does not flicker on every key.
   */
  loading?: boolean | undefined
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
 * With `multiple`, the choices show as chips in the field, before the input: put a `ChipGroup` first in the `Control`.
 * The input empties after each choice, and Backspace in an empty input takes the last choice out.
 *
 * @example
 * <Combobox.Root collection={communes()} onInputValueChange={(details) => filter(details.inputValue)}>
 *   <Combobox.Label>Commune</Combobox.Label>
 *   <Combobox.Control>
 *     <Combobox.Input />
 *     <Combobox.Indicator />
 *   </Combobox.Control>
 *   <Combobox.Positioner>
 *     <Combobox.Content>
 *       <For each={communes().items}>
 *         {(item) => (
 *           <Combobox.Item item={item}>
 *             <Combobox.Item.Text>{item.label}</Combobox.Item.Text>
 *             <Combobox.Item.Indicator />
 *           </Combobox.Item>
 *         )}
 *       </For>
 *     </Combobox.Content>
 *     <Combobox.Empty>Aucune commune trouvée</Combobox.Empty>
 *   </Combobox.Positioner>
 * </Combobox.Root>
 */
export function ComboboxRoot<T extends CollectionItem = any>(props: ComboboxRootProps<T>): Element {
  return (
    <ListLoadingContext value={() => props.loading === true}>
      <Seed.Root
        openOnClick
        {...omit(props, "class", "loading")}
        lazyMount
        unmountOnExit
        translations={translations}
        class={fieldRoot({ class: props.class })}
      />
    </ListLoadingContext>
  )
}

/** Zag names its buttons in English. Empty, a name comes from the button's own words. */
const translations = { triggerLabel: "", clearTriggerLabel: "" }
