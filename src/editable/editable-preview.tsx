import { Editable as Seed } from "@foliag/seeds/editable"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type EditablePreviewProps = Omit<Seed.PreviewProps, "class" | "children"> & {
  class?: string | undefined
}

/**
 * The value as text, its words exactly where the field's will be, in the `Area`'s box. A press on it changes it. The
 * placeholder shows dimmed while it is empty.
 */
export function EditablePreview(props: EditablePreviewProps): Element {
  return <Seed.Preview {...omit(props, "class")} class={preview({ class: props.class })} />
}

const preview = tv({
  base: [
    "col-start-1 row-start-1 flex min-w-0 flex-1 items-center px-4 py-2 break-words outline-none",
    "data-placeholder-shown:text-muted data-disabled:cursor-not-allowed",
  ],
})
