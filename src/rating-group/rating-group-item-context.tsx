import { RatingGroup as Seed } from "@foliag/seeds/rating-group"
import type { Element } from "solid-js"

export type RatingGroupItemContextProps = Seed.ItemContextProps

/** Seeds' own: renders its children with the state of the star around it */
export function RatingGroupItemContext(props: RatingGroupItemContextProps): Element {
  return <Seed.Item.Context {...props} />
}
