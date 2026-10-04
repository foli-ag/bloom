import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { settled } from "../foundations/settled.js"
import { Editable } from "./index.js"

function ParcelName(props: Partial<Editable.RootProps>) {
  return (
    <form class="w-[min(24rem,90vw)]">
      <Editable.Root name="parcelle" placeholder="Nom de la parcelle" {...props}>
        <Editable.Label>Nom de la parcelle</Editable.Label>
        <Editable.Area>
          <Editable.Input />
          <Editable.Preview />
          <Editable.Control>
            <Editable.Trigger.Edit>Renommer</Editable.Trigger.Edit>
            <Editable.Trigger.Submit>Enregistrer</Editable.Trigger.Submit>
            <Editable.Trigger.Cancel>Annuler</Editable.Trigger.Cancel>
          </Editable.Control>
        </Editable.Area>
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
 * The name sits in a quiet box with a pencil and its words at the end. A press on either turns it into a field, and
 * Enter or the tick keeps the new name. Its props are in the Controls panel.
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

/** Being changed: the box is a field, and the pencil has given way to a tick and a cross */
export const Editing: Story = {
  args: { defaultEdit: true },
}

export const Invalid: Story = {
  args: { invalid: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

/**
 * In a line of its own, such as the title of a card, with the pencil alone: its words are still there for a screen
 * reader, in `sr-only`.
 */
export const PencilAlone: Story = {
  render: (args) => (
    <div class="w-[min(24rem,90vw)]">
      <Editable.Root name="parcelle" aria-label="Nom de la parcelle" {...args}>
        <Editable.Area>
          <Editable.Input />
          <Editable.Preview class="text-xl font-semibold" />
          <Editable.Control>
            <Editable.Trigger.Edit>
              <span class="sr-only">Renommer</span>
            </Editable.Trigger.Edit>
            <Editable.Trigger.Submit>Enregistrer</Editable.Trigger.Submit>
            <Editable.Trigger.Cancel>Annuler</Editable.Trigger.Cancel>
          </Editable.Control>
        </Editable.Area>
      </Editable.Root>
    </div>
  ),
}

/**
 * The pencil turns the name into a field named by the label, not by zag's English, with the name selected. Enter keeps
 * the new name, and focus comes back to the pencil.
 */
export const TestRenamingTheParcel: Story = {
  name: "Test: Renaming the parcel",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText("Les Grands Champs")).toBeVisible()
    expect(canvas.queryByRole("textbox")).toBeNull()

    const edit = canvas.getByRole("button", { name: "Renommer" })
    await userEvent.click(edit)
    const field = canvas.getByRole("textbox", { name: "Nom de la parcelle" })
    await waitFor(() => expect(field).toHaveFocus())
    expect(canvas.queryByRole("button", { name: "Renommer" })).toBeNull()
    expect(canvas.getByRole("button", { name: "Enregistrer" })).toBeVisible()
    expect(canvas.getByRole("button", { name: "Annuler" })).toBeVisible()

    await userEvent.clear(field)
    await userEvent.type(field, "Le Pré du Moulin{Enter}")
    await waitFor(() => expect(canvas.queryByRole("textbox")).toBeNull())
    expect(canvas.getByText("Le Pré du Moulin")).toBeVisible()
    expect(args.onValueCommit).toHaveBeenLastCalledWith({ value: "Le Pré du Moulin" })
    await waitFor(() => expect(canvas.getByRole("button", { name: "Renommer" })).toHaveFocus())
  },
}

/** A press on the words themselves edits them too, and the tick keeps the change */
export const TestPressingTheWords: Story = {
  name: "Test: Pressing the words",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText("Les Grands Champs"))
    const field = canvas.getByRole("textbox", { name: "Nom de la parcelle" })
    await waitFor(() => expect(field).toHaveFocus())
    await userEvent.type(field, "{End} Nord")
    await userEvent.click(canvas.getByRole("button", { name: "Enregistrer" }))
    await waitFor(() => expect(canvas.queryByRole("textbox")).toBeNull())
    expect(args.onValueCommit).toHaveBeenLastCalledWith({ value: "Les Grands Champs Nord" })
  },
}

/** The cross, or Escape, puts the old name back */
export const TestCancellingARename: Story = {
  name: "Test: Cancelling a rename",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Renommer" }))
    let field = canvas.getByRole("textbox")
    await waitFor(() => expect(field).toHaveFocus())
    await userEvent.type(field, "Parcelle 12")
    await userEvent.click(canvas.getByRole("button", { name: "Annuler" }))
    await waitFor(() => expect(canvas.queryByRole("textbox")).toBeNull())
    expect(canvas.getByText("Les Grands Champs")).toBeVisible()

    await userEvent.click(canvas.getByRole("button", { name: "Renommer" }))
    field = canvas.getByRole("textbox")
    await waitFor(() => expect(field).toHaveFocus())
    await userEvent.type(field, "Parcelle 12{Escape}")
    await waitFor(() => expect(canvas.queryByRole("textbox")).toBeNull())
    expect(canvas.getByText("Les Grands Champs")).toBeVisible()
    expect(args.onValueCommit).not.toHaveBeenCalled()
  },
}

/**
 * From the keyboard, Tab onto the name opens the field with the box's ring inside its edge, Tab goes on to the tick and
 * the cross, each with its own ring, and Escape puts the name back with focus on the pencil.
 */
export const TestWithTheKeyboard: Story = {
  name: "Test: With the keyboard",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const field = canvas.getByRole("textbox", { name: "Nom de la parcelle" })
    await waitFor(() => expect(field).toHaveFocus())
    const box = field.parentElement!
    expect(getComputedStyle(box).outlineStyle).toBe("solid")

    await userEvent.tab()
    expect(canvas.getByRole("button", { name: "Enregistrer" })).toHaveFocus()
    expect(getComputedStyle(box).outlineStyle).toBe("none")
    await userEvent.tab()
    expect(canvas.getByRole("button", { name: "Annuler" })).toHaveFocus()
    await userEvent.tab({ shift: true })
    await userEvent.tab({ shift: true })
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(canvas.getByRole("button", { name: "Renommer" })).toHaveFocus())
  },
}

/** Nothing pops in as the page loads with the field open from the start */
export const TestOpenFromTheStart: Story = {
  name: "Test: Open from the start",
  args: { defaultEdit: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tick = canvas.getByRole("button", { name: "Enregistrer" })
    expect(tick.getAnimations()).toEqual([])
    await settled()
    // From the frames after the first, a button that appears pops in
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    await userEvent.click(canvas.getByRole("button", { name: "Annuler" }))
    const edit = await canvas.findByRole("button", { name: "Renommer" })
    expect(Number.parseFloat(getComputedStyle(edit).scale)).toBeLessThan(1)
  },
}

export const TestOnAPhone: Story = {
  name: "Test: On a phone",
  args: { defaultValue: "La Grande Pièce derrière le hangar" },
  globals: { viewport: { value: "mobile2", isRotated: false } },
}

export const TestEditingOnAPhone: Story = {
  name: "Test: Editing on a phone",
  args: { defaultEdit: true, defaultValue: "La Grande Pièce derrière le hangar" },
  globals: { viewport: { value: "mobile2", isRotated: false } },
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

export const TestEditingWithMoreContrast: Story = {
  name: "Test: Editing with more contrast",
  args: { defaultEdit: true },
  globals: { contrast: "more" },
}
