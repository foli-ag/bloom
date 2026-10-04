import { Popover as Seed } from "@foliag/seeds/popover"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type PopoverDescriptionProps = Omit<Seed.DescriptionProps, "class"> & {
  class?: string | undefined
}

export function PopoverDescription(props: PopoverDescriptionProps): Element {
  return <Seed.Description {...omit(props, "class")} class={description({ class: props.class })} />
}

const description = tv({ base: "text-base text-muted" })
