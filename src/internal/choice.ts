import {
  type Accessor,
  createContext,
  createSignal,
  createUniqueId,
  onCleanup,
  onSettled,
  type Setter,
  useContext,
} from "solid-js"
import { tv } from "tailwind-variants"
import { cardSurface } from "./surface.js"

/**
 * The row of a checkbox, a radio and a switch: the control and its words as one target, the width of its container and
 * at least 48px tall, so a thumb that lands past the end of a short word still hits it. `class="inline-flex"` shrinks
 * it to its words where it sits in a line of text.
 *
 * A box or a circle comes first and is as tall as a line of text, so it sits on the first line of a label that wraps
 * (10px, 28px, 10px for one line). A switch comes last, at the thumb's end of the row, the way phones lay out
 * settings, and stays centered.
 *
 * A finger on the row presses its control in, through `--choice-press`, which the control reads as its scale. A row
 * that is disabled or read-only cannot change, so it does not answer the press as if it would.
 */
export const choiceRow = tv({
  base: [
    "group/row flex min-h-12 pressable text-base font-medium tracking-body text-ink",
    "active:not-data-disabled:not-data-readonly:[--choice-press:var(--press-scale-small)]",
    "data-readonly:cursor-default data-disabled:cursor-not-allowed data-disabled:text-disabled-ink",
  ],
  variants: {
    control: {
      leading: "items-start gap-3 py-2.5",
      trailing: "items-center justify-between gap-4 py-2",
    },
  },
  defaultVariants: { control: "leading" },
})

/**
 * A mark drawn with a stroke, a checkbox's tick or dash and a switch's tick, shown while its row is in that state. Its
 * path needs `pathLength="1"`.
 *
 * It draws in along its path, in step with the box or the knob changing under it. It leaves by fading, on the quicker
 * exit clock: drawn back, its round end would sit on the box as a dot until the spring came to rest. Once it has faded,
 * its dash goes back to the start unseen, ready to draw again. Both are transitions, so a second tap turns it round
 * from where it is.
 */
export const drawnMark = tv({
  base: [
    "opacity-0 [stroke-dasharray:1] [stroke-dashoffset:1]",
    "[transition:opacity_var(--duration-exit)_var(--ease-smooth),stroke-dashoffset_0s_var(--duration-exit)]",
  ],
  variants: {
    shown: {
      checked: [
        "group-data-[state=checked]/row:opacity-100 group-data-[state=checked]/row:[stroke-dashoffset:0]",
        "group-data-[state=checked]/row:[transition:opacity_var(--duration-exit)_var(--ease-smooth),stroke-dashoffset_var(--duration-smooth)_var(--ease-smooth)]",
      ],
      indeterminate: [
        "group-data-[state=indeterminate]/row:opacity-100 group-data-[state=indeterminate]/row:[stroke-dashoffset:0]",
        "group-data-[state=indeterminate]/row:[transition:opacity_var(--duration-exit)_var(--ease-smooth),stroke-dashoffset_var(--duration-smooth)_var(--ease-smooth)]",
      ],
    },
  },
})

/**
 * A choice drawn as a tile, for one that deserves more than a line: a radio or a checkbox with a mark or a picture, a
 * title and a sentence that explains it. The whole tile is the target. Its circle or box sits in the corner at the top
 * end, and its words stack in the column beside it, under the picture if there is one.
 *
 * It is a card (`cardSurface`) with 16px inside its edge, so tiles sit with cards on a page. Chosen, it shows by more
 * than a color: its circle fills with a dot or its box with a tick, its edge turns green and thickens to 3px with a
 * second line inside it, and the tile takes a green tint, light enough that the muted sentence keeps 7:1 on it. A
 * finger presses the whole tile in, as a button goes down, and its edge darkens with the press, as a phone has no hover
 * to show it first. The focus ring is drawn inside the tile's edge, as on a field: zag marks the tile
 * `data-focus-visible` while its hidden input has the keyboard's focus.
 */
export const choiceTile = tv({
  base: [
    cardSurface(),
    "group/row grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 p-5 pressable text-start",
    "text-base font-semibold tracking-body",
    "shadow-[inset_0_0_0_1px_transparent]",
    "[transition:scale_var(--press-duration,var(--duration-pop))_var(--press-ease,var(--ease-pop)),background-color_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth)),border-color_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth)),box-shadow_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth)),color_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth))]",
    "data-[state=unchecked]:hover:border-ink pressing:border-ink pressing:scale-(--press-scale)",
    "not-data-disabled:not-data-invalid:data-[state=checked]:border-primary-edge not-data-disabled:not-data-invalid:data-[state=indeterminate]:border-primary-edge",
    "not-data-disabled:not-data-invalid:data-[state=checked]:shadow-[inset_0_0_0_1px_var(--color-primary-edge)]",
    "not-data-disabled:not-data-invalid:data-[state=indeterminate]:shadow-[inset_0_0_0_1px_var(--color-primary-edge)]",
    "not-data-disabled:data-[state=checked]:bg-[color-mix(in_oklab,var(--color-primary-soft)_60%,var(--color-raised))]",
    "not-data-disabled:data-[state=indeterminate]:bg-[color-mix(in_oklab,var(--color-primary-soft)_60%,var(--color-raised))]",
    "focus-ring",
    "data-invalid:border-danger-text data-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-text)]",
    "data-readonly:cursor-default",
    "data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled-ink",
  ],
})

/**
 * The words of a choice in a column: its title and the sentence under it, or only its words. In a tile the picture
 * comes first in it, and the column takes the tile's first column, beside the circle or the box.
 */
export const choiceWords = tv({
  base: "flex min-w-0 flex-col gap-0.5",
  variants: {
    variant: { row: "", card: "col-start-1 row-start-1" },
  },
  defaultVariants: { variant: "row" },
})

/** The sentence that explains a choice, under its title: muted, and 7:1 on the page, a tile and a chosen tile alike */
export const choiceDescription = tv({
  base: "text-sm font-medium tracking-body text-muted group-data-disabled/row:text-disabled-ink",
})

/**
 * A mark or a small picture at the top of a tile, above its title: a drawn mark at 32px in green, or a photo cropped to
 * a 48px square. It is decoration, as the title names the choice, so it is hidden from assistive technology.
 */
export const choiceMedia = tv({
  base: [
    "mb-2 inline-flex size-12 shrink-0 items-center justify-center self-start overflow-hidden rounded-box text-primary-text",
    "[&>svg]:size-8 [&>img]:size-full [&>img]:object-cover",
    "group-data-disabled/row:text-disabled-ink group-data-disabled/row:grayscale",
  ],
})

/**
 * What the words of a choice are made of, shared by its row or tile and the parts inside it. A title part (a radio's
 * `Item.Text`, a checkbox's `Label`) says it is there, and the control is then named by it alone, where it would
 * otherwise be named by the whole column: with a description in the column, the description would be read in the name.
 * A `Description` says it is there, and the control is described by it. Both write as they mount, from inside a
 * component, which is why their signals allow it.
 */
export interface ChoiceParts {
  titled: Accessor<boolean>
  setTitled: Setter<boolean>
  described: Accessor<boolean>
  setDescribed: Setter<boolean>
  descriptionId: string
}

export const ChoicePartsContext = /* @__PURE__ */ createContext<ChoiceParts | undefined>(undefined)

export function createChoiceParts(): ChoiceParts {
  const [titled, setTitled] = createSignal(false, { ownedWrite: true })
  const [described, setDescribed] = createSignal(false, { ownedWrite: true })
  return { titled, setTitled, described, setDescribed, descriptionId: createUniqueId() }
}

/** Marks a title or a description as there for as long as it is */
export function useChoicePart(kind: "title" | "description"): ChoiceParts | undefined {
  const parts = useContext(ChoicePartsContext)
  const set = kind === "title" ? parts?.setTitled : parts?.setDescribed
  set?.(true)
  onCleanup(() => set?.(false))
  return parts
}

/**
 * The track of a segmented control, a toggle group's or the tabs': a 2px edge that reaches 3:1 against the page,
 * around options 48px tall. Its corners are those of the pill inside, 4px further out, plus its edge, so the curves
 * run side by side. It is a stacking context of its own, so the pill can sit under the options and still over the
 * track's own fill.
 */
export const segmentedTrack = tv({
  base: [
    "relative isolate border-2 border-strong bg-raised [--pill-inset:0.25rem] [--pill-radius:1.25rem]",
    "rounded-[calc(var(--pill-radius)+var(--pill-inset)+2px)]",
  ],
})

/**
 * One option of a segmented control. It does not shrink under the finger, which would pull it off its neighbors and
 * out from over the pill: a tint in the pill's shape fades in behind its words in 90ms, at half strength under the
 * mouse, and its words go down a little (`segmentWords`). The tint is the option's own `::before`, which fades by its
 * opacity, and darkens the pill too when the chosen option is pressed.
 *
 * The focus ring is drawn inside the option, where the pill's edge is, so on the chosen one it takes the edge's place
 * and on the others it shows where the pill would go. It covers no neighbor and nothing outside the track.
 */
export const segment = tv({
  base: [
    "group/segment relative inline-flex min-h-12 min-w-12 pressable items-center justify-center px-5 py-2",
    "rounded-[calc(var(--pill-radius)+var(--pill-inset))] text-base font-semibold tracking-body",
    "before:pointer-events-none before:absolute before:inset-(--pill-inset) before:rounded-(--pill-radius) before:content-['']",
    "before:bg-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] before:opacity-0",
    "before:[transition:opacity_var(--press-duration,var(--duration-smooth))_var(--press-ease,var(--ease-smooth))]",
    "not-data-disabled:hover:before:opacity-50 pressing:before:opacity-100",
    "focus-ring [--focus-inset:calc(var(--pill-inset)+3px)]",
    "transition-[color] duration-(--duration-smooth) ease-smooth",
    "data-disabled:cursor-not-allowed data-disabled:text-disabled-ink",
  ],
})

/** The words of a segment, which go down with the finger in 90ms and come back up on the pop spring */
export const segmentWords = tv({
  base: [
    "relative",
    "[transition:scale_var(--press-duration,var(--duration-pop))_var(--press-ease,var(--ease-pop))]",
    "group-pressing/segment:scale-(--press-scale)",
  ],
})

/**
 * The filled pill that sits behind the chosen option of a segmented control and slides to the next one, as on a
 * phone. It is placed as zag places a tab's indicator: its box is the chosen option's, given by `--left`, `--top`,
 * `--width` and `--height`, and its transition is on only while the choice moves, so nothing slides as the page loads
 * or as the window is resized.
 *
 * Like the bar under a tab, it never animates its size, which the browser would lay out again on every frame and only
 * while the page is idle. The box is pinned at the start and slides by `translate`, and takes its new size at once,
 * unseen. What shows is drawn inside it, 4px in from the option's box: a rounded cap at each end, `::before` and
 * `::after`, and the straight part between them, which stretches by `scale` from its own length to the option's, so
 * the ends stay round as it stretches between options of different widths. The caps carry the whole edge, and the
 * middle, drawn over their inner halves, its two long sides, so the joins never show.
 *
 * All of it is transform on the compositor, and a change of mind half way turns it round from where it is. Under
 * reduced motion it is under the new option at once (`--duration-travel`). Its fill is the soft green and its edge
 * the green one, 3:1 against the track; the words keep their color on it and reach 7:1 on both.
 */
export const pill = tv({
  base: [
    "pointer-events-none absolute !top-0 !left-0 w-(--width) h-(--height) translate-x-(--left) translate-y-(--top)",
    "![--transition-property:translate,scale] [--transition-duration:var(--duration-travel)]",
    "[--transition-timing-function:var(--ease-smooth)]",
    "[--pill-fill:var(--color-primary-soft)] [--pill-edge:var(--color-primary-edge)]",
    "data-disabled:[--pill-fill:var(--color-raised)] data-disabled:[--pill-edge:var(--color-disabled-ink)]",
    "before:absolute before:top-(--pill-inset) before:left-(--pill-inset) before:rounded-(--pill-radius) before:content-['']",
    "after:absolute after:top-(--pill-inset) after:left-(--pill-inset) after:rounded-(--pill-radius) after:content-['']",
    "before:border-2 before:border-(--pill-edge) before:bg-(--pill-fill) after:border-2 after:border-(--pill-edge) after:bg-(--pill-fill)",
    "before:[transition:inherit] after:[transition:inherit]",
    "data-[orientation=horizontal]:before:h-[calc(var(--height)-2*var(--pill-inset))] data-[orientation=horizontal]:before:w-[calc(2*var(--pill-radius))]",
    "data-[orientation=horizontal]:after:h-[calc(var(--height)-2*var(--pill-inset))] data-[orientation=horizontal]:after:w-[calc(2*var(--pill-radius))]",
    "data-[orientation=horizontal]:after:translate-x-[max(0px,calc(var(--width)-2*var(--pill-inset)-2*var(--pill-radius)))]",
    "data-[orientation=vertical]:before:w-[calc(var(--width)-2*var(--pill-inset))] data-[orientation=vertical]:before:h-[calc(2*var(--pill-radius))]",
    "data-[orientation=vertical]:after:w-[calc(var(--width)-2*var(--pill-inset))] data-[orientation=vertical]:after:h-[calc(2*var(--pill-radius))]",
    "data-[orientation=vertical]:after:translate-y-[max(0px,calc(var(--height)-2*var(--pill-inset)-2*var(--pill-radius)))]",
  ],
})

// From the middle of one cap to the middle of the other, 6rem long before it stretches. `tan(atan2())` turns the ratio
// of two lengths into the plain number `scale` takes.
export const pillMiddle = tv({
  base: [
    "absolute z-[1] border-(--pill-edge) bg-(--pill-fill) [transition:inherit]",
    "group-data-[orientation=horizontal]/pill:top-(--pill-inset) group-data-[orientation=horizontal]/pill:left-[calc(var(--pill-inset)+var(--pill-radius))]",
    "group-data-[orientation=horizontal]/pill:h-[calc(var(--height)-2*var(--pill-inset))] group-data-[orientation=horizontal]/pill:w-24",
    "group-data-[orientation=horizontal]/pill:border-y-2 group-data-[orientation=horizontal]/pill:origin-left",
    "group-data-[orientation=horizontal]/pill:scale-x-[tan(atan2(max(0px,calc(var(--width)-2*var(--pill-inset)-2*var(--pill-radius))),6rem))]",
    "group-data-[orientation=vertical]/pill:left-(--pill-inset) group-data-[orientation=vertical]/pill:top-[calc(var(--pill-inset)+var(--pill-radius))]",
    "group-data-[orientation=vertical]/pill:w-[calc(var(--width)-2*var(--pill-inset))] group-data-[orientation=vertical]/pill:h-24",
    "group-data-[orientation=vertical]/pill:border-x-2 group-data-[orientation=vertical]/pill:origin-top",
    "group-data-[orientation=vertical]/pill:scale-y-[tan(atan2(max(0px,calc(var(--height)-2*var(--pill-inset)-2*var(--pill-radius))),6rem))]",
  ],
})

/**
 * Behind the pill of a control zag gives no indicator, a toggle group's: it fades the pill out when nothing is chosen
 * and in where the next choice lands, without sliding from where it was. It fades only once the control has been on
 * the screen for two frames, so a pill there from the start is simply there.
 */
export const pillPresence = tv({
  base: [
    "pointer-events-none absolute inset-0 -z-10 opacity-0 data-[state=on]:opacity-100",
    "data-settled:[transition:opacity_var(--duration-exit)_var(--ease-smooth)] data-settled:data-[state=on]:[transition:opacity_var(--duration-smooth)_var(--ease-smooth)]",
  ],
})

interface Box {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Places a `pill` for a control that zag gives no indicator, in the way zag places a tab's: it finds the chosen option
 * with `find` inside the track, the parent of the element `ref` is given, and measures it again whenever an option
 * changes state or size. The pill's transition is on only from the moment the choice moves from one option to another
 * until the slide ends, so it does not slide as the page loads, when fonts arrive, or when a choice appears from none.
 */
export function createPill(find: (track: HTMLElement) => HTMLElement | null) {
  const [box, setBox] = createSignal<Box | null>(null, {
    ownedWrite: true,
    equals: (a, b) =>
      a === b || (!!a && !!b && a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height),
  })
  const [moving, setMoving] = createSignal(false, { ownedWrite: true })
  const [settled, setSettled] = createSignal(false, { ownedWrite: true })
  const [shown, setShown] = createSignal(false, { ownedWrite: true })
  let presence: HTMLElement | undefined
  let shape: HTMLElement | undefined
  onSettled(() => {
    const track = presence?.parentElement
    if (!track) return
    let chosen: HTMLElement | null = null
    let measured = false
    const resize = new ResizeObserver(() => measure())
    const measure = () => {
      const next = find(track)
      if (next !== chosen) {
        // From one option to another it slides; from none, or on the first measure, it is simply there
        setMoving(measured && chosen !== null && next !== null)
        chosen = next
      }
      measured = true
      for (const child of track.children) resize.observe(child)
      setShown(next !== null)
      if (next) setBox({ x: next.offsetLeft, y: next.offsetTop, width: next.offsetWidth, height: next.offsetHeight })
    }
    const mutations = new MutationObserver(measure)
    mutations.observe(track, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-state"] })
    resize.observe(track)
    measure()
    const end = (event: TransitionEvent) => {
      if (event.target === shape && event.propertyName === "translate") setMoving(false)
    }
    shape?.addEventListener("transitionend", end)
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setSettled(true))
    })
    return () => {
      mutations.disconnect()
      resize.disconnect()
      shape?.removeEventListener("transitionend", end)
      cancelAnimationFrame(frame)
    }
  })
  return {
    presence: (element: HTMLElement) => (presence = element),
    shape: (element: HTMLElement) => (shape = element),
    shown,
    settled,
    style: (): Record<string, string> => {
      const at = box()
      const animate = moving()
      return {
        "--left": `${at?.x ?? 0}px`,
        "--top": `${at?.y ?? 0}px`,
        "--width": `${at?.width ?? 0}px`,
        "--height": `${at?.height ?? 0}px`,
        "transition-property": animate ? "var(--transition-property)" : "none",
        "transition-duration": animate ? "var(--transition-duration)" : "0ms",
        "transition-timing-function": "var(--transition-timing-function)",
      }
    },
  }
}
