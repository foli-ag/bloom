import { Polymorphic, type PolymorphicProps, type ValidComponent } from "@foliag/seeds/polymorphic"
import type { JSX } from "@solidjs/web"
import { omit, type Element } from "solid-js"
import { tv } from "../internal/variants.js"

export type BreadcrumbLinkProps<As extends ValidComponent = "a"> = PolymorphicProps<
  As,
  {
    /** The page's name, such as "Parcelles" */
    children: JSX.Element
    /**
     * The page the farmer is on: it is marked `aria-current="page"` and drawn as plain words. Without an `href` it is no
     * link at all, as a link to the page itself leads nowhere.
     */
    current?: boolean | undefined
    class?: string | undefined
  }
>

/**
 * A page up the trail, as a link, or with `as` the app's router link. Its words are underlined, so it reads as a link
 * without its color, in a 48px target. A long name is cut short with an ellipsis, and a screen reader still hears it all.
 */
export function BreadcrumbLink<As extends ValidComponent = "a">(props: BreadcrumbLinkProps<As>): Element {
  const rest = omit(props as BreadcrumbLinkProps, "current", "class")
  return (
    <Polymorphic
      as="a"
      {...(rest as object)}
      aria-current={props.current ? "page" : undefined}
      data-scope="breadcrumb"
      data-part="link"
      class={link({ class: props.class })}
    />
  )
}

const link = tv({
  base: [
    "block max-w-[min(16rem,45vw)] min-w-0 truncate rounded-box px-2 py-3 leading-6",
    "text-primary-text underline decoration-2 underline-offset-4",
    "[&[href]]:pressable [&[href]]:motion-press hover:[&[href]]:bg-primary-soft pressing:[&[href]]:bg-primary-soft",
    "focus-ring",
    "aria-[current=page]:text-ink aria-[current=page]:no-underline",
  ],
})
