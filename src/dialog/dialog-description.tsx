import { Dialog as Seed } from "@foliag/seeds/dialog"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type DialogDescriptionProps = Omit<Seed.DescriptionProps, "class"> & {
  class?: string | undefined
}

/** A sentence or two under the title, read out with it when the dialog opens */
export function DialogDescription(props: DialogDescriptionProps): Element {
  return <Seed.Description {...omit(props, "class")} class={description({ class: props.class })} />
}

const description = tv({ base: "text-base text-muted" })
