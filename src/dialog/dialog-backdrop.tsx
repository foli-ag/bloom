import type { Element } from "solid-js"
import { tv } from "../internal/variants.js"
import { DrawerBackdrop, type DrawerBackdropProps } from "../drawer/drawer-backdrop.jsx"

export type DialogBackdropProps = DrawerBackdropProps

/**
 * The dim over the page, the drawer's, which clears as a sheet is swiped away. It is drawn at the end of `<body>`, so
 * nothing the dialog sits in can clip it.
 */
export function DialogBackdrop(props: DialogBackdropProps): Element {
  return <DrawerBackdrop {...props} class={backdrop({ class: props.class })} />
}

// It dims on the clock of the sheet, and from 640px on the card's, so the two arrive together
const backdrop = tv({ base: "sm:[--duration-sheet:var(--duration-smooth)]" })
