import { RatingGroup as Seed } from "@foliag/seeds/rating-group"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"

export type RatingGroupRootProviderProps = Omit<Seed.RootProviderProps, "class"> & {
  class?: string | undefined
}

/** A root for a rating made with `useRatingGroup`, whose state the app then reads and sets from outside it. It looks like `Root`. */
export function RatingGroupRootProvider(props: RatingGroupRootProviderProps): Element {
  return <Seed.RootProvider {...omit(props, "class")} class={fieldRoot({ class: props.class })} />
}
