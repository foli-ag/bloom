import { For } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { settled } from "../foundations/settled.js"
import { Steps } from "./index.js"

const steps = [
  { name: "Parcelle", ask: "Sur quelle parcelle avez-vous traité ?" },
  { name: "Produit", ask: "Quel produit, à quelle dose ?" },
  { name: "Récapitulatif", ask: "Vérifiez avant d'enregistrer." },
]

function Intervention(props: Partial<Steps.RootProps>) {
  return (
    <Steps.Root count={steps.length} class="w-[min(36rem,100%)]" {...props}>
      <Steps.List>
        <For each={steps}>{(step, index) => <Steps.Item index={index()}>{step.name}</Steps.Item>}</For>
      </Steps.List>
      <For each={steps}>
        {(step, index) => (
          <Steps.Content index={index()}>
            <p>{step.ask}</p>
          </Steps.Content>
        )}
      </For>
      <Steps.CompletedContent>
        <p>Intervention enregistrée.</p>
      </Steps.CompletedContent>
      <div class="flex justify-between gap-3">
        <Steps.Prev as={Button} tone="neutral" variant="outline">
          Précédent
        </Steps.Prev>
        <Steps.Next as={Button}>Suivant</Steps.Next>
      </div>
    </Steps.Root>
  )
}

const meta = {
  title: "Components/Steps",
  component: Intervention,
  tags: ["autodocs"],
  args: { onStepChange: fn() },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Intervention>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The current step is announced as selected, and its content shows. Next moves on and ticks the step left behind,
 * whose number gives way to the tick. A step already done is a button back to it. Past the last step the completed
 * content shows, and Next is disabled.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const parcel = canvas.getByRole("tab", { name: "Parcelle" })
    expect(parcel).toHaveAttribute("aria-selected", "true")
    expect(canvas.getByRole("tabpanel")).toHaveTextContent("Sur quelle parcelle")
    expect(canvas.getByRole("button", { name: "Précédent" })).toBeDisabled()

    await userEvent.click(canvas.getByRole("button", { name: "Suivant" }))
    expect(canvas.getByRole("tab", { name: "Produit" })).toHaveAttribute("aria-selected", "true")
    expect(parcel).toHaveAttribute("data-complete")
    expect(parcel.querySelector("[data-part=indicator]")).not.toHaveTextContent("1")
    expect(args.onStepChange).toHaveBeenLastCalledWith({ step: 1 })

    await userEvent.click(parcel)
    expect(parcel).toHaveAttribute("aria-selected", "true")

    const next = canvas.getByRole("button", { name: "Suivant" })
    for (let step = 0; step < steps.length; step++) await userEvent.click(next)
    await settled()
    expect(canvas.getByText("Intervention enregistrée.")).toBeVisible()
    expect(next).toBeDisabled()
  },
}

/** On a phone the three steps fit across the screen, their names under their circles, and nothing scrolls sideways */
export const OnAPhone: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    for (const tab of within(canvasElement).getAllByRole("tab")) {
      expect(tab.getBoundingClientRect().right).toBeLessThanOrEqual(innerWidth)
    }
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(innerWidth)
  },
}

/** Down the side, for more steps than fit across a phone. The line to the next step turns green once it is done. */
export const Vertical: Story = {
  args: { orientation: "vertical", defaultStep: 1 },
}

export const InDarkTheme: Story = {
  args: { defaultStep: 1 },
  globals: { theme: "dark" },
}

export const WithMoreContrast: Story = {
  args: { defaultStep: 1 },
  globals: { contrast: "more" },
}
