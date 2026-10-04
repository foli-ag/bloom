import { createSignal, For } from "solid-js"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button, type ButtonProps } from "./index.js"

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Enregistrer", onClick: fn() },
  argTypes: {
    tone: { control: "inline-radio", options: ["primary", "neutral", "danger"] },
    variant: { control: "inline-radio", options: ["solid", "soft", "outline", "ghost"] },
    size: { control: "inline-radio", options: ["md", "lg"] },
    block: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<ButtonProps>

export default meta
type Story = StoryObj<typeof meta>

/** 48px tall, 18px text, dark ink on the brand green. Its props are in the Controls panel. */
export const Playground: Story = {}

/** 56px, for the one action a screen is about. `block` stretches it across the width, within the thumb's reach. */
export const Large: Story = {
  args: { size: "lg", block: true },
  parameters: { layout: "padded" },
}

/** Every tone at every emphasis. */
export const Tones: Story = {
  render: () => <Matrix />,
  parameters: { layout: "padded" },
}

/** Shows the busy state at rest. The "Test: Saving flow" story is the one to read for how it behaves. */
export const Loading: Story = {
  args: { loading: true, children: "Enregistrement…" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

/** As a link: the same look, rendered by whatever `as` names, a tag here and a router's Link in an app. */
export const AsLink: Story = {
  render: () => (
    <Button as="a" href="#mes-champs" variant="outline">
      Mes champs
    </Button>
  ),
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

/**
 * The flow a farmer on a poor connection goes through. The button is busy, the app changes its words, and a second tap
 * does nothing: the handler runs once. The button keeps focus throughout, because `disabled` would send it back to
 * the top of the page.
 */
export const TestSavingFlow: Story = {
  name: "Test: Saving flow",
  render: () => <SavingFlow />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Enregistrer" })
    await userEvent.click(button)
    await userEvent.click(button)
    await waitFor(() => expect(button).toHaveAttribute("aria-busy", "true"))
    expect(button).toHaveAccessibleName("Enregistrement…")
    expect(button).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(button).toHaveAccessibleName("Enregistré"), { timeout: 2500 })
    expect(button).not.toHaveAttribute("aria-busy")
    expect(canvasElement.querySelector("[data-saves]")).toHaveTextContent("1 envoi")
  },
}

const tones = ["primary", "neutral", "danger"] as const
const variants = ["solid", "soft", "outline", "ghost"] as const

function Matrix() {
  return (
    <div class="grid gap-3">
      <For each={tones}>
        {(tone) => (
          <div class="flex flex-wrap items-center gap-3">
            <For each={variants}>
              {(variant) => (
                <Button tone={tone} variant={variant}>
                  {tone === "danger" ? "Supprimer" : "Enregistrer"}
                </Button>
              )}
            </For>
            <Button tone={tone} disabled>
              Indisponible
            </Button>
          </div>
        )}
      </For>
    </div>
  )
}

function SavingFlow() {
  const [state, setState] = createSignal<"idle" | "saving" | "saved">("idle")
  const [saves, setSaves] = createSignal(0)
  function save() {
    setSaves((count) => count + 1)
    setState("saving")
    setTimeout(() => setState("saved"), 900)
  }
  return (
    <div class="grid justify-items-start gap-3">
      <Button loading={state() === "saving"} onClick={save}>
        {state() === "saving" ? "Enregistrement…" : state() === "saved" ? "Enregistré" : "Enregistrer"}
      </Button>
      <p data-saves class="text-sm text-muted">
        {saves()} envoi{saves() > 1 ? "s" : ""}
      </p>
    </div>
  )
}
