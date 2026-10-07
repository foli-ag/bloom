import type { JSX } from "@solidjs/web"
import { createMemo, Show, type Element } from "solid-js"

export interface ThemeProviderProps {
  /** The product's colors. Without one, bloom's own apply. */
  theme?: Theme | undefined
  children?: JSX.Element
}

/**
 * A product's colors, each the value of one of bloom's color tokens: `"primary-500"` sets `--color-primary-500`,
 * `"on-primary"` the ink on a primary fill. A token left out keeps bloom's own value. Nothing is worked out or checked:
 * the 7:1 for text and 3:1 for edges that bloom's own colors reach are the theme's to reach.
 *
 * @example
 * const acme: Theme = {
 *   "primary-100": "#e5efff",
 *   "primary-800": "#344d74",
 *   primary: "#1a3a6b",
 *   "on-primary": "#fff",
 *   "primary-soft": { light: "#e5efff", dark: "#1f2733" },
 * }
 */
export type Theme = { readonly [Token in ColorToken]?: ThemeColor }

/** Any CSS color, or one for the light theme and one for the dark theme */
export type ThemeColor = string | { readonly light: string; readonly dark: string }

/** Every color token in theme.css, without its `--color-` */
export type ColorToken =
  | `primary-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950}`
  | "primary"
  | "on-primary"
  | "primary-text"
  | "primary-edge"
  | "primary-soft"
  | "primary-hover"
  | "primary-pressed"
  | "surface"
  | "raised"
  | "ink"
  | "muted"
  | "border"
  | "strong"
  | "neutral-soft"
  | "disabled"
  | "disabled-ink"
  | "focus"
  | "danger"
  | "on-danger"
  | "danger-text"
  | "danger-soft"
  | "warning"
  | "on-warning"
  | "warning-text"
  | "warning-soft"
  | "warning-edge"
  | "info"
  | "on-info"
  | "info-text"
  | "info-soft"
  | "success-edge"
  | "success-text"
  | "scrim"

/**
 * Re-skins bloom in a product's colors, for the whole page: overlays render into `<body>`, outside any wrapper, so the
 * tokens are set on `:root`. It renders a `<style>`, so the colors are there in the server's HTML, and a new `theme`
 * replaces them in place. Use one, near the top of the app.
 *
 * The theme takes the place of theme.css's values and nothing else: a farmer's more contrast still turns text and
 * edges to the darker steps of the theme's scale, as it does bloom's.
 *
 * @example
 * <ThemeProvider theme={tenant().theme}>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider(props: ThemeProviderProps): Element {
  const rule = createMemo(() => (props.theme === undefined ? "" : themeRule(props.theme)))
  return (
    <>
      <Show when={rule()}>
        <style data-scope="theme">{rule()}</style>
      </Show>
      {props.children}
    </>
  )
}

// In Tailwind's `theme` layer, after theme.css's own values, so the theme wins over them and `base`, where more
// contrast lives, still wins over the theme
function themeRule(theme: Theme): string {
  const declarations = Object.entries(theme).map(([token, color]: [string, ThemeColor]) => {
    const value = typeof color === "string" ? color : `light-dark(${color.light}, ${color.dark})`
    // The value is written into a stylesheet: one that could end the declaration or the <style> is not a color
    if (/[;{}<]/.test(value)) throw new Error(`"${value}" is not a color, for --color-${token}`)
    return `--color-${token}: ${value};`
  })
  return `@layer theme { :root { ${declarations.join(" ")} } }`
}
