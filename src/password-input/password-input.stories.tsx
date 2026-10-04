import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { PasswordInput } from "./index.js"

function Password(props: Partial<PasswordInput.RootProps>) {
  return (
    <form class="w-80">
      <PasswordInput.Root name="mot-de-passe" {...props}>
        <PasswordInput.Label>Mot de passe</PasswordInput.Label>
        <PasswordInput.Control>
          <PasswordInput.Input />
          <PasswordInput.Trigger.Visibility as={Button} tone="neutral" variant="outline">
            <PasswordInput.Indicator fallback="Afficher">Masquer</PasswordInput.Indicator>
          </PasswordInput.Trigger.Visibility>
        </PasswordInput.Control>
      </PasswordInput.Root>
    </form>
  )
}

const meta = {
  title: "Components/PasswordInput",
  component: Password,
  tags: ["autodocs"],
  args: { onVisibilityChange: fn() },
} satisfies Meta<typeof Password>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Hidden as it is typed. "Afficher" shows it in plain text so the farmer can check it, and focus stays in the field
 * to go on typing. The button then reads "Masquer". The password goes into the form either way.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByLabelText("Mot de passe")
    expect(field).toHaveAttribute("type", "password")
    expect(field).toHaveAttribute("autocomplete", "current-password")
    await userEvent.type(field, "colza2026")

    await userEvent.click(canvas.getByRole("button", { name: "Afficher" }))
    await waitFor(() => expect(field).toHaveAttribute("type", "text"))
    await waitFor(() => expect(field).toHaveFocus())
    expect(args.onVisibilityChange).toHaveBeenLastCalledWith({ visible: true })
    await userEvent.keyboard("!")

    await userEvent.click(canvas.getByRole("button", { name: "Masquer" }))
    await waitFor(() => expect(field).toHaveAttribute("type", "password"))
    expect(new FormData(canvasElement.querySelector("form")!).get("mot-de-passe")).toBe("colza2026!")
  },
}

/** For an account being created: the browser offers to make up a strong password */
export const NewPassword: Story = {
  args: { autoComplete: "new-password" },
  play: ({ canvasElement }) => {
    expect(within(canvasElement).getByLabelText("Mot de passe")).toHaveAttribute("autocomplete", "new-password")
  },
}

export const Shown: Story = {
  args: { defaultVisible: true },
}

export const Invalid: Story = {
  args: { invalid: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const InDarkTheme: Story = {
  args: { defaultVisible: true },
  globals: { theme: "dark" },
}

export const WithMoreContrast: Story = {
  args: { defaultVisible: true },
  globals: { contrast: "more" },
}
