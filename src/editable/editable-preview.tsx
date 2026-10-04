import { Editable as Seed } from "@foliag/seeds/editable"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"

export type EditablePreviewProps = Omit<Seed.PreviewProps, "class" | "children"> & {
  class?: string | undefined
}

/**
 * The value as text, the size of the field it turns into. A dashed edge under the pointer and the focus ring say it
 * can be changed. The placeholder shows dimmed while it is empty.
 */
export function EditablePreview(props: EditablePreviewProps): Element {
  return <Seed.Preview {...omit(props, "class")} class={preview({ class: props.class })} />
}

const preview = tv({
  base: [
    "flex min-h-12 cursor-text items-center rounded-control border-2 border-dashed border-transparent px-4 py-2",
    "text-base font-medium tracking-body break-words text-ink",
    "transition-colors duration-(--duration-smooth) ease-smooth hover:border-strong focus-ring",
    "data-placeholder-shown:text-muted",
    "data-disabled:cursor-not-allowed data-disabled:text-disabled-ink data-disabled:hover:border-transparent",
  ],
})
