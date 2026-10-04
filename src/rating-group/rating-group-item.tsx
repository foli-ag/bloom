import { RatingGroup as Seed } from "@foliag/seeds/rating-group"
import { omit, type Element } from "solid-js"
import { tv } from "tailwind-variants"
import { Mark } from "../internal/icons.jsx"

export type RatingGroupItemProps = Omit<Seed.ItemProps, "class" | "children"> & {
  class?: string | undefined
}

/**
 * One star in a 48px target. It fills as it is reached, by the mark or by the pointer, popping in on the lively
 * spring; a half mark fills its first half. Its name is the root's `translations.ratingValueText`.
 */
export function RatingGroupItem(props: RatingGroupItemProps): Element {
  return (
    <Seed.Item
      {...omit(props, "class")}
      // Zag calls each star a "rating" in English, which a screen reader says after its name. A radio says enough.
      aria-roledescription={false}
      class={item({ class: props.class })}
    >
      <span class="relative size-8">
        <Mark stroke-width={2} class={outline()}>
          <path d={star} />
        </Mark>
        <Mark stroke-width={2} class={filled()}>
          <path d={star} />
        </Mark>
      </span>
    </Seed.Item>
  )
}

const star = "M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"

const item = tv({
  base: [
    "group/item inline-flex size-12 pressable items-center justify-center rounded-control outline-none",
    "motion-touch active:scale-(--press-scale-small)",
    "focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-focus",
    "data-disabled:cursor-not-allowed data-readonly:cursor-default",
  ],
})

// The empty star's edge reaches 3:1 against the page
const outline = tv({
  base: "absolute inset-0 size-8 text-strong group-data-disabled/item:text-disabled-ink",
})

// Amber is too light to show on a light page alone (1.5:1), so a filled star carries a `warning-text` edge. A half
// star is the full one cut at its middle.
const filled = tv({
  base: [
    "absolute inset-0 size-8 fill-warning text-warning-text scale-(--pop-in-scale) opacity-0",
    "[transition:scale_var(--duration-pop)_var(--ease-pop),opacity_var(--duration-smooth)_var(--ease-smooth)]",
    "group-data-highlighted/item:scale-100 group-data-highlighted/item:opacity-100",
    "group-data-half/item:[clip-path:inset(0_50%_0_0)] rtl:group-data-half/item:[clip-path:inset(0_0_0_50%)]",
    "group-data-disabled/item:fill-disabled group-data-disabled/item:text-disabled-ink",
  ],
})
