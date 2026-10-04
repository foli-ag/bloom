import { Popover as Seed } from "@foliag/seeds/popover"
import type { Element } from "solid-js"
import { translations } from "./use-popover.js"

export type PopoverRootProps = Omit<Seed.RootProps, "lazyMount" | "unmountOnExit" | "translations">

/**
 * A few words or a small task next to what it is about, such as how a figure was worked out. It hangs off its
 * trigger from 640px, and on a phone rises from the bottom as a sheet. The page stays usable around it: a tap
 * elsewhere closes it, and so does Escape. For something that has to be answered first, use a Dialog.
 *
 * Every popover has a `Trigger.Close`, because a sheet on a phone has no other visible way out.
 *
 * @example
 * <Popover.Root>
 *   <Popover.Trigger as={Button} variant="ghost">Comment est calculée la dose ?</Popover.Trigger>
 *   <Popover.Positioner>
 *     <Popover.Content>
 *       <Popover.Title>Dose d'azote</Popover.Title>
 *       <Popover.Description>Le besoin de la culture, moins ce que le sol fournit.</Popover.Description>
 *       <Popover.Actions>
 *         <Popover.Trigger.Close as={Button} tone="neutral" variant="outline">Fermer</Popover.Trigger.Close>
 *       </Popover.Actions>
 *     </Popover.Content>
 *   </Popover.Positioner>
 * </Popover.Root>
 */
export function PopoverRoot(props: PopoverRootProps): Element {
  // The content stays mounted, hidden: zag looks for the title and the description that name the popover once, as
  // the root is created, and would find neither in content mounted later
  return <Seed.Root {...props} translations={translations} />
}
