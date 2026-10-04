import type { JSX } from "@solidjs/web"
import { createSignal, omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { BreadcrumbContext } from "./breadcrumb-context.js"

type Named =
  | { "aria-label": string; "aria-labelledby"?: undefined }
  | { "aria-labelledby": string; "aria-label"?: undefined }

export type BreadcrumbRootProps = Omit<JSX.HTMLAttributes<HTMLElement>, "class" | "aria-label" | "aria-labelledby"> &
  Named & {
    /** A `List` */
    children: JSX.Element
    class?: string | undefined
  }

/**
 * Where the page sits in the app, from its top down to the page itself: a `nav` landmark that a screen reader can jump
 * to, named by the app ("Fil d'Ariane"), holding an ordered list. The current page is the last item and is marked as
 * such; the chevrons between items are drawn, and hidden from assistive technology.
 *
 * On a phone a trail of four pages or more would wrap into a heap of short lines. It keeps to one line instead: the
 * start folds into an `Ellipsis` and the page and its parent stay, the two a farmer needs most, the parent being the way
 * back up. The ellipsis unfolds the whole trail, and focus moves to its first page. From 640px the whole trail shows.
 *
 * @example
 * <Breadcrumb.Root aria-label="Fil d'Ariane">
 *   <Breadcrumb.List>
 *     <Breadcrumb.Ellipsis>Afficher tout le chemin</Breadcrumb.Ellipsis>
 *     <Breadcrumb.Item><Breadcrumb.Link href="/">Accueil</Breadcrumb.Link></Breadcrumb.Item>
 *     <Breadcrumb.Item><Breadcrumb.Link href="/parcelles">Parcelles</Breadcrumb.Link></Breadcrumb.Item>
 *     <Breadcrumb.Item><Breadcrumb.Link current>Les Grands Champs</Breadcrumb.Link></Breadcrumb.Item>
 *   </Breadcrumb.List>
 * </Breadcrumb.Root>
 */
export function BreadcrumbRoot(props: BreadcrumbRootProps): Element {
  const rest = omit(props, "class", "children")
  // Items count themselves as they mount, a write from inside a component, the one place this is wanted
  const [items, setItems] = createSignal(0, { ownedWrite: true })
  const [expanded, setExpanded] = createSignal(false)
  return (
    <BreadcrumbContext value={{ items, setItems, expanded, expand: () => setExpanded(true) }}>
      <nav {...rest} data-scope="breadcrumb" data-part="root" class={root({ class: props.class })}>
        {props.children}
      </nav>
    </BreadcrumbContext>
  )
}

const root = tv({ base: "min-w-0 text-sm font-semibold tracking-body" })
