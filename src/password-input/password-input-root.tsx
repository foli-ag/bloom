import { PasswordInput as Seed } from "@foliag/seeds/password-input"
import { omit, type Element } from "solid-js"
import { fieldRoot } from "../internal/field.js"
import { translations } from "./use-password-input.js"

export type PasswordInputRootProps = Omit<Seed.RootProps, "class" | "translations"> & {
  /** Merged after the component's own classes, and wins over them */
  class?: string | undefined
}

/**
 * A password, hidden as it is typed, with a button beside it that shows it in plain text and hides it again. Typing
 * a password on a phone in the sun is error-prone, so the farmer can check it. Focus stays in the field. It asks the
 * browser for a saved password, or with `autoComplete="new-password"` to suggest a new one.
 *
 * Its parts stack with even gaps. The button is seeds' own, with no look: render it as a `Button`, its words in an
 * `Indicator` that says what a press will do.
 *
 * @example
 * <PasswordInput.Root name="mot-de-passe">
 *   <PasswordInput.Label>Mot de passe</PasswordInput.Label>
 *   <PasswordInput.Control>
 *     <PasswordInput.Input />
 *     <PasswordInput.Trigger.Visibility as={Button} tone="neutral" variant="outline">
 *       <PasswordInput.Indicator fallback="Afficher">Masquer</PasswordInput.Indicator>
 *     </PasswordInput.Trigger.Visibility>
 *   </PasswordInput.Control>
 * </PasswordInput.Root>
 */
export function PasswordInputRoot(props: PasswordInputRootProps): Element {
  return <Seed.Root {...omit(props, "class")} translations={translations} class={fieldRoot({ class: props.class })} />
}
