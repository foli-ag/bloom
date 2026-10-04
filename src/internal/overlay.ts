import { tv } from "tailwind-variants"

/**
 * What the floating parts share. Positioning is zag's: it sets `position`, `top`, `left` and a `transform` on the
 * positioner, plus `--transform-origin`, `--reference-width` and `--available-height`, and takes the positioner's
 * `z-index` from the panel inside it.
 *
 * A select, a menu or a popover hangs off its trigger from 640px up. On a phone it becomes a bottom sheet, because a
 * small panel under a thumb is hard to hit and a list drawn from the bottom is within reach of one hand. For the
 * sheet the positioner turns into the whole screen: it dims it and holds the panel at the bottom, and a press on the
 * dim is a press outside, which closes it. The `!` beats zag's inline styles. A drag that starts on the dim does not
 * scroll the page behind it.
 */
export const sheetPositioner = tv({
  base: [
    "max-sm:fixed! max-sm:inset-0! max-sm:z-50! max-sm:flex max-sm:min-w-0! max-sm:transform-none!",
    "max-sm:pointer-events-auto! max-sm:touch-none max-sm:flex-col max-sm:justify-end max-sm:bg-scrim",
    "max-sm:data-[state=open]:animate-fade-in max-sm:data-[state=closed]:animate-fade-out",
  ],
})

/**
 * The panel: as wide as its trigger at least from 640px, and the width of the screen below, rising from the bottom
 * edge. Its `data-state` follows the open state. It scrolls itself, or holds a list that does.
 */
export const sheetPanel = tv({
  base: [
    "z-50 flex flex-col border-2 border-strong bg-raised text-ink shadow-overlay outline-none",
    "sm:max-h-[min(28rem,var(--available-height,28rem))] sm:max-w-[calc(100vw-2rem)] sm:min-w-(--reference-width)",
    "sm:origin-(--transform-origin) sm:rounded-card",
    "sm:data-[state=open]:animate-overlay-in sm:data-[state=closed]:animate-overlay-out",
    "max-sm:max-h-[85dvh] max-sm:rounded-t-card max-sm:border-x-0 max-sm:border-b-0",
    "max-sm:pb-[env(safe-area-inset-bottom)]",
    "max-sm:data-[state=open]:animate-sheet-in max-sm:data-[state=closed]:animate-sheet-out",
  ],
  variants: {
    scroll: {
      panel: "overflow-y-auto overscroll-contain",
      list: "overflow-hidden",
    },
  },
})

/**
 * The list inside a panel, which scrolls on its own, apart from what sits below it. The panel around it animates, so
 * the list holds still through the exit and is unmounted once that ends. A list with no rows is hidden: a listbox
 * must hold options, and the panel says why it is empty instead.
 */
export const panelList = tv({
  base: [
    "min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 outline-none",
    "data-[state=closed]:animate-hold data-empty:hidden",
  ],
})

/**
 * A panel that drops down from a field at every width: a combobox's. On a phone the keyboard covers the bottom of the
 * screen, where a sheet would be.
 */
export const dropdownPanel = tv({
  base: [
    "z-50 flex flex-col overflow-hidden rounded-card border-2 border-strong bg-raised text-ink shadow-overlay",
    "origin-(--transform-origin) min-w-(--reference-width) max-w-[calc(100vw-2rem)]",
    "max-h-[min(20rem,var(--available-height,20rem))]",
    "data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out",
  ],
})

/**
 * A row in a list of choices: select, combobox, menu. It is highlighted at once as the finger or the arrow keys
 * reach it, with a ring as well as a tint, as the tint alone is faint. A ticked row's tick sits at its end.
 */
export const option = tv({
  base: [
    "relative flex min-h-12 pressable items-center gap-3 rounded-control px-3 py-2 text-start",
    "text-base font-medium tracking-body text-ink",
    "data-highlighted:bg-primary-soft data-highlighted:outline-2 data-highlighted:-outline-offset-2",
    "data-highlighted:outline-focus",
    "data-[state=checked]:font-semibold",
    "data-disabled:cursor-not-allowed data-disabled:text-disabled-ink",
  ],
  variants: {
    tone: {
      neutral: "",
      danger: [
        "text-danger-text data-highlighted:bg-danger-soft data-highlighted:outline-danger-text",
        "data-disabled:text-disabled-ink",
      ],
    },
  },
  defaultVariants: { tone: "neutral" },
})

/** The indicator at the end of a chosen row, holding a tick that pops in as the row is chosen */
export const optionIndicator = tv({ base: "ms-auto flex shrink-0 text-primary-text" })

/** The text of a row, which takes the room left by the tick */
export const optionText = tv({ base: "min-w-0 flex-1" })

export const groupLabel = tv({
  base: "px-3 pt-3 pb-1 text-sm font-semibold tracking-body text-muted",
})

export const separator = tv({ base: "mx-1 my-2 h-0.5 bg-border" })

/**
 * The buttons at the foot of a dialog or a popover. On a phone they stack at full width, the last one at the bottom
 * where the thumb rests. From 640px they sit in a row at the end.
 */
export const actions = tv({ base: "mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end" })
