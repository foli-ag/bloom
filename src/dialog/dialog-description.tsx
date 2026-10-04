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

// Right under the title it sits half a gap closer, so the two read as one heading above what follows
const description = tv({
  base: "text-base text-muted [[data-scope=dialog][data-part=content]>[data-part=title]+&]:-mt-2",
})
