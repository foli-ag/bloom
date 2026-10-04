import type { JSX } from "@solidjs/web"
import { createSignal, Show } from "solid-js"
import { expect, fn, userEvent, within } from "storybook/test"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { Button } from "../button/index.js"
import { Input, type InputProps } from "./index.js"

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
  },
  decorators: [(Story) => <div class="w-[min(24rem,90vw)]">{Story()}</div>],
} satisfies Meta<InputProps>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A field is a visible label, the input, and help under it, wired together with `aria-describedby`. Its props are in
 * the Controls panel.
 */
export const Playground: Story = {
  render: (args) => <ParcelName {...args} />,
}

/** `inputmode="decimal"` opens the numeric pad with a decimal key on a phone. */
export const Numeric: Story = {
  render: (args) => (
    <Field label="Rendement en t/ha" id="rendement" hint="Par exemple 7,4">
      <Input
        {...args}
        id="rendement"
        name="rendement"
        inputmode="decimal"
        autocomplete="off"
        aria-describedby="rendement-hint"
      />
    </Field>
  ),
}

/** 56px, for a field that is the point of its screen. */
export const Large: Story = {
  args: { size: "lg" },
  render: (args) => <ParcelName {...args} />,
}

export const Disabled: Story = {
  render: (args) => (
    <Field label="Exploitation" id="exploitation" hint="Fixée par votre coopérative.">
      <Input {...args} id="exploitation" disabled value="GAEC des Trois Chênes" aria-describedby="exploitation-hint" />
    </Field>
  ),
}

/** A unit at the end of the box, muted, so the number reads first. A press on it puts the caret in the field. */
export const WithAUnit: Story = {
  render: (args) => <Surface {...args} />,
}

/** A mark before the text says what the field is for. It is decoration: the label names the field. */
export const WithAMark: Story = {
  render: (args) => (
    <Field label="Rechercher une parcelle" id="recherche" hint="Par son nom ou son numéro d'îlot.">
      <Input {...args} id="recherche" name="recherche" type="search" aria-describedby="recherche-hint">
        <Input.Start>
          <SearchMark />
        </Input.Start>
      </Input>
    </Field>
  ),
}

/**
 * A button at the end of the box, here one that empties the field and shows only while there is something to empty. It
 * stays a button, named by its own words, and sits flush in the box at the full 48px.
 */
export const WithAButton: Story = {
  render: (args) => <Search {...args} />,
}

/** The unit greys with the field, and the box takes the invalid line as an input alone does */
export const InvalidWithAUnit: Story = {
  render: (args) => (
    <Field label="Surface en hectares" id="surface" hint="Saisissez un nombre, avec une virgule : 12,5" problem>
      <Input {...args} id="surface" name="surface" invalid value="douze" aria-describedby="surface-hint">
        <Input.End>ha</Input.End>
      </Input>
    </Field>
  ),
}

export const DisabledWithAUnit: Story = {
  render: (args) => (
    <Field label="Surface déclarée" id="declaree" hint="Reprise de la déclaration PAC.">
      <Input {...args} id="declaree" disabled value="12,5" aria-describedby="declaree-hint">
        <Input.End>ha</Input.End>
      </Input>
    </Field>
  ),
}

/** Start and End are sides of the text, not of the screen: in a right-to-left page the unit sits on the left */
export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl" lang="ar">
      <Field label="المساحة" id="masaha" hint="بالهكتار">
        <Input {...args} id="masaha" name="masaha" inputmode="decimal" value="12,5" aria-describedby="masaha-hint">
          <Input.Start>
            <SearchMark />
          </Input.Start>
          <Input.End>هكتار</Input.End>
        </Input>
      </Field>
    </div>
  ),
}

/**
 * A field is a visible label, the input, and help under it. The input is wired to the help with `aria-describedby`.
 * Its focus ring is there at once in the focus color: an eased one shows for a moment in the text color first.
 */
export const TestTypingInTheField: Story = {
  name: "Test: Typing in the field",
  render: (args) => <ParcelName {...args} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Nom de la parcelle")
    await userEvent.click(input)
    expect(
      input
        .getAnimations()
        .filter((animation) => animation instanceof CSSTransition && animation.transitionProperty === "outline-color"),
    ).toHaveLength(0)
    await userEvent.type(input, "Les Œillets")
    expect(input).toHaveValue("Les Œillets")
    expect(input).toHaveAccessibleDescription("Le nom que vous lui donnez, par exemple « Les Œillets ».")
  },
}

/**
 * An invalid input says so in three ways that do not depend on color: `aria-invalid`, a second line on its edge, and
 * text that names the problem and is read out with the field.
 */
export const TestInvalidFieldAndItsProblem: Story = {
  name: "Test: Invalid field and its problem",
  render: (args) => (
    <Field label="Surface en hectares" id="surface" hint="Saisissez un nombre, avec une virgule : 12,5" problem>
      <Input {...args} id="surface" name="surface" invalid value="douze" aria-describedby="surface-hint" />
    </Field>
  ),
  play: ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Surface en hectares")
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription("Saisissez un nombre, avec une virgule : 12,5")
  },
}

/**
 * A press on the unit puts the caret at the end of the field, and the box around both shows the ring, inside its edge.
 * The input keeps the focus through a second press, so a phone's keyboard does not close.
 */
export const TestPressingTheUnit: Story = {
  name: "Test: Pressing the unit",
  render: (args) => <Surface {...args} value="12,5" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText<HTMLInputElement>("Surface")
    const box = input.parentElement!
    await userEvent.click(canvas.getByText("ha"))
    expect(input).toHaveFocus()
    expect(input.selectionStart).toBe(input.value.length)
    const ring = getComputedStyle(box)
    expect(ring.outlineStyle).toBe("solid")
    expect(Number.parseFloat(ring.outlineOffset) + Number.parseFloat(ring.outlineWidth)).toBeLessThanOrEqual(0)

    const blurred = fn()
    input.addEventListener("blur", blurred)
    await userEvent.click(canvas.getByText("ha"))
    expect(blurred).not.toHaveBeenCalled()
    await userEvent.type(input, "0")
    expect(input).toHaveValue("12,50")
  },
}

/**
 * The button in the box is a button of its own, named by its words: a press on it is not taken for a press on the field.
 * From the keyboard it comes after the input, and the ring moves from the box to it.
 */
export const TestTheButtonInTheBox: Story = {
  name: "Test: The button in the box",
  render: (args) => <Search {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("searchbox", { name: "Rechercher une parcelle" })
    const box = input.parentElement!
    await userEvent.type(input, "Blé")
    await userEvent.tab()
    const clear = canvas.getByRole("button", { name: "Effacer" })
    expect(clear).toHaveFocus()
    expect(getComputedStyle(box).outlineStyle).toBe("none")

    // Pressed with the pointer, the button takes the press: it is not handed to the field
    input.focus()
    const user = userEvent.setup()
    await user.pointer({ keys: "[MouseLeft>]", target: clear })
    expect(clear).toHaveFocus()
    await user.pointer({ keys: "[/MouseLeft]", target: clear })
    expect(input).toHaveValue("")
    expect(input).toHaveFocus()
  },
}

export const TestPartsInDarkTheme: Story = {
  name: "Test: Parts in dark theme",
  render: (args) => (
    <div class="grid gap-6">
      <Surface {...args} />
      <Search {...args} />
    </div>
  ),
  globals: { theme: "dark" },
}

export const TestPartsWithMoreContrast: Story = {
  name: "Test: Parts with more contrast",
  render: (args) => (
    <div class="grid gap-6">
      <Surface {...args} />
      <Search {...args} />
    </div>
  ),
  globals: { contrast: "more" },
}

export const TestInDarkTheme: Story = {
  name: "Test: In dark theme",
  render: (args) => <ParcelName {...args} />,
  globals: { theme: "dark" },
}

export const TestWithMoreContrast: Story = {
  name: "Test: With more contrast",
  render: (args) => <ParcelName {...args} />,
  globals: { contrast: "more" },
}

function ParcelName(props: InputProps) {
  return (
    <Field label="Nom de la parcelle" id="parcelle" hint="Le nom que vous lui donnez, par exemple « Les Œillets ».">
      <Input {...props} id="parcelle" name="parcelle" aria-describedby="parcelle-hint" />
    </Field>
  )
}

// A minimal field, until bloom has its own: what a label, an input and its help need so that all three are read together.
// Its gaps are those of bloom's fields, such as a NumberInput's.
function Field(props: { label: string; id: string; hint: string; problem?: boolean; children: JSX.Element }) {
  return (
    <div class="grid gap-2">
      <label for={props.id} class="font-semibold">
        {props.label}
      </label>
      {props.children}
      <p id={`${props.id}-hint`} class={props.problem ? "font-semibold text-danger-text" : "text-sm text-muted"}>
        {props.problem ? <span aria-hidden="true">✕ </span> : null}
        {props.hint}
      </p>
    </div>
  )
}

function Surface(props: InputProps) {
  return (
    <Field label="Surface" id="surface" hint="En hectares, avec une virgule : 12,5">
      <Input
        {...props}
        id="surface"
        name="surface"
        inputmode="decimal"
        autocomplete="off"
        aria-describedby="surface-hint"
      >
        <Input.End>ha</Input.End>
      </Input>
    </Field>
  )
}

function Search(props: InputProps) {
  const [query, setQuery] = createSignal("")
  let field: HTMLInputElement | undefined
  // The button goes with what it empties, so focus goes back to the field
  const clear = () => {
    setQuery("")
    field?.focus()
  }
  return (
    <Field label="Rechercher une parcelle" id="recherche" hint="Par son nom ou son numéro d'îlot.">
      <Input
        {...props}
        ref={(element: HTMLInputElement) => {
          field = element
        }}
        id="recherche"
        name="recherche"
        type="search"
        value={query()}
        onInput={(event) => setQuery(event.currentTarget.value)}
        aria-describedby="recherche-hint"
      >
        <Input.Start>
          <SearchMark />
        </Input.Start>
        <Show when={query()}>
          <Input.End>
            <Button tone="neutral" variant="ghost" onClick={clear}>
              Effacer
            </Button>
          </Input.End>
        </Show>
      </Input>
    </Field>
  )
}

// The app's own icon, drawn at the 24px of bloom's marks
function SearchMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      aria-hidden="true"
      class="size-6"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  )
}
