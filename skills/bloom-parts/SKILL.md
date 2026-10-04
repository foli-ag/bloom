---
name: bloom-parts
description: How the parts of @foliag/bloom components are named, styled, split into files and exported. Each one is the seeds part of the same name with bloom's look, button-like parts take their look from `as={Button}`, and no part ships words. Use when adding a component or a part to bloom, translating a seeds or Ark UI example to bloom, or reviewing a bloom API.
---

# Bloom parts

Bloom is `@foliag/seeds` with a look. An app that knows seeds knows bloom: the same example works with either import,
and only what it looks like changes.

## Naming: seeds' rules, unchanged

Seeds' naming skill is the reference, shipped at `node_modules/@foliag/seeds/skills/seeds-naming/SKILL.md`. Its
rules apply to bloom as written, and in short:

1. **Every bloom part is the seeds part with the same name and path**, styled: `Dialog.Positioner` is
   `Seed.Positioner` with bloom's classes, `Select.Item.Indicator` is `Seed.Item.Indicator` holding a tick. Nothing is
   renamed. Triggers on the root's state nest under `Trigger` (`Trigger.Close`, `Trigger.Clear`, `Trigger.Next`), and
   `Trigger` and `Trigger.Open` are the same component.
2. **Parts are never folded.** `Backdrop`, `Positioner` and `Content` stay three parts, and so do `Trigger`,
   `ValueText` and `Indicator`, an `Item` and its `Item.Text` and `Item.Indicator`, a `Root` and its `HiddenInput` or
   `HiddenSelect`. The app writes each one, and can leave one out, reorder them or put its own between them. A bloom
   part renders one seeds part, plus what its look needs that no seeds part covers: a `Portal` around a `Positioner` or
   a `Backdrop`, a chevron mark, a tick, a step's number.
3. **A seeds part bloom does not style is not exported.** An unstyled `Arrow` or `Progress` would not look like bloom.
   `Context`, `RootProvider`, `HiddenInput`, `HiddenSelect` and `Anchor` have no look and are exported unchanged.
4. **A part bloom adds follows the same rules for its place.** A sheet's close button closes the root, so it is
   `Select.Trigger.Close`. A row of buttons at the foot of a dialog is `Dialog.Actions`. Where bloom replaces a seeds
   part to fix it, it keeps the name: `Combobox.Empty` is a status outside the listbox instead of a row inside it.

## Looks: parts that only act have none

A part that opens, closes or moves the root on, every `Trigger` and `Trigger.*`, is the bare seeds part. It takes its
look from what it renders as, usually a `Button`, and the variants go with it:

```tsx
<Dialog.Trigger as={Button} tone="danger" variant="outline">Supprimer la parcelle</Dialog.Trigger>
<Dialog.Trigger.Close as={Button} tone="neutral" variant="outline">Annuler</Dialog.Trigger.Close>
<Steps.Trigger.Next as={Button}>Suivant</Steps.Trigger.Next>
```

Never copy `Button`'s props onto a part. The same part can then render as a link, an avatar or a card the app already
has. A part whose look is the component's own, a select's field, an accordion's title row, a step's button, a
navigation entry, is styled.

## Words: none

Bloom ships no strings, in any language, and no defaults for words. Every word a part shows or announces comes in as
`children`, and `children` is required in the type wherever a part would otherwise have no accessible name. Where
zag names a part in English (`Clear value`, `Toggle suggestions`, `close`), the root sets that translation to `""`
so the name comes from the children. Numbers are the app's to format too: `Slider.ValueText` takes a function.

## Files and tree shaking: as seeds

An app's bundler keeps only the parts it uses, so the layout is seeds' own:

- `src/<component>/<component>-<part-path>.tsx` holds one styled part, its props type and its `tv` classes:
  `select-item-indicator.tsx` exports `SelectItemIndicator` and `SelectItemIndicatorProps`. Classes are in the part
  that uses them; what several components share lives in `src/internal/*.ts`.
- `src/<component>/<component>.ts` assembles the namespace and nothing else. It renames each part to its path
  (`export { SelectItemIndicator as Indicator }` lands under `Item`), re-exports seeds' unstyled parts as namespace
  members (`export const Context = Seed.Context`), and builds nested members with
  `/* @__PURE__ */ Object.assign(Item, { Text: ItemText, Indicator: ItemIndicator })`.
- A member whose value is a seeds part read off another part (`Seed.Trigger.Clear`) is wrapped in a component of its
  own, so no property of a seeds part is read when the module loads. A seeds member bloom changes nothing about, such
  as `Dialog.Trigger`, is re-exported whole: `export const Trigger = Seed.Trigger`.
- `src/<component>/index.ts` exports `export * as Select from "./select.js"`, the hooks and context hooks of seeds
  (`useSelect`, `useSelectContext`, `useSelectItemContext`) and `createListCollection` where seeds has it, so an app
  never imports seeds for a component it takes from bloom. It is the subpath in `package.json` `exports`. There is no
  root entry.
- Defaults the bloom `Root` sets (`lazyMount`, a translation) are set on its `RootProvider` too.
- `tests/tree-shaking.test.ts` bundles small apps against the built package and checks that a component brings in no
  other one, and that an unused part is left out.

## Stories

Each component has stories next to it, `src/<component>/<component>.stories.tsx`, with a `play` test of what a farmer
does with it, a dark and a more-contrast story, and a phone story (`globals: { viewport: { value: "mobile2" } }`)
when it changes shape below 640px. axe runs on every story. Stories write the parts out in full, as an app would.
