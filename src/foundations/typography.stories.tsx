import { expect } from "storybook/test"
import type { JSX } from "@solidjs/web"
import { For } from "solid-js"
import type { Meta, StoryObj } from "storybook-solidjs-vite"

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// One story per text style, so each can be read, tested and linked on its own. Each is a recipe of classes: bloom
// ships tokens, not a Text component. Nothing is set under 16px and nothing under weight 500.

/** The largest text, for a screen's one title. */
export const Display: Story = {
  render: () => (
    <Style name="Display" classes="text-4xl font-bold tracking-heading">
      Campagne 2026
    </Style>
  ),
}

/** A page title. */
export const Title: Story = {
  render: () => (
    <Style name="Title" classes="text-3xl font-bold tracking-heading">
      Mes parcelles
    </Style>
  ),
}

/** A section of a page. */
export const Heading: Story = {
  render: () => (
    <Style name="Heading" classes="text-2xl font-bold tracking-heading">
      Orge d'hiver
    </Style>
  ),
}

/** The title of a card or a group of fields. */
export const Subheading: Story = {
  render: () => (
    <Style name="Subheading" classes="text-xl font-semibold tracking-heading">
      Les Œillets, 12,5 ha
    </Style>
  ),
}

/** Running text. The weight is 500: thin strokes wash out in glare. */
export const Body: Story = {
  render: () => (
    <Style name="Body" classes="text-base font-medium tracking-body">
      Semis prévu après le 15 octobre, dès que le sol est ressuyé. Prévoir 180 kg de semences à l'hectare.
    </Style>
  ),
}

/** The name of a field or a button. */
export const Label: Story = {
  render: () => (
    <Style name="Label" classes="text-base font-semibold tracking-body">
      Surface de la parcelle
    </Style>
  ),
}

/** Help under a field, and secondary lines. 16px is the floor, and it is as dark as AAA allows for muted text. */
export const Caption: Story = {
  render: () => (
    <Style name="Caption" classes="text-sm font-medium tracking-body text-muted">
      En hectares, avec une virgule : 12,5
    </Style>
  ),
}

/** Measurements. Tabular figures keep the digits of a column the same width, so decimals line up. */
export const Figures: Story = {
  render: () => (
    <Style name="Figures" classes="text-2xl font-bold tracking-heading tabular-nums">
      <For each={["7,4 t/ha", "12,5 ha", "180 kg", "1 204,0 €"]}>{(figure) => <span class="block">{figure}</span>}</For>
    </Style>
  ),
}

/** All of them together, as a page would use them. */
export const Specimen: Story = {
  render: () => (
    <article class="grid max-w-2xl gap-3">
      <h1 data-text class="text-4xl font-bold tracking-heading">
        Campagne 2026
      </h1>
      <h2 data-text class="text-2xl font-bold tracking-heading">
        Mes parcelles
      </h2>
      <h3 data-text class="text-xl font-semibold tracking-heading">
        Les Œillets, 12,5 ha
      </h3>
      <p data-text class="text-base font-medium tracking-body">
        Semis prévu après le 15 octobre, dès que le sol est ressuyé. Prévoir 180 kg de semences à l'hectare.
      </p>
      <p data-text class="text-sm font-semibold tracking-body">
        Surface de la parcelle
      </p>
      <p data-text class="text-sm font-medium tracking-body text-muted">
        En hectares, avec une virgule : 12,5
      </p>
      <p data-text class="text-2xl font-bold tracking-heading tabular-nums">
        7,4 t/ha
      </p>
    </article>
  ),
  play: ({ canvasElement }) => {
    for (const text of canvasElement.querySelectorAll("[data-text]")) {
      const { fontSize, fontWeight } = getComputedStyle(text)
      expect(parseFloat(fontSize), `${text.tagName} size`).toBeGreaterThanOrEqual(16)
      expect(Number(fontWeight), `${text.tagName} weight`).toBeGreaterThanOrEqual(500)
    }
  },
}

/**
 * Letter spacing of body text and headings, side by side. A condensed face at weight 500 and up gets crowded when
 * tightened, so look for the point where letters start to touch, in "rn", "il" and "œ". The theme sets -0.01em and
 * -0.02em. Say which row you want.
 */
export const Tracking: Story = {
  render: () => (
    <section class="grid max-w-3xl gap-6">
      <For each={[0, -0.01, -0.02, -0.03]}>
        {(spacing) => (
          <div class="grid gap-1 border-b border-border pb-4">
            <p class="text-sm font-semibold text-muted">
              Body {spacing}em{spacing === -0.01 ? ", the theme's value" : ""}
            </p>
            <h3 class="text-2xl font-bold" style={{ "letter-spacing": `${spacing * 2}em` }}>
              Les Œillets, récolte d'orge
            </h3>
            <p class="text-base font-medium" style={{ "letter-spacing": `${spacing}em` }}>
              Semis prévu après le 15 octobre, dès que le sol est ressuyé : 7,4 t/ha attendus sur la parcelle « Les
              Œillets », soit 92 quintaux pour l'ensemble des îlots irrigués.
            </p>
          </div>
        )}
      </For>
    </section>
  ),
}

/**
 * The French characters, and the self-hosted font that has to carry them. The play function waits for the three weights
 * to load and checks that each covers "œ", which sits outside basic Latin.
 */
export const French: Story = {
  render: () => (
    <section class="grid max-w-3xl gap-3">
      <For each={[500, 600, 700]}>
        {(weight) => (
          <p class="text-2xl tracking-body" data-weight={weight} style={{ "font-weight": weight }}>
            À Â Ç É È Ê Ë Î Ï Ô Œ Ù Û Ü Ÿ à â ç é è ê ë î ï ô œ ù û ü ÿ « » € ’
          </p>
        )}
      </For>
    </section>
  ),
  play: async () => {
    for (const weight of [500, 600, 700]) {
      const loaded = await document.fonts.load(`${weight} 18px "Barlow Semi Condensed"`, "œÉç")
      expect(loaded.length, `Barlow Semi Condensed ${weight}`).toBeGreaterThan(0)
    }
  },
}

function Style(props: { name: string; classes: string; children: JSX.Element }) {
  return (
    <section class="grid max-w-2xl gap-3">
      <p class="text-sm font-semibold text-muted">
        {props.name} · <code>{props.classes}</code>
      </p>
      <div data-text class={props.classes}>
        {props.children}
      </div>
    </section>
  )
}
