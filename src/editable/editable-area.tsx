import { Editable as Seed } from "@foliag/seeds/editable"
import { createSignal, omit, onSettled, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { fieldFrame } from "../internal/field.js"

export type EditableAreaProps = Omit<Seed.AreaProps, "class"> & {
  class?: string | undefined
}

/**
 * The value's box: the preview or the field, and the `Control` with its buttons at the end. At rest it is quiet, a pale
 * edge round the words and a pencil beside them that says they can be changed, with no hover needed. As editing starts
 * the box firms up into a field round the same words, which do not move, and the pencil gives way to a tick and a cross.
 * It takes the field's states as one control: the ring while the text has the focus, the invalid line, greyed when
 * disabled.
 *
 * Once its first frame is on the screen, it marks itself settled: buttons that appear from then on pop in, and a field
 * open from the start is simply there.
 */
export function EditableArea(props: EditableAreaProps): Element {
  const [settled, setSettled] = createSignal(false)
  // Zag starts once the page has settled too, and only then shows a field that is open from the start. Two frames on,
  // that field has been drawn without easing.
  onSettled(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setSettled(true))
    })
    return () => cancelAnimationFrame(frame)
  })
  return (
    <Seed.Area
      {...omit(props, "class")}
      data-settled={settled() ? "" : undefined}
      class={fieldFrame({ class: [area(), props.class] })}
    />
  )
}

// The box at rest is the quiet edge on the page's ground, darker under the pointer. Editing (`data-focus`) it takes the
// field's own edge and ground.
const area = tv({
  base: [
    "group/area min-w-0 cursor-text",
    "not-data-focus:border-border not-data-focus:bg-transparent not-data-focus:hover:border-strong",
  ],
})
