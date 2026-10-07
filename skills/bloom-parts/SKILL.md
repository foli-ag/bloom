---
name: bloom-parts
description: How the parts of @foliag/bloom components are named, styled, split into files and exported, and what state a part may keep (no signal zag or CSS already holds, no write while rendering, ARIA ids pointed at unconditionally). Each one is the seeds part of the same name with bloom's look, button-like parts take their look from `as={Button}`, and no part ships words. Use when adding a component or a part to bloom, translating a seeds or Ark UI example to bloom, or reviewing a bloom API.
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

## State: only what CSS and zag cannot know

A part renders on the server and hydrates, so what it shows comes from its props, zag's `api()` and CSS, and a signal
is the last resort:

1. **A signal holds a fact nothing else holds, and bloom reads it.** Zag already holds the value, the open state and
   the focus, and puts them on the parts (`data-state`, `data-highlighted`, `aria-*`): read `api()` or style on those,
   never mirror them in a signal.
2. **No part writes a signal while it renders.** The component body also runs during a server render, where Solid
   reports the write (`SERVER_WRITE`) and will refuse it. A signal is written from an event, an effect, `onSettled` or
   a frame.
3. **A part never reports itself to its root.** What depends on which parts are there or how many comes from CSS on the
   root: `:has()`, a sibling chain, `group-*`, or a variant in `theme.css` (`trail-folded` folds a breadcrumb of four
   items or more). It then holds from the server's HTML on, where a count kept in a signal only lands after hydration.
4. **An ARIA link points at the part's id whether or not the part is there.** A card that is a link names itself by
   `aria-labelledby={titleId}`, a progress bar by its label's id, a checkbox is described by its description's id, as
   zag itself points a checkbox's input at its label's id. Without the part, the id is nowhere on the page, the browser
   skips the reference and falls back (the row's `<label>`, the bar's value), and axe reports it for review, not as a
   violation.
5. **A `data-*` attribute or a class computed in JS carries a fact CSS cannot see**, and says which: time since mount,
   an image the browser already had, a measured box, the direction of a change, a toggle zag does not hold. A look
   that follows zag's state reads zag's attribute on the part or an ancestor instead: `in-data-copied:` for the
   clipboard's indicator, `group-data-[state=visible]/indicator:` for the password's, `group-data-[state=open]/control:`
   for the combobox's chevron, `group-has-[…[data-state=on]]/track:` for the toggle group's pill.

What passes these rules, and why, so a review does not undo it:

- **A root's variant passed down in a context** where a CSS ancestor selector would also match an outer root of the
  same kind (accordion, collapsible, radio group, toggle group, tabs, navigation menu nest), or where the variant
  changes which elements render (`NumberInput`'s stepper, a segmented progress, an avatar in a group, a drawer's root
  that renders no element).
- **Signals for facts only the browser knows:** a measured box (the pill's), a change's direction or timing
  (`Steps.useArrival`, the angle slider's turn, the pagination's pages rolling out), the frames since mount (`settled`
  in chips, the editable area and the pill, the navigation menu's `data-initial`), an image already cached (`Avatar`),
  a pointer that travelled past a tap (`createFollowing`), the element a card renders as (`Card.Root`'s `target`,
  read in `onSettled`), a toggle zag does not hold (`Breadcrumb`'s `expanded`, `Alert`'s own open state).
- **Attributes set from an event** on the element itself: the input modality (`data-pointer`), a dialog's swell on a
  press outside, a drawer's grab under a finger.
- **A wrapper bloom adds that copies zag's open state as `data-state`, as a plain expression from `api()`**, where zag
  puts none on it (the menu's, select's, popover's and combobox's positioners), so the `presence-*` utilities can key
  on it.
- **ARIA read from `api()`**: `aria-hidden` swaps between two sets of words, the carousel indicator's `aria-current`.
- **A context that carries an action** (`AlertContext.close`, `BreadcrumbContext.expand`, a chip's `leave`), never a
  raw setter.
- **`ownedWrite` is not used.** Writes from `onSettled`, an observer, a frame or `transitionend` need no opt-in, and
  the option would also hide a write made while rendering.

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

Each component has stories next to it, `src/<component>/<component>.stories.tsx`. The first is `Playground`, with no
`play` and the props as controls, for a developer to try it. Then come stories that each show one state. Tests come last,
in stories named `Test: …`: a `play` test of what a farmer does with it, a dark and a more-contrast story, and a phone
story (`globals: { viewport: { value: "mobile2" } }`) when it changes shape below 640px. axe runs on every story.
Stories write the parts out in full, as an app would.
