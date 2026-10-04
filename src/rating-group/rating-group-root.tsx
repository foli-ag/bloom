import { RatingGroup as Seed } from "@foliag/seeds/rating-group"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import type { RatingGroupTranslations } from "./use-rating-group.js"

export type RatingGroupRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** The name a screen reader gives each item, such as "3 sur 5" */
  translations: RatingGroupTranslations
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A mark from 1 to `count`, given with stars, such as how well a variety did on a parcel. A tap on a star gives that
 * mark; with `allowHalf`, a tap on its first half gives a half mark. It is a radio group: the arrow keys move the mark,
 * and `HiddenInput` carries it into a form under `name`.
 *
 * @example
 * <RatingGroup.Root name="levee" count={5} translations={{ ratingValueText: (index) => `${index} sur 5` }}>
 *   <RatingGroup.Label>Qualité de la levée</RatingGroup.Label>
 *   <RatingGroup.Control />
 *   <RatingGroup.HiddenInput />
 * </RatingGroup.Root>
 */
export function RatingGroupRoot(props: RatingGroupRootProps): Element {
  return <Seed.Root {...omit(props, "class")} class={fieldRoot({ class: props.class })} />
}
