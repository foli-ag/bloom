import { createSignal, For, omit, untrack } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { Input } from "../input/index.js"
import { createListCollection, Select } from "../select/index.js"
import { Dialog } from "./index.js"

interface DeleteParcelProps extends Dialog.RootProps {
  onDelete?: () => void
}

// The app holds `open`, so the button that deletes can close the dialog once it has
function DeleteParcel(props: DeleteParcelProps) {
  const [open, setOpen] = createSignal(untrack(() => props.defaultOpen) ?? false)
  return (
    <Dialog.Root
      role="alertdialog"
      {...omit(props, "onDelete", "defaultOpen", "onOpenChange")}
      open={open()}
      onOpenChange={(details) => {
        setOpen(details.open)
        props.onOpenChange?.(details)
      }}
    >
      <Dialog.Trigger as={Button} tone="danger" variant="outline">
        Supprimer la parcelle
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Title>Supprimer « Les Grands Champs » ?</Dialog.Title>
          <Dialog.Description>
            Ses 14 interventions seront supprimées aussi. Cette action est définitive.
          </Dialog.Description>
          <Dialog.Actions>
            <Dialog.Trigger.Close as={Button} tone="neutral" variant="outline">
              Annuler
            </Dialog.Trigger.Close>
            <Button
              tone="danger"
              onClick={() => {
                props.onDelete?.()
                setOpen(false)
              }}
            >
              Supprimer
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

const meta = {
  title: "Components/Dialog",
  component: DeleteParcel,
  tags: ["autodocs"],
  args: { onOpenChange: fn(), onDelete: fn() },
} satisfies Meta<typeof DeleteParcel>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A question that interrupts, as a card in the middle of the screen from 640px. Focus goes to the button that backs
 * out, Escape closes it and focus comes back to the trigger. A tap on the dim does not answer it.
 */
export const Default: Story = {
  play: async ({ args }) => {
    const page = within(document.body)
    const trigger = page.getByRole("button", { name: "Supprimer la parcelle" })
    await userEvent.click(trigger)
    const dialog = await page.findByRole("alertdialog", { name: "Supprimer « Les Grands Champs » ?" })
    expect(dialog).toHaveAccessibleDescription(/14 interventions/)
    await waitFor(() => expect(page.getByRole("button", { name: "Annuler" })).toHaveFocus())
    await settled()
    const { top, bottom } = dialog.getBoundingClientRect()
    expect((top + bottom) / 2).toBeCloseTo(innerHeight / 2, 0)

    await userEvent.click(document.documentElement)
    await settled()
    expect(dialog).toBeVisible()

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(page.queryByRole("alertdialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(args.onOpenChange).toHaveBeenLastCalledWith({ open: false })

    await userEvent.click(trigger)
    await userEvent.click(await page.findByRole("button", { name: "Supprimer" }))
    expect(args.onDelete).toHaveBeenCalledOnce()
    await waitFor(() => expect(page.queryByRole("alertdialog")).toBeNull())
  },
}

/** On a phone it is a sheet on the bottom edge, its buttons at full width and the main one last, under the thumb. */
export const OnAPhone: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("button", { name: "Supprimer la parcelle" }))
    const dialog = await page.findByRole("alertdialog")
    await settled()
    const sheet = dialog.getBoundingClientRect()
    expect(sheet.bottom).toBeCloseTo(innerHeight, 0)
    expect(sheet.width).toBeCloseTo(innerWidth, 0)
    const cancel = page.getByRole("button", { name: "Annuler" }).getBoundingClientRect()
    const confirm = page.getByRole("button", { name: "Supprimer" }).getBoundingClientRect()
    expect(confirm.top).toBeGreaterThan(cancel.bottom)
    expect(confirm.width).toBeCloseTo(cancel.width, 0)
  },
}

/** Open, to be measured by axe and looked at */
export const Open: Story = {
  args: { defaultOpen: true },
  play: settled,
}

export const OpenInDarkTheme: Story = {
  ...Open,
  globals: { theme: "dark" },
}

export const OpenWithMoreContrast: Story = {
  ...Open,
  globals: { contrast: "more" },
}

const kinds = createListCollection({
  items: [
    { label: "Semis", value: "semis" },
    { label: "Fertilisation", value: "fertilisation" },
    { label: "Traitement", value: "traitement" },
    { label: "Récolte", value: "recolte" },
  ],
})

function NewIntervention(props: Dialog.RootProps) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger as={Button}>Nouvelle intervention</Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Title>Nouvelle intervention</Dialog.Title>
          <div class="grid gap-2">
            <label for="intervention-date" class="font-semibold">
              Date
            </label>
            <Input id="intervention-date" type="date" value="2026-10-02" />
          </div>
          <Select.Root collection={kinds} name="type">
            <Select.Label>Type</Select.Label>
            <Select.Trigger>
              <Select.ValueText placeholder="Choisir un type" />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Positioner>
              <Select.Content>
                <For each={kinds.items}>
                  {(item) => (
                    <Select.Item item={item}>
                      <Select.Item.Text>{item.label}</Select.Item.Text>
                      <Select.Item.Indicator />
                    </Select.Item>
                  )}
                </For>
              </Select.Content>
              <Select.Trigger.Close as={Button} tone="neutral" variant="outline" block>
                Fermer
              </Select.Trigger.Close>
            </Select.Positioner>
            <Select.HiddenSelect />
          </Select.Root>
          <Dialog.Actions>
            <Dialog.Trigger.Close as={Button} tone="neutral" variant="outline">
              Annuler
            </Dialog.Trigger.Close>
            <Button>Enregistrer</Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

/**
 * A short form. Focus starts in its first field. A select inside it opens its own sheet over the dialog, and
 * choosing closes only that sheet. A tap on the dim closes this dialog, as it asks no question.
 */
export const WithAForm: Story = {
  render: (args) => <NewIntervention onOpenChange={args.onOpenChange} />,
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("button", { name: "Nouvelle intervention" }))
    const dialog = await page.findByRole("dialog", { name: "Nouvelle intervention" })
    await waitFor(() => expect(page.getByLabelText("Date")).toHaveFocus())
    await settled()

    const select = page.getByRole("combobox", { name: "Type" })
    await userEvent.click(select)
    // A finger reaches the list once it is there, and the select is then a layer above the dialog
    await settled()
    await userEvent.click(page.getByRole("option", { name: "Traitement" }))
    await waitFor(() => expect(page.queryByRole("listbox")).toBeNull())
    expect(select).toHaveTextContent("Traitement")
    await waitFor(() => expect(select).toHaveFocus())
    expect(dialog).toBeVisible()

    await settled()
    await userEvent.click(document.documentElement)
    await waitFor(() => expect(page.queryByRole("dialog")).toBeNull())
  },
}
