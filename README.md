# @foliag/bloom

Styled Solid 2 components for generic products, built on [`@foliag/seeds`](https://github.com/foli-ag/seeds) and
Tailwind CSS 4. They are made for apps a farmer uses on a phone, in the sun, with one hand, often on a poor connection.

Each component is imported from its own subpath, as in `@foliag/seeds`, with no root entry. A server or a dev server
does not tree-shake, so a root entry would load every component.

| Component | Import | What it is |
|---|---|---|
| `Button` | `@foliag/bloom/button` | 48px, or 56px as `size="lg"`. Tones, four emphasis levels, `loading`, `as` for links |
| `Input` | `@foliag/bloom/input` | 48px text field with an `invalid` state. `Input.Start` and `Input.End` put a mark, a unit or a button in its box |
| `Checkbox` | `@foliag/bloom/checkbox` | A box and its words as one full-width row, with an indeterminate state, a sentence under its title, or a tile (`variant="card"`) |
| `Switch` | `@foliag/bloom/switch` | A setting that applies at once: words first, the switch at the end of the row |
| `RadioGroup` | `@foliag/bloom/radio-group` | One choice among a few, all in view, stacked, side by side, or as tiles with a picture and a sentence (`variant="card"`) |
| `ToggleGroup` | `@foliag/bloom/toggle-group` | A row of equal segments pressed like buttons, or a track with a pill that slides to the choice (`variant="segmented"`) |
| `Slider` | `@foliag/bloom/slider` | A value or a range along a line, with a 48px target around each handle |
| `Select` | `@foliag/bloom/select` | One choice from a list, or several as chips. A dropdown from 640px, a bottom sheet on a phone. `loading` shows skeleton rows |
| `Combobox` | `@foliag/bloom/combobox` | A choice from a long list, narrowed down by typing, or several as chips removed with Backspace |
| `Menu` | `@foliag/bloom/menu` | Actions on one thing behind one button. A dropdown, or a bottom sheet on a phone |
| `Dialog` | `@foliag/bloom/dialog` | A question or a short task over the page, in three widths, `role="alertdialog"` for one that interrupts. `phone="full-screen"` for a long form on a phone |
| `Popover` | `@foliag/bloom/popover` | A few words or a small task next to what it is about |
| `Steps` | `@foliag/bloom/steps` | A form cut into numbered steps, across or down the side |
| `NavigationMenu` | `@foliag/bloom/navigation-menu` | The sections of an app in a bar, with a `Viewport` whose panel slides between sections, or `variant="bottom"`: a phone's bar of 3 to 5 pages |
| `Collapsible` | `@foliag/bloom/collapsible` | Something shown or hidden by one button, or `variant="card"`: a card whose first row opens its body |
| `Accordion` | `@foliag/bloom/accordion` | A stack of sections, each opened by its title: in one card, `separated` cards, or `flush` inside a panel |
| `Avatar` | `@foliag/bloom/avatar` | A photo in a circle, or a square for an organisation, with initials while it loads and when it fails. `AvatarGroup` overlaps several as a list |
| `NumberInput` | `@foliag/bloom/number-input` | A number typed or stepped with two buttons, or `variant="stepper"` on its Control: a large − and + around the value. `locale` is required |
| `PasswordInput` | `@foliag/bloom/password-input` | A password field with a button that shows it as plain text |
| `PinInput` | `@foliag/bloom/pin-input` | One box per character of a code. The name of each box is the app's |
| `Editable` | `@foliag/bloom/editable` | Text edited in place, from a pencil in its box: Enter or the tick keeps it, Escape or the cross puts it back |
| `Clipboard` | `@foliag/bloom/clipboard` | A value with a button that copies it, its words changing once copied |
| `Toggle` | `@foliag/bloom/toggle` | One button that stays pressed, like a lone `ToggleGroup` segment |
| `Swap` | `@foliag/bloom/swap` | Two indicators in one place, the change popping in |
| `Progress` | `@foliag/bloom/progress` | A bar, segments or a ring, in a tone. With `value={null}` the ring turns: bloom's spinner |
| `Tabs` | `@foliag/bloom/tabs` | Panels shown one at a time from a row of 48px tabs, or in a track with a sliding pill (`variant="segmented"`) |
| `RatingGroup` | `@foliag/bloom/rating-group` | A mark given with stars, half marks with `allowHalf` |
| `Drawer` | `@foliag/bloom/drawer` | A sheet on an edge that follows the finger and closes when swiped away |
| `Tooltip` | `@foliag/bloom/tooltip` | A label for the mouse and the keyboard. It never opens from a tap |
| `HoverCard` | `@foliag/bloom/hover-card` | A card next to a link, for the mouse and the keyboard. It never opens from a tap |
| `Pagination` | `@foliag/bloom/pagination` | Pages of a list as 48px squares, the current one filled, or `compact`: the triggers and the position between them |
| `Carousel` | `@foliag/bloom/carousel` | Slides that scroll a page at a time, with dots and a counter. `peek` shows the next slide at the edge |
| `Splitter` | `@foliag/bloom/splitter` | Panels resized by a handle with a 48px grip, or the keyboard |
| `AngleSlider` | `@foliag/bloom/angle-slider` | A dial for a direction in degrees, such as the wind or the rows |
| `TreeView` | `@foliag/bloom/tree-view` | Nested rows that open and close, such as a farm's blocks and parcels |
| `Textarea` | `@foliag/bloom/textarea` | Text over several lines in the field's box, growing with the text up to ten lines |
| `Card` | `@foliag/bloom/card` | A surface for one thing, outlined, elevated or soft. As a link or a button the whole card is one target |
| `Badge` | `@foliag/bloom/badge` | A short status or a count in six tones, soft, solid or outlined, with a dot or the tone's mark |
| `Alert` | `@foliag/bloom/alert` | News in the page with its tone's mark, `urgent` for `role="alert"`. Dismissed, it folds away |
| `Skeleton` | `@foliag/bloom/skeleton` | A tinted box standing in for what loads, sized and shaped by its classes, with a calm sheen that stops under reduced motion |
| `Separator` | `@foliag/bloom/separator` | A line across or down, with words such as "ou" in the middle, or decorative |
| `Breadcrumb` | `@foliag/bloom/breadcrumb` | Where the page sits in the app. On a phone a long trail folds its start into one button |

## Use

```sh
bun add @foliag/bloom tailwindcss
```

```css
/* app.css */
@import "tailwindcss";
@import "@foliag/bloom/theme.css";
@import "@foliag/bloom/fonts.css"; /* Barlow Semi Condensed, self-hosted. Leave it out to use another font. */
```

```tsx
import { Button } from "@foliag/bloom/button"
import { Checkbox } from "@foliag/bloom/checkbox"

<Checkbox name="irrigue">Irrigué</Checkbox>
<Button size="lg" block loading={saving()}>Enregistrer</Button>
```

The package ships compiled `.jsx`, so the app builds with the Solid compiler (`@solidjs/vite-plugin`). `theme.css`
tells Tailwind to scan those files, and a `class` on a component wins over the component's own classes
(`cn`).

## Parts that are buttons

A part that only opens, closes or moves something on, such as a dialog's trigger, its close, a stepper's next or a
select's clear, is a bare button with no look of its own. It takes its look from what it renders as, usually a
`Button`, and the variants go with it. The same part can render as a link, an avatar or a card the app already has.

```tsx
<Dialog.Trigger as={Button} tone="danger" variant="outline">Supprimer la parcelle</Dialog.Trigger>
<Dialog.Close as={Button} tone="neutral" variant="outline">Annuler</Dialog.Close>
<Steps.Next as={Button}>Suivant</Steps.Next>
<Menu.Trigger as={Button} variant="outline">Actions <Menu.Indicator /></Menu.Trigger>
```

Overlays render into `<body>`, so a parent's `overflow` or stacking cannot clip them. Zag still treats them as part
of what opened them: a select inside a dialog opens over it, and choosing in it leaves the dialog open. Below 640px a select, a menu and a popover rise from the bottom as sheets, each with a close button at
its foot (`Select.Close`, `Menu.Close`, `Popover.Close`), because a tap on the dim is not obvious to everyone. A
combobox stays a dropdown, as the keyboard covers the bottom of the screen.

## No words of its own

Bloom ships no strings, in any language. Every word a component shows or announces comes in as `children`:
`<Button>Enregistrer</Button>`, `<Checkbox>Irrigué</Checkbox>`. Where a screen reader needs a name and there is no
visible text to take it from, `children` is required in the type. `loading` on a Button only sets `aria-busy` and shows
a spinner, so the app changes the button's own text, "Enregistrement…". Numbers are formatted by the app too:
`Slider.ValueText` takes a function of the value, ``{(value) => `${value[0]} %`}``.

Zag gives some buttons English names that would win over their words: "Clear value", "Toggle suggestions", "close".
Bloom empties them, so a clear button rendered as `<Select.Clear as={Button}>Effacer</Select.Clear>` is named
"Effacer". `Steps` has no progress bar, because zag's says "50% complete" in English and takes no other text.

## Design rules

These are held by the stories, which run axe and fail on a violation, so a change that breaks one fails `bun run test`.

- **Contrast.** Text is 7:1 (AAA) and every edge or ring that has to be found is 3:1, in light, dark, and with more
  contrast. `Foundations/Colors/Contrast` measures every pair in the browser in all four settings. `#74b24c` is only
  2.5:1 on white, so it carries dark ink and never serves as text. Green text uses `--color-primary-text`.
- **Touch.** Targets are at least 48px, and 56px for the main action of a screen. Sizes use `min-h`, so text that
  grows with the user's settings does not clip. A checkbox, a radio or a switch is a row the width of its container,
  so a thumb that misses the words still lands on it. Anything pressed takes the `pressable` utility: no zoom on a
  quick second tap, and no grey flash from the browser over the component's own press.
- **Type.** Barlow Semi Condensed at weight 500 and up, 18px body, nothing under 16px, all in `rem`.
- **Motion.** Smooth before lively. Whatever moves or changes color eases on one critically damped spring
  (`--ease-smooth`), so the parts of one change arrive together and nothing swings back and forth. What appears by
  growing pops once, 4% past its size (`--ease-pop`). A finger going down is met in 90ms, colors included, so even a
  quick tap shows, and the control comes back up when it lifts. What opens and closes does so on transitions (the
  `presence-*` utilities in `theme.css`), so a change of mind half way turns it round from where it is instead of
  snapping, and nothing animates as a page loads. Only transform and opacity move, on the compositor, except a section
  that folds and a split moved by a key, which have to push what follows them; what follows a finger has no transition
  while it does. `Foundations/Motion` fails if a curve starts to wobble or a panel closed half way snaps open. Under
  reduced motion nothing moves or overshoots, fades and colors stay, and a spinner keeps turning, slower.
  `skills/bloom-motion` films an animation frame by frame to check it.
- **Focus.** Where the keyboard is, the control's edge turns the focus color, 3px thick over its border, so the control
  keeps its size and shape and covers nothing next to it. It appears at once, and on a part zag focuses after a press
  it shows for the keyboard only. `Foundations/Focus` fails if a ring reaches
  outside its control.
- **Never color alone.** Invalid, danger and warning carry an icon, a second line or text as well. A progress tone is
  backed by the label and value words and the tone's mark.

Parts drawn by the component itself take no `as`: the stepper's − and + and the Editable's pencil, tick and cross are
bloom's own, and their children are their names.


## Settings

The system's choices apply by default. An app can offer the same as switches by setting an attribute on `<html>`:

| Attribute | Values | Effect |
|---|---|---|
| `data-theme` | `light`, `dark` | Forces a theme instead of following the system |
| `data-contrast` | `more`, `normal` | Stronger text and edges, or turns off `prefers-contrast: more` |
| `data-motion` | `reduced`, `full` | Removes movement, or turns off `prefers-reduced-motion` |

## Re-skinning

Components read semantic tokens and never a hex value. A product re-skins bloom by redeclaring tokens on `:root` after
the import, usually the primary scale, `--color-primary-50` to `--color-primary-950`, with `--color-primary` and the
`--color-on-primary` ink. Check the pairs in `Foundations/Colors/Contrast` against the new colors. A token redeclared on
a subtree does not reach the tokens defined from it on `:root`.

## Development

The flake provides Bun, Node and the Chromium build that Playwright drives. Run `direnv allow` once, or enter the shell
with `nix develop`.

```sh
bun install
bun run storybook        # previews and docs at http://localhost:6006
bun run build-storybook  # static site in storybook-static/
bun run test             # Vitest: tests/ and stories in headless Chromium, bundle checks in Node
bun run typecheck
bun run build            # tsc, one module and declaration per source file in dist/, and the two CSS files
bun run format           # biome
```

Component tests run in a real browser because positioning, focus trapping and outside clicks do nothing useful in
jsdom, and files in `tests/*.test.ts` run in Node. Playwright only drives browsers from its own release, so the
`playwright` devDependency stays at the version of `playwright-driver` in the locked nixpkgs. Update both together.

## Storybook

Storybook is the preview and the documentation site, through [storybook-solidjs-vite](https://github.com/solidjs-community/storybook).
Stories live next to their component as `src/<component>/<component>.stories.tsx`. The `stories` project in
`vite.config.ts` runs every story as a test in headless Chromium, so a story with a `play` function is also an
interaction test. `tsconfig.build.json` leaves stories out of `dist/`.

Each component's file opens with a `Playground` story: no `play`, the props in the Controls panel and the events in
Actions, for a developer to try the component. The stories after it show one state each. Tests come last, in stories
named `Test: …` (`export const TestWithTheKeyboard` is `name: "Test: With the keyboard"`). A story is a test when it has
a `play` function, or when it exists only to run axe in the dark theme or with more contrast.

`src/foundations/` holds the stories for colors, type, motion and focus, and the helper that measures contrast in the browser.
It stays out of `dist/` too. The toolbar sets `data-theme`, `data-contrast` and `data-motion` on `<html>`. `a11y.test` is
`error` with the AAA contrast rule on, so axe fails a story in the test run as it does in the browser.

Docs pages are `.mdx` files in `src/`. Add `../src/**/*.mdx` to `stories` in `.storybook/main.ts` when the first one
exists.

`storybook-solidjs-vite` imports `vite-plugin-solid`, the old name of `@solidjs/vite-plugin`. The `overrides` entry in
`package.json` points that name at `@solidjs/vite-plugin`, so the stories project uses the Solid 2 plugin. Without it Bun
installs `vite-plugin-solid` 2.11, the Solid 1 plugin, which breaks the stories project. Keep the override at the
same version as the `@solidjs/vite-plugin` devDependency, and remove it once `storybook-solidjs-vite` imports the new
name.

`nix flake check` builds the package and runs the typecheck and the tests in the sandbox. The build fetches each
package `bun.lock` pins with the hash the lockfile records for it, through [bun2nix](https://github.com/nix-community/bun2nix),
so changing dependencies needs nothing beyond `bun install`. Two branches that both add a dependency conflict in
`bun.lock` at most, and `bun install` resolves it.

CI runs `nix flake check` on pushes to `main` and on pull requests.

## Publishing

Releases go through npm staged publishing. CI uploads the version, and nobody can install it until a maintainer approves
it with 2FA. Publishing stays on the npm CLI because `bun publish` can neither stage a version nor attach provenance.

1. Bump `version` in `package.json`, commit, then push a matching tag.

   ```sh
   git tag v0.1.1
   git push origin v0.1.1
   ```

2. The `Publish` workflow checks the tag against `package.json`, runs `nix flake check`, and stages the tarball from
   `nix build` with provenance.
3. Approve the staged version from `nix develop`.

   ```sh
   npm stage list @foliag/bloom
   npm stage approve <stage-id>
   ```

The workflow runs in the `npm` GitHub environment and reads `NPM_TOKEN` from it. That secret is a stage-only granular
token with write access to the `@foliag` scope, so a leaked token cannot publish anything on its own. Once the package
exists you can replace it with a GitHub Actions trusted publisher on npmjs.com (organization `foli-ag`, repository
`bloom`, workflow `publish.yml`, environment `npm`) and delete the secret. Trusted publishers can always stage.

npm's manual lists an existing package as a prerequisite for `npm stage`. If staging the first version fails for that
reason, publish it once by hand from `nix develop`.

```sh
nix build
npm publish ./result/foliag-bloom-0.1.0.tgz --access public
```

## License

MIT
