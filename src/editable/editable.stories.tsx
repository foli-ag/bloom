import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { Editable } from "./index.js"

function ParcelName(props: Partial<Editable.RootProps>) {
  return (
    <form class="w-80">
      <Editable.Root name="parcelle" placeholder="Nom de la parcelle" {...props}>
        <Editable.Label>Nom de la parcelle</Editable.Label>
        <Editable.Area>
          <Editable.Input />
          <Editable.Preview />
        </Editable.Area>
        <Editable.Control>
          <Editable.Trigger.Edit as={Button} tone="neutral" variant="outline">
            Renommer
          </Editable.Trigger.Edit>
          <Editable.Trigger.Submit as={Button}>Enregistrer</Editable.Trigger.Submit>
          <Editable.Trigger.Cancel as={Button} tone="neutral" variant="outline">
            Annuler
          </Editable.Trigger.Cancel>
        </Editable.Control>
      </Editable.Root>
    </form>
  )
}

const meta = {
  title: "Components/Editable",
  component: ParcelName,
  tags: ["autodocs"],
  args: { defaultValue: "Les Grands Champs", onValueCommit: fn() },
} satisfies Meta<typeof ParcelName>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The name reads as text with a button beside it. The button turns it into a field, and Enter keeps the new name. Its
 * props are in the Controls panel.
 */
export const Playground: Story = {
  args: { name: "parcelle", placeholder: "Nom de la parcelle" },
  argTypes: {
    name: { control: "text" },
    placeholder: { control: "text" },
    activationMode: { control: "select", options: ["focus", "dblclick", "click", "none"] },
    submitMode: { control: "select", options: ["enter", "blur", "both", "none"] },
    maxLength: { control: "number" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    invalid: { control: "boolean" },
    required: { control: "boolean" },
  },
}

/** Empty, the placeholder shows dimmed in its place */
export const Empty: Story = {
  args: { defaultValue: "" },
}

/** Being changed, to be measured by axe and looked at */
export const Editing: Story = {
  args: { defaultEdit: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

/**
 * The name reads as text with a button beside it. The button turns it into a field named by the label, not by zag's
 * English, and Enter keeps the new name.
 */
export const TestRenamingTheParcel: Story = {
  name: "Test: Renaming the parcel",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText("Les Grands Champs")).toBeVisible()
    expect(canvas.queryByRole("textbox")).toBeNull()

    await userEvent.click(canvas.getByRole("button", { name: "Renommer" }))
    const field = canvas.getByRole("textbox", { name: "Nom de la parcelle" })
    await waitFor(() => expect(field).toHaveFocus())
    expect(canvas.queryByRole("button", { name: "Renommer" })).toBeNull()
    expect(canvas.getByRole("button", { name: "Enregistrer" })).toBeVisible()

    await userEvent.clear(field)
    await userEvent.type(field, "Le Pré du Moulin{Enter}")
    await waitFor(() => expect(canvas.queryByRole("textbox")).toBeNull())
    expect(canvas.getByText("Le Pré du Moulin")).toBeVisible()
    expect(args.onValueCommit).toHaveBeenLastCalledWith({ value: "Le Pré du Moulin" })
  },
}

/** Escape, or the cancel button, puts the old name back */
export const TestCancellingARename: Story = {
  name: "Test: Cancelling a rename",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Renommer" }))
    const field = canvas.getByRole("textbox")
    await waitFor(() => expect(field).toHaveFocus())
    await userEvent.type(field, "Parcelle 12")
    await userEvent.click(canvas.getByRole("button", { name: "Annuler" }))
    await waitFor(() => expect(canvas.queryByRole("textbox")).toBeNull())
    expect(canvas.getByText("Les Grands Champs")).toBeVisible()
    expect(args.onValueCommit).not.toHaveBeenCalled()
  },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  globals: { theme: "dark" },
}

export const TestEditingInDarkTheme: Story = {
  name: "Test: Editing in dark theme",
  args: { defaultEdit: true },
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  globals: { contrast: "more" },
}
