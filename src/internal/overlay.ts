import { tv } from "./variants.js"

/**
 * What the floating parts share. Positioning is zag's: it sets `position`, `top`, `left` and a `transform` on the
 * positioner, plus `--transform-origin`, `--reference-width` and `--available-height`, and takes the positioner's
 * `z-index` from the panel inside it.
 *
 * A floating panel comes out of its trigger: the panel fades in and grows from the trigger's side, which zag sets as
 * `--transform-origin`, while its positioner drifts it from that side (`presence-drift`). Presses go to the panel and
 * never to the positioner around it, which would take those meant for the page while the panel leaves.
 *
 * The drift is `--drift`, half the enter distance unless a part says otherwise: the panel drops a little from under
 * its trigger, rises from above it and slides out sideways from beside it. Zag names the side the panel landed on,
 * after any flip, on the content part, which is the positioner's child for a popover, a tooltip or a hover card, and
 * the list in that child for a select, a menu or a combobox. Only that part is read, so a trigger inside the panel,
 * which zag marks with a side too, is never taken for it.
 */
const fromTrigger = {
  content: [
    "[--drift:calc(var(--enter-distance)*0.5)] [--presence-from:0_calc(var(--drift)*-1)]",
    "has-[>[data-side=top]]:[--presence-from:0_var(--drift)]",
    "has-[>[data-side=left]]:[--presence-from:var(--drift)_0]",
    "has-[>[data-side=right]]:[--presence-from:calc(var(--drift)*-1)_0]",
  ],
  list: [
    "[--drift:calc(var(--enter-distance)*0.5)] [--presence-from:0_calc(var(--drift)*-1)]",
    "has-[>*>[data-side=top]]:[--presence-from:0_var(--drift)]",
    "has-[>*>[data-side=left]]:[--presence-from:var(--drift)_0]",
    "has-[>*>[data-side=right]]:[--presence-from:calc(var(--drift)*-1)_0]",
  ],
}

/** The positioner of a panel that floats at every width: a combobox's, a tooltip's, a hover card's */
export const floatingPositioner = tv({
  base: "pointer-events-none presence-drift",
  variants: {
    holds: {
      content: fromTrigger.content,
      list: fromTrigger.list,
    },
  },
})

/** A floating panel, which fades and grows while its positioner drifts it, so it has no drift of its own */
export const floatingPanel = "pointer-events-auto presence-overlay [--presence-from:0_0]"

/**
 * A select, a menu or a popover hangs off its trigger from 640px up. On a phone it becomes a bottom sheet, because a
 * small panel under a thumb is hard to hit and a list drawn from the bottom is within reach of one hand. For the
 * sheet the positioner turns into the whole screen: it dims it and holds the panel at the bottom, and a press on the
 * dim is a press outside, which closes it. The `!` beats zag's inline styles. A drag that starts on the dim does not
 * scroll the page behind it. Once the sheet is on its way out, a press goes through the dim to the page.
 *
 * The dim is drawn behind the sheet by the positioner's `::before`, which fades in and out on its own. Faded as a
 * whole, the positioner would fade the sheet inside it too, and the sheet would rise as a pale ghost of itself.
 */
export const sheetPositioner = tv({
  base: [
    "pointer-events-none sm:presence-drift",
    "max-sm:fixed! max-sm:inset-0! max-sm:z-50! max-sm:flex max-sm:min-w-0! max-sm:transform-none!",
    "max-sm:touch-none max-sm:flex-col max-sm:justify-end max-sm:data-[state=open]:pointer-events-auto!",
    "max-sm:before:fixed max-sm:before:inset-0 max-sm:before:-z-10 max-sm:before:bg-scrim",
    "max-sm:before:transition-opacity max-sm:before:duration-(--duration-smooth) max-sm:before:ease-smooth",
    "max-sm:before:starting:opacity-0",
    "max-sm:data-[state=closed]:before:opacity-0 max-sm:data-[state=closed]:before:duration-(--duration-exit)",
  ],
  variants: {
    holds: {
      content: fromTrigger.content,
      list: fromTrigger.list,
    },
  },
})

/**
 * The panel: as wide as its trigger at least from 640px, and the width of the screen below, rising from the bottom
 * edge. Its `data-state` follows the open state, and a change of mind half way turns it round from where it is. It
 * scrolls itself, or holds a list that does. The sheet slides in and out solid, as the dialog's does, since it comes
 * from off the screen, and only fades under reduced motion.
 */
export const sheetPanel = tv({
  base: [
    "pointer-events-auto z-50 flex flex-col border-2 border-strong bg-raised text-ink shadow-overlay outline-none",
    "sm:max-h-[min(28rem,var(--available-height,28rem))] sm:max-w-[calc(100vw-2rem)] sm:min-w-(--reference-width)",
    "sm:origin-(--transform-origin) sm:rounded-card sm:presence-overlay [--presence-from:0_0]",
    "max-sm:max-h-[85dvh] max-sm:rounded-t-card max-sm:border-x-0 max-sm:border-b-0",
    "max-sm:pb-[env(safe-area-inset-bottom)] max-sm:presence-sheet",
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
 * the list holds still through the exit and is unmounted once that ends. A list with no rows is hidden, as a listbox
 * must hold options and the panel says why it is empty instead. It is hidden from sight and not with `display: none`,
 * which zag reads as nothing to wait for: the panel would vanish on the spot instead of leaving.
 *
 * While the options load (`aria-busy`), the list folds to nothing and the rows of skeleton bars below it stand in for
 * it. It stays where it is, as zag focuses a select's list as it opens.
 */
export const panelList = tv({
  base: [
    "min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 outline-none",
    "data-[state=closed]:animate-hold data-empty:invisible data-empty:absolute",
    "aria-busy:h-0 aria-busy:flex-none aria-busy:overflow-hidden aria-busy:p-0",
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
    floatingPanel,
  ],
})

/**
 * A row in a list of choices: select, combobox, menu. It is highlighted at once as the pointer or the arrow keys reach
 * it, with a ring as well as a tint, as the tint alone is faint, and tinted at once under a finger, which zag does not
 * highlight. The tint fades from the row they leave, so a quick pass down the list leaves a short soft trail and never
 * a lag. A ticked row's tick sits at its end.
 */
export const option = tv({
  base: [
    "relative flex min-h-12 pressable items-center gap-3 rounded-box px-3 py-2 text-start",
    "text-base font-medium tracking-body text-ink",
    "transition-[background-color] duration-(--duration-exit) ease-smooth",
    "data-highlighted:bg-primary-soft data-highlighted:duration-0",
    "data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-focus",
    "not-data-disabled:active:bg-primary-soft not-data-disabled:active:duration-0",
    "data-[state=checked]:font-semibold",
    "data-disabled:cursor-not-allowed data-disabled:text-disabled-ink",
  ],
  variants: {
    tone: {
      neutral: "",
      danger: [
        "text-danger-text data-highlighted:bg-danger-soft data-highlighted:outline-danger-text",
        "not-data-disabled:active:bg-danger-soft data-disabled:text-disabled-ink",
      ],
    },
  },
  defaultVariants: { tone: "neutral" },
})

/**
 * The indicator at the end of a row, holding the tick, which pops in as the row is chosen and fades as it is
 * unchosen. Zag hides an unchosen row's indicator, and the parts keep it laid out instead (`hidden={false}`), empty,
 * so ticking a row never moves its words, and its own `data-state` drives the tick. A list that opens on a chosen row
 * shows the tick still, as nothing changed.
 */
export const optionIndicator = tv({
  base: [
    "ms-auto flex shrink-0 text-primary-text",
    "transition-[scale,opacity] duration-(--duration-pop) ease-pop",
    "data-[state=unchecked]:scale-(--pop-in-scale) data-[state=unchecked]:opacity-0",
    "data-[state=unchecked]:duration-(--duration-exit) data-[state=unchecked]:ease-smooth",
  ],
})

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
