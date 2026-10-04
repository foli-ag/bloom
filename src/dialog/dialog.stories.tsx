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
 * A question that interrupts, as a card in the middle of the screen from 640px. Its props are in the Controls panel.
 */
export const Playground: Story = {
  args: { role: "alertdialog", modal: true, closeOnEscape: true, restoreFocus: true },
  argTypes: {
    role: { control: "inline-radio", options: ["dialog", "alertdialog"] },
    modal: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    restoreFocus: { control: "boolean" },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    phone: { control: "inline-radio", options: ["sheet", "full-screen"] },
  },
}

/** Open, to be measured by axe and looked at */
export const Open: Story = {
  args: { defaultOpen: true },
  play: settled,
}

/**
 * A question that interrupts, as a card in the middle of the screen from 640px. Focus goes to the button that backs
 * out, Escape closes it and focus comes back to the trigger. A tap on the dim does not answer it, and the dialog
 * answers the tap instead: it swells a little and settles back.
 */
export const TestAsAnAlertDialog: Story = {
  name: "Test: As an alert dialog",
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
    await waitFor(() => expect(dialog.parentElement!.getAnimations()).not.toEqual([]))
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

/**
 * On a phone it is a sheet on the bottom edge, its buttons at full width and the main one last, under the thumb. It
 * slides up solid, as it comes from off the screen, rather than as a see-through ghost of itself.
 */
export const TestOnAPhone: Story = {
  name: "Test: On a phone",
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("button", { name: "Supprimer la parcelle" }))
    const dialog = await page.findByRole("alertdialog")
    const rising = dialog.getBoundingClientRect().top
    for (let count = 0; count < 5; count++) {
      expect(getComputedStyle(dialog).opacity).toBe("1")
      await frame()
    }
    await settled()
    const sheet = dialog.getBoundingClientRect()
    expect(rising).toBeGreaterThan(sheet.top)
    expect(sheet.bottom).toBeCloseTo(innerHeight, 0)
    expect(sheet.width).toBeCloseTo(innerWidth, 0)
    const cancel = page.getByRole("button", { name: "Annuler" }).getBoundingClientRect()
    const confirm = page.getByRole("button", { name: "Supprimer" }).getBoundingClientRect()
    expect(confirm.top).toBeGreaterThan(cancel.bottom)
    expect(confirm.width).toBeCloseTo(cancel.width, 0)
  },
}

/** With reduced motion the sheet does not slide: it is in place from the first frame, and fades in instead */
export const TestOnAPhoneWithReducedMotion: Story = {
  name: "Test: On a phone with reduced motion",
  globals: { viewport: { value: "mobile2", isRotated: false }, motion: "reduced" },
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("button", { name: "Supprimer la parcelle" }))
    const dialog = await page.findByRole("alertdialog")
    expect(Number(getComputedStyle(dialog).opacity)).toBeLessThan(1)
    const tops: number[] = []
    for (let count = 0; count < 5; count++) {
      tops.push(Math.round(dialog.getBoundingClientRect().top))
      await frame()
    }
    await settled()
    expect(tops).toEqual(tops.map(() => Math.round(dialog.getBoundingClientRect().top)))
  },
}

/**
 * Closed half way through appearing, it turns round from where it is and fades from there, where a keyframe exit would
 * start from the open look and flash in first. The opening is slowed down so the few milliseconds the test takes to
 * press Escape barely move it.
 */
export const TestClosedWhileOpening: Story = {
  name: "Test: Closed while opening",
  play: async () => {
    const root = document.documentElement
    root.style.setProperty("--duration-smooth", "10s")
    try {
      const page = within(document.body)
      await userEvent.click(page.getByRole("button", { name: "Supprimer la parcelle" }))
      const dialog = await page.findByRole("alertdialog")
      const opacity = () => Number(getComputedStyle(dialog).opacity)
      await waitFor(() => expect(opacity()).toBeGreaterThan(0.1), { timeout: 3000 })
      const before = opacity()

      await userEvent.keyboard("{Escape}")
      const opacities = [opacity()]
      for (let count = 0; count < 120; count++) {
        await frame()
        if (!dialog.isConnected) break
        opacities.push(opacity())
      }
      expect(opacities[0]).toBeLessThan(before + 0.05)
      expect(opacities).toEqual([...opacities].sort((a, b) => b - a))
      expect(opacities.at(-1)).toBeLessThan(0.05)
    } finally {
      root.style.removeProperty("--duration-smooth")
    }
  },
}

function frame() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

export const TestOpenInDarkTheme: Story = {
  name: "Test: Open in dark theme",
  ...Open,
  globals: { theme: "dark" },
}

export const TestOpenWithMoreContrast: Story = {
  name: "Test: Open with more contrast",
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
export const TestWithAForm: Story = {
  name: "Test: With a form",
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

/** A long form: a parcel's whole record, more than a sheet holds comfortably on a phone */
function EditParcel(props: Dialog.RootProps & { fields?: number }) {
  const fields = ["Nom", "Surface (ha)", "Culture", "Variété", "Date de semis", "Densité", "Précédent", "Commentaire"]
  return (
    <Dialog.Root {...omit(props, "fields")}>
      <Dialog.Trigger as={Button}>Modifier la parcelle</Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Title>Les Grands Champs</Dialog.Title>
          <Dialog.Description>Ce qui change ici vaut pour toute la campagne.</Dialog.Description>
          <For each={fields.slice(0, untrack(() => props.fields) ?? fields.length)}>
            {(field, index) => (
              <div class="grid gap-2">
                <label for={`parcel-${index()}`} class="font-semibold">
                  {field}
                </label>
                <Input id={`parcel-${index()}`} />
              </div>
            )}
          </For>
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

/** On a phone a long form takes the whole screen, its buttons at the foot of it */
export const FullScreenOnAPhone: Story = {
  render: (args) => <EditParcel phone="full-screen" defaultOpen onOpenChange={args.onOpenChange} />,
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: settled,
}

/** For filming: a long form that takes the whole screen of a phone, closed until its trigger is pressed */
export const FullScreenForm: Story = {
  render: (args) => <EditParcel phone="full-screen" size="lg" onOpenChange={args.onOpenChange} />,
}

/** From 640px the card is 28rem wide for `sm`, 32rem for `md` and 48rem for `lg`, the most a screen allows */
export const TestSizes: Story = {
  name: "Test: Sizes",
  render: () => (
    <div class="flex gap-2">
      <EditParcel size="sm" fields={1} />
      <EditParcel size="md" fields={1} />
      <EditParcel size="lg" fields={1} />
    </div>
  ),
  play: async () => {
    const page = within(document.body)
    const widths: number[] = []
    for (const [index, trigger] of page.getAllByRole("button", { name: "Modifier la parcelle" }).entries()) {
      await userEvent.click(trigger)
      const dialog = await page.findByRole("dialog")
      await settled()
      widths[index] = dialog.getBoundingClientRect().width
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(page.queryByRole("dialog")).toBeNull())
    }
    const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    expect(widths[0]).toBeCloseTo(Math.min(28 * rem, innerWidth - 3 * rem), 0)
    expect(widths[1]).toBeCloseTo(Math.min(32 * rem, innerWidth - 3 * rem), 0)
    expect(widths[2]).toBeCloseTo(Math.min(48 * rem, innerWidth - 3 * rem), 0)
  },
}

/**
 * On a phone, a full-screen dialog slides up from the bottom edge solid, covers the whole screen, and keeps its buttons
 * at the foot of it, under the thumb, even when the form is short. Escape slides it back down.
 */
export const TestFullScreenOnAPhone: Story = {
  name: "Test: Full screen on a phone",
  render: (args) => <EditParcel phone="full-screen" fields={2} onOpenChange={args.onOpenChange} />,
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async ({ args }) => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("button", { name: "Modifier la parcelle" }))
    const dialog = await page.findByRole("dialog", { name: "Les Grands Champs" })
    const rising = dialog.getBoundingClientRect().top
    for (let count = 0; count < 5; count++) {
      expect(getComputedStyle(dialog).opacity).toBe("1")
      await frame()
    }
    await settled()
    const screen = dialog.getBoundingClientRect()
    expect(rising).toBeGreaterThan(screen.top)
    expect(screen.top).toBeCloseTo(0, 0)
    expect(screen.bottom).toBeCloseTo(innerHeight, 0)
    expect(screen.width).toBeCloseTo(innerWidth, 0)
    expect(getComputedStyle(dialog).borderTopLeftRadius).toBe("0px")
    const save = page.getByRole("button", { name: "Enregistrer" }).getBoundingClientRect()
    expect(innerHeight - save.bottom).toBeLessThan(32)

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(page.queryByRole("dialog")).toBeNull())
    expect(args.onOpenChange).toHaveBeenLastCalledWith({ open: false })
  },
}

/** A long form scrolls under its buttons, which stay at the foot of the screen */
export const TestFullScreenScrollsUnderItsActions: Story = {
  name: "Test: Full screen scrolls under its actions",
  ...FullScreenOnAPhone,
  play: async () => {
    const dialog = await within(document.body).findByRole("dialog")
    await settled()
    expect(dialog.scrollHeight).toBeGreaterThan(dialog.clientHeight)
    const save = within(dialog).getByRole("button", { name: "Enregistrer" })
    const before = save.getBoundingClientRect().bottom
    dialog.scrollTop = 120
    await frame()
    expect(save.getBoundingClientRect().bottom).toBeCloseTo(before, 0)
    expect(innerHeight - before).toBeLessThan(32)
  },
}

/** With reduced motion a full-screen dialog does not slide: it is in place from the first frame, and fades in */
export const TestFullScreenWithReducedMotion: Story = {
  name: "Test: Full screen with reduced motion",
  render: (args) => <EditParcel phone="full-screen" fields={2} onOpenChange={args.onOpenChange} />,
  globals: { viewport: { value: "mobile2", isRotated: false }, motion: "reduced" },
  play: async () => {
    const page = within(document.body)
    await userEvent.click(page.getByRole("button", { name: "Modifier la parcelle" }))
    const dialog = await page.findByRole("dialog")
    expect(Number(getComputedStyle(dialog).opacity)).toBeLessThan(1)
    const tops: number[] = []
    for (let count = 0; count < 5; count++) {
      tops.push(Math.round(dialog.getBoundingClientRect().top))
      await frame()
    }
    await settled()
    expect(tops).toEqual(tops.map(() => 0))
  },
}

/**
 * Closed half way up, a full-screen dialog turns round from where it is and slides back down, never jumping to the top
 * first. The slide is slowed down so the test's Escape lands half way.
 */
export const TestFullScreenClosedWhileOpening: Story = {
  name: "Test: Full screen closed while opening",
  render: (args) => <EditParcel phone="full-screen" fields={2} onOpenChange={args.onOpenChange} />,
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async () => {
    const root = document.documentElement
    root.style.setProperty("--duration-sheet", "10s")
    try {
      const page = within(document.body)
      await userEvent.click(page.getByRole("button", { name: "Modifier la parcelle" }))
      const dialog = await page.findByRole("dialog")
      await waitFor(() => expect(dialog.getBoundingClientRect().top).toBeLessThan(innerHeight * 0.8), { timeout: 3000 })
      const before = dialog.getBoundingClientRect().top
      await userEvent.keyboard("{Escape}")
      const tops = [dialog.getBoundingClientRect().top]
      for (let count = 0; count < 120; count++) {
        await frame()
        if (!dialog.isConnected) break
        tops.push(dialog.getBoundingClientRect().top)
      }
      expect(tops[0]).toBeGreaterThan(before - innerHeight * 0.05)
      expect(tops).toEqual([...tops].sort((a, b) => a - b))
    } finally {
      root.style.removeProperty("--duration-sheet")
    }
  },
}

export const TestFullScreenInDarkTheme: Story = {
  ...FullScreenOnAPhone,
  name: "Test: Full screen in dark theme",
  globals: { viewport: { value: "mobile2", isRotated: false }, theme: "dark" },
}
