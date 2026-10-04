import { For } from "solid-js"
import { expect, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Badge } from "./index.js"

const tones = ["neutral", "primary", "success", "info", "warning", "danger"] as const
const variants = ["soft", "solid", "outline"] as const
const words = {
  neutral: "Brouillon",
  primary: "En culture",
  success: "Validé",
  info: "Mis à jour",
  warning: "En retard",
  danger: "Refusé",
} as const

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "En retard", tone: "warning", variant: "soft", indicator: "mark" },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** A short status next to what it is about. Its props are in the Controls panel. */
export const Playground: Story = {
  argTypes: {
    tone: { control: "inline-radio", options: tones },
    variant: { control: "inline-radio", options: variants },
    indicator: { control: "inline-radio", options: [undefined, "dot", "mark"] },
    children: { control: "text" },
  },
}

/** Every tone in every variant, with its mark: the words and the mark's shape say it, the color only adds to it. */
export const Tones: Story = {
  render: () => <AllTones indicator="mark" />,
}

/** A dot instead of a mark, for a calm list where a status only needs a sign */
export const WithADot: Story = {
  render: () => <AllTones indicator="dot" />,
}

/** A count: one digit is as wide as it is tall. The hidden word tells a screen reader what is counted. */
export const Count: Story = {
  render: () => (
    <p class="flex items-center gap-2 text-base font-semibold">
      Alertes
      <Badge tone="danger" variant="solid">
        3<span class="sr-only"> alertes</span>
      </Badge>
      <Badge tone="neutral" variant="outline">
        12<span class="sr-only"> parcelles</span>
      </Badge>
    </p>
  ),
}

/** In a row of a list, after the words it qualifies */
export const InAList: Story = {
  render: () => (
    <ul class="grid w-80 divide-y-2 divide-border rounded-card border-2 border-border bg-raised">
      <For
        each={
          [
            ["Les Grands Champs", "success", "Semé"],
            ["La Combe", "warning", "En retard"],
            ["Le Moulin", "neutral", "Brouillon"],
          ] as const
        }
      >
        {([name, tone, status]) => (
          <li class="flex min-h-14 items-center justify-between gap-3 px-4 py-2">
            {name}
            <Badge tone={tone} indicator="mark">
              {status}
            </Badge>
          </li>
        )}
      </For>
    </ul>
  ),
}

function AllTones(props: { indicator: "dot" | "mark" }) {
  return (
    <div class="grid gap-3">
      <For each={variants}>
        {(variant) => (
          <div class="flex flex-wrap gap-2">
            <For each={tones}>
              {(tone) => (
                <Badge tone={tone} variant={variant} indicator={props.indicator}>
                  {words[tone]}
                </Badge>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  )
}

/**
 * Its words are its name, and its sign is decoration: a screen reader says "En retard" and nothing about a triangle.
 * Its text is 16px, the smallest bloom sets.
 */
export const TestWordsCarryTheMeaning: Story = {
  name: "Test: Words carry the meaning",
  play: ({ canvasElement }) => {
    const badge = within(canvasElement).getByText("En retard")
    expect(badge.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
    expect(badge).toHaveTextContent(/^En retard$/)
    expect(Number.parseFloat(getComputedStyle(badge).fontSize)).toBeGreaterThanOrEqual(16)
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
