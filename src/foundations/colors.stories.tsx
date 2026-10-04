import { expect } from "storybook/test"
import { For } from "solid-js"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { pairs, ratio, settings, withSetting, type Pair } from "./contrast.js"

const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** The brand green and the scale cut from it at the same hue. 500 is `#74b24c` itself. */
export const PrimaryScale: Story = {
  render: () => (
    <section class="grid max-w-3xl gap-4">
      <p class="max-w-prose">
        500 is the brand fill. It is only 2.5:1 on white, so it always carries dark ink and never serves as text. 700 is
        for edges and 800 for green text on a light surface. In the dark theme, text takes 300.
      </p>
      <ol class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <For each={steps}>
          {(step) => (
            <li class="grid gap-1">
              <div
                class="grid h-16 place-items-center rounded-control border-2 border-border text-lg font-bold"
                style={{ "background-color": `var(--color-primary-${step})`, color: inkOn(step) }}
              >
                {step}
              </div>
              <code class="text-sm">primary-{step}</code>
            </li>
          )}
        </For>
      </ol>
    </section>
  ),
}

/**
 * Every pair a component relies on, measured in the browser in the four settings a farmer can end up with: light and
 * dark, each with and without more contrast. Text pairs must reach 7:1 and edges and rings 3:1. The play function
 * fails the story when any pair falls short, so a re-skin that lowers a token is caught here.
 */
export const Contrast: Story = {
  render: () => (
    <section class="grid max-w-4xl gap-4">
      <p class="max-w-prose">
        The table is measured for the setting chosen in the toolbar. Use the Theme and Contrast switches to see the
        others.
      </p>
      <table class="w-full border-collapse text-left">
        <caption class="sr-only">Contrast ratio of each pair of tokens, and whether it reaches its target</caption>
        <thead>
          <tr class="border-b-2 border-strong">
            <th scope="col" class="py-2 pe-4">
              Pair
            </th>
            <th scope="col" class="py-2 pe-4">
              Sample
            </th>
            <th scope="col" class="py-2 pe-4">
              Ratio
            </th>
            <th scope="col" class="py-2">
              Target
            </th>
          </tr>
        </thead>
        <tbody>
          <For each={pairs}>{(pair) => <ContrastRow pair={pair} />}</For>
        </tbody>
      </table>
    </section>
  ),
  play: () => {
    for (const setting of settings) {
      const short = withSetting(setting, () =>
        pairs.filter((pair) => ratio(pair) < pair.minimum).map((pair) => `${pair.name} ${ratio(pair).toFixed(2)}:1`),
      )
      expect(short, `${setting.theme} theme, ${setting.contrast} contrast`).toEqual([])
    }
  },
}

/** Success is the primary green. Danger differs from it in lightness as well as hue, and no status is color alone. */
export const Tones: Story = {
  render: () => (
    <ul class="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
      <For each={tones}>
        {(tone) => (
          <li class="grid gap-3 rounded-card border-2 border-border bg-raised p-4">
            <h3 class="text-xl font-bold tracking-heading">{tone.name}</h3>
            <p class={`rounded-control px-3 py-2 font-semibold ${tone.fill}`}>
              <span aria-hidden="true">{tone.icon} </span>
              {tone.sample}
            </p>
            <p class={`rounded-control border-2 px-3 py-2 ${tone.soft}`}>
              <span aria-hidden="true">{tone.icon} </span>
              {tone.sample}
            </p>
            <p class={`font-semibold ${tone.text}`}>
              <span aria-hidden="true">{tone.icon} </span>
              {tone.sample}
            </p>
          </li>
        )}
      </For>
    </ul>
  ),
}

function ContrastRow(props: { pair: Pair }) {
  const measured = () => ratio(props.pair)
  const passes = () => measured() >= props.pair.minimum
  return (
    <tr class="border-b border-border">
      <th scope="row" class="py-3 pe-4 font-medium">
        {props.pair.name}
      </th>
      <td class="py-3 pe-4">
        <Sample pair={props.pair} />
      </td>
      <td class="py-3 pe-4 font-semibold tabular-nums">{measured().toFixed(2)}:1</td>
      <td class="py-3">
        <span aria-hidden="true">{passes() ? "✓ " : "✗ "}</span>
        {props.pair.minimum}:1 {passes() ? "reached" : "not reached"}
      </td>
    </tr>
  )
}

// Text pairs show text, and edges and rings show an edge and a ring, so the sample is what the ratio is about
function Sample(props: { pair: Pair }) {
  return props.pair.minimum === 7 ? (
    <span
      class="inline-block rounded-box px-3 py-1 font-semibold"
      style={{ color: `var(${props.pair.front})`, "background-color": `var(${props.pair.ground})` }}
    >
      Récolte 7,4 t/ha
    </span>
  ) : (
    <span
      class="inline-block h-8 w-24 rounded-box border-[3px]"
      style={{ "border-color": `var(${props.pair.front})`, "background-color": `var(${props.pair.ground})` }}
    />
  )
}

const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

// Ink that reads on a step: dark up to 600, light above it. The labels are large text, which needs 4.5:1 for AAA.
function inkOn(step: (typeof steps)[number]) {
  return step <= 600 ? "var(--color-on-primary)" : "oklch(0.97 0.02 134.8)"
}

const tones = [
  {
    name: "Success and primary",
    icon: "✓",
    sample: "Parcelle enregistrée",
    fill: "bg-primary text-on-primary",
    soft: "border-primary-edge bg-primary-soft text-primary-text",
    text: "text-primary-text",
  },
  {
    name: "Danger",
    icon: "✕",
    sample: "Suppression impossible",
    fill: "bg-danger text-on-danger",
    soft: "border-danger-text bg-danger-soft text-danger-text",
    text: "text-danger-text",
  },
  {
    name: "Warning",
    icon: "!",
    sample: "Récolte en retard",
    fill: "bg-warning text-on-warning",
    soft: "border-warning-text bg-warning-soft text-warning-text",
    text: "text-warning-text",
  },
  {
    name: "Info",
    icon: "i",
    sample: "Mise à jour disponible",
    fill: "bg-info text-on-info",
    soft: "border-info-text bg-info-soft text-info-text",
    text: "text-info-text",
  },
] as const
