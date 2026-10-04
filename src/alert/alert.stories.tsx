import { createSignal, For, Show } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { Alert } from "./index.js"

function Offline(props: Partial<Alert.RootProps>) {
  return (
    <div class="w-96">
      <Alert.Root tone="danger" {...props}>
        <Alert.Indicator />
        <Alert.Title>Enregistrement impossible</Alert.Title>
        <Alert.Description>Pas de réseau. Vos saisies sont gardées sur le téléphone.</Alert.Description>
        <Alert.Actions>
          <Button tone="neutral" variant="outline">
            Réessayer
          </Button>
        </Alert.Actions>
        <Alert.Trigger.Close as={Button} tone="neutral" variant="ghost">
          Fermer
        </Alert.Trigger.Close>
      </Alert.Root>
    </div>
  )
}

const meta = {
  title: "Components/Alert",
  component: Offline,
  tags: ["autodocs"],
  args: { onOpenChange: fn() },
} satisfies Meta<typeof Offline>

export default meta
type Story = StoryObj<typeof meta>

/** A save that failed, with a way to try again and a way to dismiss it. Its props are in the Controls panel. */
export const Playground: Story = {
  args: { tone: "danger", urgent: true },
  argTypes: {
    tone: { control: "inline-radio", options: ["info", "success", "warning", "danger"] },
    urgent: { control: "boolean" },
  },
}

const news = {
  info: ["Mise à jour disponible", "Les nouvelles parcelles PAC sont arrivées."],
  success: ["Parcelle enregistrée", "Les Grands Champs sont à jour."],
  warning: ["Semis en retard", "La Combe aurait dû être semée le 15 octobre."],
  danger: ["Enregistrement impossible", "Pas de réseau. Vos saisies sont gardées sur le téléphone."],
} as const

/** Each tone with its mark: the shape of the mark and the words say it, the color only adds to it */
export const Tones: Story = {
  render: () => (
    <div class="grid w-96 gap-3">
      <For each={["info", "success", "warning", "danger"] as const}>
        {(tone) => (
          <Alert.Root tone={tone}>
            <Alert.Indicator />
            <Alert.Title>{news[tone][0]}</Alert.Title>
            <Alert.Description>{news[tone][1]}</Alert.Description>
          </Alert.Root>
        )}
      </For>
    </div>
  ),
}

/** One line, with no title: the close button stays within the line's height */
export const OneLine: Story = {
  render: () => (
    <div class="w-96">
      <Alert.Root tone="success">
        <Alert.Indicator />
        <Alert.Description>Parcelle enregistrée.</Alert.Description>
        <Alert.Trigger.Close as={Button} tone="neutral" variant="ghost">
          Fermer
        </Alert.Trigger.Close>
      </Alert.Root>
    </div>
  ),
}

// An alert above a card, dismissed and brought back, as an app would
function Dismissible(props: { onOpenChange?: ((details: Alert.OpenChangeDetails) => void) | undefined }) {
  const [open, setOpen] = createSignal(true)
  return (
    <div class="grid w-96">
      <Alert.Root
        tone="warning"
        open={open()}
        onOpenChange={(details) => {
          setOpen(details.open)
          props.onOpenChange?.(details)
        }}
        class="mb-4"
      >
        <Alert.Indicator />
        <Alert.Title>Semis en retard</Alert.Title>
        <Alert.Description>La Combe aurait dû être semée le 15 octobre.</Alert.Description>
        <Alert.Trigger.Close as={Button} tone="neutral" variant="ghost">
          Fermer
        </Alert.Trigger.Close>
      </Alert.Root>
      <div data-below class="rounded-card border-2 border-border bg-raised p-5">
        La Combe, colza, 8 ha
      </div>
      <Button tone="neutral" variant="outline" class="mt-4 justify-self-start" onClick={() => setOpen(true)}>
        Réafficher
      </Button>
    </div>
  )
}

/** Dismissed, it folds away and what is below moves up with it. "Réafficher" brings it back the same way. */
export const Dismissing: Story = {
  parameters: { layout: "padded" },
  render: (args) => <Dismissible onOpenChange={args.onOpenChange} />,
}

/**
 * Its role says how a screen reader takes it: an urgent alert breaks in, any other waits for a pause. It never takes
 * focus: the button that brought it keeps it.
 */
export const TestItNeverTakesFocus: Story = {
  name: "Test: It never takes focus",
  render: () => {
    const [shown, setShown] = createSignal(false)
    return (
      <div class="grid w-96 gap-3">
        <Button onClick={() => setShown(true)}>Enregistrer</Button>
        <Show when={shown()}>
          <Alert.Root tone="danger" urgent>
            <Alert.Indicator />
            <Alert.Title>Enregistrement impossible</Alert.Title>
            <Alert.Trigger.Close as={Button} tone="neutral" variant="ghost">
              Fermer
            </Alert.Trigger.Close>
          </Alert.Root>
          <Alert.Root tone="info">
            <Alert.Title>Vos saisies sont gardées sur le téléphone.</Alert.Title>
          </Alert.Root>
        </Show>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const save = canvas.getByRole("button", { name: "Enregistrer" })
    await userEvent.click(save)
    expect(await canvas.findByRole("alert")).toHaveTextContent("Enregistrement impossible")
    expect(canvas.getByRole("status")).toHaveTextContent("Vos saisies sont gardées sur le téléphone.")
    expect(save).toHaveFocus()
    // The mark is decoration: the words carry the news
    expect(canvas.getByRole("alert").querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  },
}

/**
 * Dismissed, it folds away: it fades as its height closes, and the card below moves up on every frame, never by a
 * jump, then the alert is gone. Focus goes on to what follows it.
 */
export const TestDismissing: Story = {
  ...Dismissing,
  name: "Test: Dismissing",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const below = canvasElement.querySelector<HTMLElement>("[data-below]")!
    const alert = canvas.getByRole("status")
    // Nothing moves as the page loads
    expect(alert.getAnimations({ subtree: true })).toEqual([])
    const top = () => below.getBoundingClientRect().top
    const start = top()

    await userEvent.click(canvas.getByRole("button", { name: "Fermer" }))
    expect(args.onOpenChange).toHaveBeenLastCalledWith({ open: false })
    const tops = [start]
    while (alert.isConnected) {
      await new Promise(requestAnimationFrame)
      tops.push(top())
    }
    const end = top()
    expect(end).toBeLessThan(start - 40)
    const travel = start - end
    for (let index = 1; index < tops.length; index++)
      expect(tops[index - 1]! - tops[index]!, `frame ${index}`).toBeLessThan(travel / 2)
    expect(canvas.getByRole("button", { name: "Réafficher" })).toHaveFocus()
  },
}

/** Brought back half way through folding, it unfolds from where it is: its height never reaches zero first */
export const TestChangingYourMind: Story = {
  ...Dismissing,
  name: "Test: Changing your mind",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alert = canvas.getByRole("status")
    const full = alert.getBoundingClientRect().height
    await userEvent.click(canvas.getByRole("button", { name: "Fermer" }))
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    await userEvent.click(canvas.getByRole("button", { name: "Réafficher" }))
    const heights: number[] = []
    for (let frame = 0; frame < 12; frame++) {
      await new Promise(requestAnimationFrame)
      heights.push(alert.getBoundingClientRect().height)
    }
    expect(alert.isConnected).toBe(true)
    expect(Math.min(...heights)).toBeGreaterThan(full / 4)
    await settled()
    expect(alert.getBoundingClientRect().height).toBeCloseTo(full, 0)
  },
}

/** With reduced motion it does not fold: it fades where it is, and then what is below moves up */
export const TestDismissingWithReducedMotion: Story = {
  ...Dismissing,
  name: "Test: Dismissing with reduced motion",
  globals: { motion: "reduced" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alert = canvas.getByRole("status")
    const height = alert.getBoundingClientRect().height
    await userEvent.click(canvas.getByRole("button", { name: "Fermer" }))
    for (let frame = 0; frame < 4; frame++) {
      await new Promise(requestAnimationFrame)
      if (alert.isConnected) expect(alert.getBoundingClientRect().height).toBeCloseTo(height, 0)
    }
    await waitFor(() => expect(alert.isConnected).toBe(false))
  },
}

export const TestTonesInDarkTheme: Story = {
  ...Tones,
  name: "Test: Tones in dark theme",
  globals: { theme: "dark" },
}

export const TestTonesWithMoreContrast: Story = {
  ...Tones,
  name: "Test: Tones with more contrast",
  globals: { contrast: "more" },
}

export const TestTonesInDarkThemeWithMoreContrast: Story = {
  ...Tones,
  name: "Test: Tones in dark theme with more contrast",
  globals: { theme: "dark", contrast: "more" },
}
