---
name: bloom
description: How to build an app with @foliag/bloom, the styled Solid 2 components on @foliag/seeds and Tailwind CSS 4. Covers setup, imports, composing parts, triggers rendered as a Button, forms, overlays and phone sheets, words and numbers, overriding classes, theme tokens and utilities, settings and re-skinning with ThemeProvider. Use when writing or reviewing app code that imports @foliag/bloom, choosing a bloom component for a screen, or wiring bloom into a new app.
---

# Using bloom

Bloom is `@foliag/seeds` with a look, made for apps a farmer uses on a phone, in the sun, with one hand, often on a poor connection. Every part is the seeds part of the same name, styled, so seeds and Ark UI examples translate by changing the import. The components hold the design rules (7:1 text, 48px targets, focus, motion, reduced motion), so an app gets them by using the components as they come instead of rebuilding them from `div`s.

## Setup

```sh
bun add @foliag/bloom tailwindcss
```

```css
/* app.css */
@import "tailwindcss";
@import "@foliag/bloom/theme.css";
@import "@foliag/bloom/fonts.css"; /* Barlow Semi Condensed and Newsreader, self-hosted. Leave it out to use other fonts. */
```

- The package ships compiled `.jsx`, so the app builds with the Solid compiler: `@solidjs/vite-plugin` with Solid 2 (`solid-js` and `@solidjs/web` are peer dependencies).
- `theme.css` adds an `@source` for bloom's own files, so Tailwind generates the classes the components use. Import it after `tailwindcss` and do not copy its tokens into the app.
- For a full-screen dialog to clear the notch and the home indicator, the page needs `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.

## Imports

Each component has its own subpath and there is no root entry, because a dev server does not tree-shake. Single components are named exports; components with parts are a namespace.

```tsx
import { Button } from "@foliag/bloom/button"
import { Checkbox } from "@foliag/bloom/checkbox"
import { Input } from "@foliag/bloom/input"
import { Dialog } from "@foliag/bloom/dialog"
import { createListCollection, Select } from "@foliag/bloom/select"
```

The README's table lists every component and what it is for. Read the component's `.d.ts` under `node_modules/@foliag/bloom/dist/<component>/` for its parts and props: each one has a doc comment and an `@example`.

## Composing parts

Write every part, as in seeds. Parts are never folded together, so the app can leave one out, reorder them or put its own markup between them.

```tsx
const cultures = createListCollection({
  items: [
    { label: "Blé tendre", value: "ble-tendre" },
    { label: "Colza", value: "colza" },
  ],
})

<Select.Root collection={cultures} name="culture">
  <Select.Label>Culture</Select.Label>
  <Select.Trigger>
    <Select.ValueText placeholder="Choisir une culture" />
    <Select.Indicator />
  </Select.Trigger>
  <Select.Positioner>
    <Select.Content>
      <For each={cultures.items}>
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
```

Keep the hidden parts (`HiddenSelect`, `HiddenInput`) inside a form, so the value is submitted under `name`. State is controlled or not as in seeds: `value` and `onValueChange`, `open` and `onOpenChange`, `checked` and `onCheckedChange`, or the `default*` prop. `useSelect`, `useDialog` and the other hooks run a component from outside it, through its `RootProvider`.

## Triggers are rendered as a Button

A part that only opens, closes or moves something on has no look of its own. Render it `as={Button}` and give it the button's variants. It can also render as a link, an avatar or a card the app already has.

```tsx
<Dialog.Root role="alertdialog">
  <Dialog.Trigger as={Button} tone="danger" variant="outline">Supprimer la parcelle</Dialog.Trigger>
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Title>Supprimer « Les Grands Champs » ?</Dialog.Title>
      <Dialog.Description>Ses interventions seront supprimées aussi.</Dialog.Description>
      <Dialog.Actions>
        <Dialog.Trigger.Close as={Button} tone="neutral" variant="outline">Annuler</Dialog.Trigger.Close>
        <Button tone="danger" onClick={remove}>Supprimer</Button>
      </Dialog.Actions>
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
```

Triggers on the root's state nest under `Trigger`: `Dialog.Trigger.Close`, `Select.Trigger.Clear`, `NumberInput.Trigger.Decrement`. A few components still name theirs at the top level, such as `Menu.Close` and `Steps.Next`, so check the namespace's exports. Parts bloom draws itself, such as the stepper's − and + or the Editable's pencil, take no `as`, and their children are their names.

## Button

`tone` says what the action is (`primary`, `neutral`, `danger`) and `variant` how loudly (`solid`, `soft`, `outline`, `ghost`). `size="lg"` (56px) is for the main action of a screen, `block` makes it full width. `loading` shows a spinner, keeps focus and ignores clicks, but only sets `aria-busy`, so change the words too:

```tsx
<Button size="lg" block loading={saving()}>{saving() ? "Enregistrement…" : "Enregistrer"}</Button>
<Button as="a" href="/champs" variant="outline">Mes champs</Button>
```

A button needs words: there is no icon-only button. A button in a form is `type="button"` unless the app sets `type="submit"`.

## Words, numbers and names

Bloom ships no strings in any language. Every word shown or announced comes in as `children` or a prop, and the types require it where a screen reader needs a name with no visible text to take it from. Pass French (or the app's language) everywhere: `placeholder`, the close button's words, `aria-label` on a stepper's − and +.

The app formats numbers: `NumberInput.Root` requires `locale`, and value texts take a function, ``<Slider.ValueText>{(value) => `${value[0]} %`}</Slider.ValueText>``.

Never let color carry meaning alone. An invalid field, a danger or a warning also needs an icon, a second line or words. `Badge` has an `indicator` for this, and `Alert` and `Progress` show their tone's mark.

## Phones and overlays

- Overlays render into `<body>`, so no parent's `overflow` or `z-index` clips them. A select inside a dialog still opens over it, and choosing in it leaves the dialog open.
- Below 640px a select, a menu and a popover rise from the bottom as sheets. Give each one its close button at the foot (`Select.Trigger.Close`, `Menu.Close`, `Popover.Trigger.Close`), as a tap on the dim is not obvious to everyone. A combobox stays a dropdown, as the keyboard covers the bottom of the screen.
- A dialog is a bottom sheet on a phone that a thumb can swipe down by its grabber, and a card from 640px. `size` (`sm`, `md`, `lg`) sets the card's width. `phone="full-screen"` suits a long form. `role="alertdialog"` stays open on a press outside.
- `Tooltip` and `HoverCard` never open from a tap. Do not put anything a phone user needs only in them.
- Do not size targets under 48px or set text under 16px (`text-sm` is 16px in bloom's scale). Size boxes with `min-h`, not `h`, so text the user enlarges does not clip.

## Classes

Every component takes `class`, merged after its own classes with `cn`, so a conflicting app class wins: `<Button class="w-40">` or `<Skeleton class="size-12 rounded-full" />`. Use it for layout and size, not to restyle the look. Change the look through the variants, or through tokens for the whole app.

Bloom's theme names (`rounded-control`, `rounded-card`, `tracking-body`, `shadow-card`) are not known to the merge, so `rounded-full` on a component does not remove its `rounded-control`. Both stay, and the CSS order decides.

Write app styles with bloom's tokens, never a hex value: `bg-surface`, `bg-raised`, `text-ink`, `text-muted`, `border-border`, `border-strong`, `bg-primary text-on-primary`, `text-primary-text`, and `danger`, `warning`, `info` and `success` with their `-text`, `-soft`, `-edge` and `on-` forms. `--color-primary` is only 2.5:1 on white: it is a fill under dark ink, never text, and green text uses `text-primary-text`.

`theme.css` also gives the app the utilities the components use:

- `pressable` on anything pressed: no zoom on a quick second tap, no grey flash.
- `focus-ring` for a custom control, which turns its edge the focus color for the keyboard.
- `presence-fade`, `presence-overlay`, `presence-sheet`, `presence-collapse` for something the app opens and closes itself, on transitions that turn round half way. `skeleton` for the loading sheen.
- the `pressing:` variant, for a press that does nothing while disabled or busy.

## Settings and re-skinning

The system's theme, contrast and motion apply by default. To offer them as switches, set an attribute on `<html>`: `data-theme` (`light`, `dark`), `data-contrast` (`more`, `normal`), `data-motion` (`reduced`, `full`).

A product re-skins bloom with `<ThemeProvider theme={theme}>` from `@foliag/bloom/theme`, near the top of the app. A `Theme` maps token names without `--color-` to any CSS color or `{ light, dark }`: `{ primary: "#1a3a6b", "on-primary": "#fff", "primary-800": "#344d74" }`. Tokens left out keep bloom's values, the theme reaches overlays, and a new `theme` applies in place. Bloom checks nothing: the theme's pairs have to reach 7:1 for text and 3:1 for edges. A dark primary under light ink also sets `primary-hover` and `primary-pressed` darker. A fixed brand can redeclare the tokens on `:root` in CSS instead. A token redeclared on a subtree does not reach the tokens computed from it on `:root`.

## Related skills

- `skills/bloom-parts`: how parts are named, split and exported, for adding a component or a part to bloom.
- `skills/bloom-motion`: the motion and focus rules, and `film.mjs`, which films an animation frame by frame to check it.
- `node_modules/@foliag/seeds/skills/seeds-naming`: the naming rules bloom follows.
