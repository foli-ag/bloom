import { usePresence } from "@foliag/seeds/presence"
import type { JSX } from "@solidjs/web"
import { createSignal, omit, Show, type Element } from "solid-js"
import { tv } from "../internal/variants.js"
import type { StatusTone } from "../internal/icons.jsx"
import { AlertContext } from "./alert-context.js"

export interface OpenChangeDetails {
  open: boolean
}

export type AlertRootProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "class" | "role" | "children"> & {
  /** What kind of news it is, which sets its colors and its mark. `info` by default. */
  tone?: StatusTone | undefined
  /**
   * The farmer has to hear it now: a screen reader breaks off what it is saying (`role="alert"`). By default it waits
   * for a pause (`role="status"`). Keep it for what cannot wait, such as a save that failed.
   */
  urgent?: boolean | undefined
  /** Whether it is shown, for an alert the app opens and closes itself. With `onOpenChange`. */
  open?: boolean | undefined
  /** Whether it is shown at first, when the alert keeps its own state. `true` by default. */
  defaultOpen?: boolean | undefined
  /** Called as its `Trigger.Close` dismisses it */
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
  /** An `Indicator`, a `Title`, a `Description`, `Actions` and a `Trigger.Close`, each optional */
  children: JSX.Element
  /** Merged after the alert's own classes, on the box that has its colors */
  class?: string | undefined
}

/**
 * News about what the farmer is doing or about the app, in the page: a save that failed, a field without a crop, an
 * update. Its tone sets its tint, its edge and its mark, and the mark's shape and the words say it too, so the color is
 * never alone. It never takes focus: a screen reader says it as it appears, at once if it is `urgent`.
 *
 * With a `Trigger.Close` it can be dismissed. It then folds away: it fades as its height closes, so what is below
 * moves up smoothly rather than jumping, and a change of mind half way unfolds it from where it is. Under reduced
 * motion it only fades. Focus, if it was in the alert, goes on to what follows it. Space a dismissible alert with a
 * margin of its own (`class="mb-4"`), which folds away with it, rather than a gap in what holds it, which would stay.
 *
 * To announce a status, render the alert as the news arrives: one that is on the page from the start is not read out.
 *
 * @example
 * <Alert.Root tone="danger" urgent>
 *   <Alert.Indicator />
 *   <Alert.Title>Enregistrement impossible</Alert.Title>
 *   <Alert.Description>Pas de réseau. Vos saisies sont gardées sur le téléphone.</Alert.Description>
 *   <Alert.Actions>
 *     <Button tone="neutral" variant="outline" onClick={retry}>Réessayer</Button>
 *   </Alert.Actions>
 *   <Alert.Trigger.Close as={Button} tone="neutral" variant="ghost">Fermer</Alert.Trigger.Close>
 * </Alert.Root>
 */
export function AlertRoot(props: AlertRootProps): Element {
  const rest = omit(props, "tone", "urgent", "open", "defaultOpen", "onOpenChange", "children", "class")
  const [own, setOwn] = createSignal(props.defaultOpen ?? true)
  const open = () => props.open ?? own()
  const presence = usePresence(() => ({ present: open(), unmountOnExit: true, skipAnimationOnMount: true }))
  let element: HTMLElement | undefined
  const close = () => {
    if (element?.contains(element.ownerDocument.activeElement)) focusPast(element)
    setOwn(false)
    props.onOpenChange?.({ open: false })
  }
  return (
    <AlertContext value={{ tone: () => props.tone ?? "info", close }}>
      <Show when={!presence().unmounted}>
        <div
          {...rest}
          ref={(node: HTMLElement) => {
            element = node
            presence().ref(node)
          }}
          data-scope="alert"
          data-part="root"
          data-state={presence().presenceProps["data-state"]}
          role={props.urgent ? "alert" : "status"}
          class="presence-collapse"
        >
          {/* What folds, which clips while it moves, around the box and its margin */}
          <div>
            <div class={box({ tone: props.tone ?? "info", class: props.class })}>{props.children}</div>
          </div>
        </div>
      </Show>
    </AlertContext>
  )
}

/** Focus goes on to the next thing the keyboard can reach after the alert, or back to the last one before it */
function focusPast(alert: HTMLElement) {
  const reachable = [
    ...alert.ownerDocument.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
    ),
  ].filter((element) => !alert.contains(element) && element.checkVisibility())
  const after = reachable.find((element) => alert.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)
  ;(
    after ?? reachable.findLast((element) => alert.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_PRECEDING)
  )?.focus()
}

// The mark sits in the first column on the first line, the words in the second, and a close button at the end of the
// first line, its 48px reaching into the padding so a one-line alert stays one line tall
const box = tv({
  base: [
    "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-card border-2 p-4 text-base text-ink",
    "has-[>[data-part=close-trigger]]:grid-cols-[auto_minmax(0,1fr)_auto] *:col-start-2",
    "[&>[data-part=indicator]]:col-start-1 [&>[data-part=indicator]]:row-start-1",
    "[&>[data-part=close-trigger]]:col-start-3 [&>[data-part=close-trigger]]:row-start-1",
    "[&>[data-part=close-trigger]]:-my-2.5 [&>[data-part=close-trigger]]:-me-1.5",
  ],
  variants: {
    tone: {
      info: "border-info-text bg-info-soft [--alert-ink:var(--color-info-text)]",
      success: "border-primary-edge bg-primary-soft [--alert-ink:var(--color-primary-text)]",
      warning: "border-warning-text bg-warning-soft [--alert-ink:var(--color-warning-text)]",
      danger: "border-danger-text bg-danger-soft [--alert-ink:var(--color-danger-text)]",
    },
  },
})
