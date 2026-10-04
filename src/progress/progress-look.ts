import { createContext, useContext, type Accessor } from "solid-js"
import { tv } from "tailwind-variants"

/** What the fill says about how things are going. The words that say it are the app's, in the label and the value. */
export type ProgressTone = "primary" | "success" | "warning" | "danger"

/** How the root wants its parts to look: in which tone, and as one bar or as segments */
export interface ProgressLook {
  tone: Accessor<ProgressTone>
  segmented: Accessor<boolean>
}

export const ProgressLookContext = /* @__PURE__ */ createContext<ProgressLook | null>(null)

export const useProgressLook = () => useContext(ProgressLookContext)

/**
 * A tone is two colors on the root that the parts read: `--progress-fill` for the bar, the ring and the segments, 3:1
 * against their track and the page in both themes, and `--progress-text` for the value, 7:1. Amber is too light to fill
 * a bar on a light page, so the warning fill deepens to an orange there (`--color-warning-edge`), and success has a
 * green of its own, so it stays a success green in a product that re-skins the primary scale.
 */
export const toneColors = tv({
  variants: {
    tone: {
      primary: "[--progress-fill:var(--color-primary-edge)] [--progress-text:var(--color-ink)]",
      success: "[--progress-fill:var(--color-success-edge)] [--progress-text:var(--color-success-text)]",
      warning: "[--progress-fill:var(--color-warning-edge)] [--progress-text:var(--color-warning-text)]",
      danger: "[--progress-fill:var(--color-danger)] [--progress-text:var(--color-danger-text)]",
    },
  },
  defaultVariants: { tone: "primary" },
})
