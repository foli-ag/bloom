// What the foundations stories and their tests measure: the colors a browser actually paints, in the setting the
// stories ask for, never the values written in theme.css. That is what catches a token that stops resolving.

/** 8-bit sRGB */
export type Rgb = readonly [red: number, green: number, blue: number]

/** A pair of tokens and the ratio between them that WCAG asks for: 7 for text (AAA), 3 for an edge or ring */
export interface Pair {
  name: string
  /** The foreground token, such as `--color-ink` */
  front: string
  /** The ground it sits on */
  ground: string
  minimum: 3 | 7
}

/** What a farmer can switch, or the system can switch for them */
export interface Setting {
  theme: "light" | "dark"
  contrast: "normal" | "more"
}

export const settings: readonly Setting[] = [
  { theme: "light", contrast: "normal" },
  { theme: "dark", contrast: "normal" },
  { theme: "light", contrast: "more" },
  { theme: "dark", contrast: "more" },
]

export const pairs: readonly Pair[] = [
  { name: "Ink on the page", front: "--color-ink", ground: "--color-surface", minimum: 7 },
  { name: "Ink on a card", front: "--color-ink", ground: "--color-raised", minimum: 7 },
  { name: "Muted text on the page", front: "--color-muted", ground: "--color-surface", minimum: 7 },
  { name: "Muted text on a card", front: "--color-muted", ground: "--color-raised", minimum: 7 },
  {
    name: "Ink on a soft gray button or a hovered row",
    front: "--color-ink",
    ground: "--color-neutral-soft",
    minimum: 7,
  },
  { name: "Ink on a highlighted option", front: "--color-ink", ground: "--color-primary-soft", minimum: 7 },
  { name: "Edge of an input, on the page", front: "--color-strong", ground: "--color-surface", minimum: 3 },
  { name: "Edge of an input, on a card", front: "--color-strong", ground: "--color-raised", minimum: 3 },
  { name: "Focus ring, on the page", front: "--color-focus", ground: "--color-surface", minimum: 3 },
  { name: "Focus ring, on a card", front: "--color-focus", ground: "--color-raised", minimum: 3 },
  { name: "Primary button label", front: "--color-on-primary", ground: "--color-primary", minimum: 7 },
  { name: "Green text on the page", front: "--color-primary-text", ground: "--color-surface", minimum: 7 },
  { name: "Green text on a soft tint", front: "--color-primary-text", ground: "--color-primary-soft", minimum: 7 },
  { name: "Edge of a green button", front: "--color-primary-edge", ground: "--color-surface", minimum: 3 },
  { name: "Edge of a ticked box, on a card", front: "--color-primary-edge", ground: "--color-raised", minimum: 3 },
  { name: "Filled part of a slider", front: "--color-primary-edge", ground: "--color-neutral-soft", minimum: 3 },
  { name: "Danger button label", front: "--color-on-danger", ground: "--color-danger", minimum: 7 },
  { name: "Danger text on the page", front: "--color-danger-text", ground: "--color-surface", minimum: 7 },
  { name: "Danger text on a soft tint", front: "--color-danger-text", ground: "--color-danger-soft", minimum: 7 },
  { name: "Warning label", front: "--color-on-warning", ground: "--color-warning", minimum: 7 },
  { name: "Warning text on the page", front: "--color-warning-text", ground: "--color-surface", minimum: 7 },
  { name: "Warning text on a soft tint", front: "--color-warning-text", ground: "--color-warning-soft", minimum: 7 },
  { name: "Info button label", front: "--color-on-info", ground: "--color-info", minimum: 7 },
  { name: "Info text on the page", front: "--color-info-text", ground: "--color-surface", minimum: 7 },
  { name: "Info text on a soft tint", front: "--color-info-text", ground: "--color-info-soft", minimum: 7 },
]

export function ratio(pair: Pair): number {
  return contrast(paint(pair.front), paint(pair.ground))
}

/** Runs `measure` with the settings on <html> as a farmer would have them, then puts the page back as it was */
export function withSetting<T>(setting: Setting, measure: () => T): T {
  const root = document.documentElement
  const before = [root.getAttribute("data-theme"), root.getAttribute("data-contrast")] as const
  root.setAttribute("data-theme", setting.theme)
  root.setAttribute("data-contrast", setting.contrast)
  try {
    return measure()
  } finally {
    restore(root, "data-theme", before[0])
    restore(root, "data-contrast", before[1])
  }
}

function restore(root: HTMLElement, name: string, value: string | null) {
  if (value === null) root.removeAttribute(name)
  else root.setAttribute(name, value)
}

/** The color a token paints, after `light-dark()`, `color-mix()` and the rest are resolved */
function paint(token: string): Rgb {
  const probe = document.createElement("span")
  probe.style.color = `var(${token})`
  document.body.append(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  return toRgb(resolved)
}

// A canvas converts any color the browser can parse, `oklch()` included, to sRGB
const canvas = document.createElement("canvas")
canvas.width = canvas.height = 1
const context = canvas.getContext("2d", { willReadFrequently: true })

function toRgb(color: string): Rgb {
  if (!context) throw new Error("A 2d canvas is needed to read colors")
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = "#000"
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const [red = 0, green = 0, blue = 0] = context.getImageData(0, 0, 1, 1).data
  return [red, green, blue]
}

function contrast(front: Rgb, ground: Rgb): number {
  const a = luminance(front)
  const b = luminance(ground)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

function luminance([red, green, blue]: Rgb): number {
  return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue)
}

function linear(channel: number): number {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}
