import { Drawer as Seed } from "@foliag/seeds/drawer"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type DrawerDescriptionProps = Omit<Seed.DescriptionProps, "class"> & {
  class?: string | undefined
}

/** A sentence or two under the title, read out with it when the drawer opens */
export function DrawerDescription(props: DrawerDescriptionProps): Element {
  return <Seed.Description {...omit(props, "class")} class={description({ class: props.class })} />
}

const description = tv({ base: "text-base text-muted" })
