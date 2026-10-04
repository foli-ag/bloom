import { Drawer as Seed } from "@foliag/seeds/drawer"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type DrawerDescriptionProps = Omit<Seed.DescriptionProps, "class"> & {
  class?: string | undefined
}

/** A sentence or two under the title, read out with it when the drawer opens */
export function DrawerDescription(props: DrawerDescriptionProps): Element {
  return <Seed.Description {...omit(props, "class")} class={description({ class: props.class })} />
}

// Right under the title it sits half a gap closer, so the two read as one heading above what follows
const description = tv({
  base: "text-base text-muted [[data-scope=drawer][data-part=content]>[data-part=title]+&]:-mt-2",
})
