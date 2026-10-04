---
name: bloom-motion
description: How @foliag/bloom moves and shows focus, and how to film an animation frame by frame in headless Chromium to check it. Covers the springs and tokens, the presence utilities for what opens and closes, what may animate and how, interruptions, first render, reduced motion, focus rings, and the film.mjs tool that lays an animation out on one image with its measurements. Use when adding or changing an animation, a transition or a focus style in bloom or in an app built on it, reviewing how a component moves, or chasing one that looks wrong: a jump, a flash, a stutter, a ring that eases in, a panel that drifts the wrong way.
---

# Bloom motion

An animation cannot be judged from its CSS, and a screenshot catches one frame of it. Film it: `film.mjs` slows the page down, records every frame the compositor draws, measures what moves on each one, and lays the result out on one PNG that you read like a strip of film. Film before changing an animation, to see what is wrong, and after, to prove it is right.

## Filming

Run Storybook in the background on a port of its own, then film a story:

```sh
bun run storybook -- -p 6116 --ci --no-open   # in the background
node skills/bloom-motion/film.mjs --storybook http://localhost:6116 \
  --story components-switch--playground \
  --act "click:#storybook-root [data-scope=switch][data-part=root]" \
  --track "[data-scope=switch][data-part=thumb]" \
  --name switch-on --out /tmp/film
```

It prints a report and writes `/tmp/film/switch-on.png`. Read the PNG. `--help` lists every option. Story ids are in `http://localhost:6116/index.json`. Zag puts `data-scope` and `data-part` on every part, so `[data-scope=dialog][data-part=content]` finds a part in any story, inside a portal or not.

- `--act` steps run while filming, in order: `click:SEL`, `tap:SEL` (with `--touch`), `hover:SEL`, `focus:SEL`, `down:SEL` and `up` for a held press, `press:Escape`, `type:text`, `wait:120` (in animation time), `move:X,Y`, `drag:SEL:DX,DY`, `eval:JS`. `--before` steps run first at full speed, to reach the state to film from, such as an open dialog to film it closing.
- `--track SEL` measures every element the selector matches on every frame (box, own opacity, effective opacity as `alpha`, translate, scale, rotate, and any `--prop=--name`), charts the first one, and crops the sheet to them. `--clip SEL` widens the crop without charting, `--clip viewport` keeps the whole screen, which suits a dialog or a sheet. Both take CSS, optionally followed by ` >> nth=N`; `text=` and `role=` work in steps only.
- `--ms` is how much animation time to film after the first step, `--frames` how many frames go on the sheet, at even steps of it.
- `--globals "theme:dark;motion:reduced;contrast:more"` sets the toolbar's switches. The default 480px width is a phone for bloom, where a select, a menu and a popover become bottom sheets: use `--width 900` for dropdowns and `--width 390 --height 700` for a phone. `--touch` gives a touch screen, where hover never happens.
- `--still` takes one picture of the settled page after `--before`, for reviewing a look. `--focus SEL` (repeatable) focuses each element from the keyboard and lays them all out on one sheet: `--focus "#storybook-root [data-scope=checkbox] input | [data-scope=checkbox][data-part=root]"` focuses a hidden input and crops to its row.
- Several films can run at once against one Storybook, each in its own browser, about ten seconds each. Keep helper scripts in a folder of your own.

### Reading the sheet

- The first frame is `before`, the last `settled`, after every animation has ended at full speed. Between them, time runs along the motion: down the columns when things move sideways, so each frame sits under the one before it, and along the rows otherwise. A dimmed label means nothing had been drawn yet at that time.
- The chart draws each measured value from where it started (0) to where it ended (1), so overshoot shows above 1 and a wrong turn below 0. A value that comes back where it started, such as a flash, is drawn from its lowest to its highest instead.
- The report lists each animation as it started, relative to the first step: transition or keyframes, the element (by `data-scope:data-part`), duration, curve (`ease-smooth`, `ease-pop` and `ease-press` are recognised), the properties, and how it ended. `CANCELED` means it was replaced before it finished: an interruption, or a part that restarted its animation. `(main thread: …)` names properties the compositor cannot run; it goes by name only, and misses `rotate` and `scale` on an `<svg>`, which Chromium also runs on the main thread.
- `measured:` gives start, end, when it reached 90%, when it came to rest, overshoot, and `JUMPS at` for a break between two measured frames: more than a quarter of the travel and at least 2px or 0.15 of opacity, while the element could be seen.
- Trust the numbers over your eye for small movements. A 24px slide is easy to misread across a grid of zoomed frames, and a frame that wraps to the next row looks like a jump when it is not.

### What to film for a change

1. The way in and the way out, each on its own.
2. An interruption: reverse it half way (`--act click:… --act wait:100 --act click:…`, or `press:Escape` for an overlay). This is the commonest bug, and only an interruption shows it.
3. A quick repeat: two presses in a row, a hover in and out, five arrow keys.
4. The first render: nothing may animate as a page loads, with a section open or an item chosen from the start.
5. Reduced motion, with `--globals motion:reduced`: nothing moves or overshoots, fades and colors stay.
6. A phone width for anything that becomes a sheet, the dark theme, and more contrast for anything whose colors change.
7. A busy page, to prove it lagless: `--slow 1 --act "eval:(()=>{const t=performance.now();while(performance.now()-t<300){}})()"` blocks the main thread for 300ms. What keeps moving in the frames runs on the compositor; what freezes and then jumps does not.
8. Once at real speed, `--slow 1`. It shows how long a press takes to answer (Playwright's own click takes 60 to 90ms to land) and confirms that something seen in slow motion happens for real. Timers keep real time under `--slow`, so a 300ms close delay is 30ms of film time: re-film hover and delayed behaviour at real speed.

### Pitfalls

- Under the DevTools playback rate, `document.timeline` and the timestamp `requestAnimationFrame` passes in run slowed too. Only `performance.now()` keeps real time, and it is the clock the screencast stamps its frames with. Mixing the two made a 450ms spring look as if it ended in 7ms.
- A floating panel usually fades on a wrapper while the part you track stays at opacity 1, so read `alpha`. Zag draws a positioner once at 0,0 before it places it, at an alpha of 0: not a jump. The sampler runs early in a frame and can see a layout that is never painted: confirm a one-frame flash in the frames before calling it a bug.
- A story's `play` function runs as it loads, before your steps, and can leave zag machines in states real input never reaches. Film a story without one, or start with `--before wait:3000`. Check a story's args too: the accordion's Playground is not `collapsible`, so a second click does nothing. Storybook ignores URL args a story has no control for; set state with `--before eval:` instead.
- Scope selectors to `#storybook-root`: Storybook's iframe has hidden buttons of its own.
- A `click` is too short to film `:active`: use `down`, `wait` and `up`.
- Storybook's `layout: "centered"` re-centres a component as it grows, so an accordion seems to slide up as it opens. Judge anything that changes height in a story with `layout: "padded"`, and `--track` what sits below it: a dip means two clocks.
- A hot update of the code reloads the story: a film shows a handful of frames or stops with "the page reloaded". Film again.
- Story tests click with synthetic events: they hit the element named, not what is under the point, and set no `:active`. Probe real input with Playwright's mouse, and touch with CDP `Input.dispatchTouchEvent`, and check a test fails on the old code before trusting it.
- An interruption test that depends on timing can set a duration token on `:root` to several seconds, and put it back in `finally`.

## How bloom moves

The tokens are in `src/theme.css`, the rules in the README's "Motion" paragraph. Polished, alive and never cartoonish: every motion has a job, shows where something came from or went, answers within 100ms, and settles without swinging.

### Curves and tokens

- One critically damped spring for whatever moves or changes color (`--ease-smooth`, `--duration-smooth`, 90% at 190ms), so the parts of one change arrive together and nothing swings back. A livelier spring (`--ease-pop`) only for what appears by growing, a tick or a dot, once 4% past its size. A press is met in 90ms (`--ease-press`) and springs back when the finger lifts. What leaves is quicker (`--duration-exit`); a sheet crossing the screen is slower (`--duration-sheet`). A loop, a spinner or a bar whose end is unknown, runs on `--ease-progress-loop`, which ends a round as fast as it starts the next, so it has no seam.
- Distances are tokens that reduced motion sets to nothing: `--press-scale`, `--enter-distance`, `--overlay-scale`, `--sheet-distance`, `--pop-in-scale`. So are `--duration-travel` (a knob, a handle, a needle, a split, a tab's bar or words making room reach their new place at once), `--hold-scale` (a held handle stays its size), `--collapse-rows`, `--chevron-turn`, `--radio-dot-scale` and `--sheet-from-opacity`. A part that moves reads one of these instead of carrying a reduced-motion selector of its own. A spinner and an unknown progress keep moving under reduced motion, slower and at an even pace, as they are what says something is happening.

### What opens and closes

- Use the presence utilities: `presence-fade` for a dim, `presence-overlay` for a panel or a card, `presence-sheet` for a sheet, `presence-collapse` for a section that folds. Each look is a transition, from `@starting-style` as the part appears and to its closed look under `data-state="closed"`. A transition turns round from where it is; a keyframe exit starts from the open look, so a half-open panel snaps open for a frame and then leaves.
- Zag's presence keeps a closing part mounted only while an animation runs on it: it reads `animationName` a frame after closing, unmounts at once if it is `none`, the same as the open state's, or the part is `display: none`, and waits for `animationend` otherwise. So the closed look also runs `bloom-hold`, which animates a custom property and no look. Never put a decorative animation on the presence node itself (its `animationcancel` unmounts the part): run it on the positioner. A closing part takes no presses.
- Zag's collapsible measures a section with `animation-name: none`, which a height transition survives, so its measure reads 0: a section folds as a one-row grid, `grid-template-rows` from `0fr` to `1fr`, and its child clips while it moves. It drops `data-state` once a section is open, so the open look is the base and starting styles sit under `[data-state=open]`. A stack where one section closes as another opens gives both one duration, so what is below holds still.
- A floating panel drifts out of its trigger's side. `@starting-style` captures its from-value once, before zag flips a panel to the other side; keyframes read `var()` on every frame. So the drift is keyframes on the positioner (`presence-drift`, from `--presence-from`), and the panel only fades and grows from zag's `--transform-origin`. Tooltips do not scale, and drift 4px.
- A sheet slides in solid and fades only under reduced motion: a sheet that fades while it slides crosses the screen as a pale ghost. Opacity multiplies down the tree, so a dim behind a sheet is a `::before`, not the sheet's parent.
- A transition takes its timing from the state it goes to: put the pop on the shown state and the exit timing on the base, for a quick exit with no overshoot.

### Lagless

- Animate `transform` (`translate`, `scale`, `rotate`) and `opacity`. On an `<svg>`, Chromium runs the `rotate` and `scale` properties on the main thread, where a busy page freezes them: turn an `<svg>` with `transform`, or put the motion on a span around it. Colors on small parts are fine.
- A width that changes, a tab's bar, is a `translate` and a `scale` of a middle with round caps of its own, not `width`. Layout animates only where nothing else can do it, a section that folds and a split moved by a key, and the code says why.
- Nothing that follows a pointer has a transition while it follows: a handle glides to a press, and from the first move of more than 3px it follows exactly (`createFollowing` in `src/internal/pointer.ts`). A swiped drawer gives its transform 0s only while dragged, per property, so its other transitions still run.
- `scrollTo({ behavior: "smooth" })` ignores reduced motion: a part that scrolls in script makes the scroll instant under it.

### First render and states

- Nothing animates as a page loads. Zag leaves `data-state` off an open collapsible on first render, but its presence does set `data-state="open"`, so a part open from the start needs its starting style gated (`data-initial` until the first change, or two frames after mount). A cached image, `img.complete && img.naturalWidth`, shows at once.
- A mark drawn with a dash and round caps leaves a dot when drawn backwards: fade it out, and reset the dash once it is invisible with a 0s transition delayed by the exit.
- `:active` matches a disabled or busy button and a zag part that is not a native one: guard presses (`motion-press`, the `pressing` variant) on `:disabled`, `aria-disabled`, `aria-busy`, `data-disabled` and `data-readonly`. A segmented control tints the pressed segment and gives its words a little, instead of shrinking it off its neighbours. Colors reach the pressed look with the press, as a phone has no hover to show one first.

### Focus

- The ring is drawn inside the control, never outside it: `focus-ring` puts a 3px ring just within a 2px edge, which stays, so the edge thickens inward and an invalid field keeps its red edge outside the ring. Where there is no room or no edge, a box, a radio, a switch, a handle, a soft or ghost button, a row, the part sets `--focus-inset: 3px` and the ring takes the edge's place. On a fill the ring would sink into, a solid button or a ticked box, the part sets `--focus-gap: var(--color-surface)` and a 2px line keeps the ring apart. `Foundations/Focus` fails if a ring reaches outside its control.
- A ring appears at once. In Tailwind 4, `transition-colors` includes `outline-color` and eases the ring in: list the properties instead. `outline-none` sets the style that `outline-3` reads back, so the pair never draws a ring.
- A part zag focuses itself after a press, a slider's handle, a dial, a star, would show the ring on every tap: the control sets `data-pointer` on pointerdown and clears it on a key (`notePointer`), and turns `--focus-style` to none from it. Test a ring with Tab and with a tap.

### Lists, waves and script-driven motion

- An item leaving a list (a chip) leaves on a transition plus `bloom-hold`, and is removed on that `animationend`. Its neighbours close the gap by FLIP: measure, remove, measure again, and run a Web Animation of `translate` from the difference. The Web Animations API does not resolve `var()`, so read `--duration-travel` and `--ease-smooth` with `getComputedStyle`; the theme and reduced motion then still apply.
- A staggered wave (a delay per item) gives delay 0 to items already moving when it turns back, or a fresh delay freezes them half way. Read the phase with `getAnimations()`, not timers, which `--slow` films break.
- An effect that animates when a value changes skips repeated values: zag can report the same value several times as it formats it.
- `duration-*` with no transition property leaves `transition-property: all`, and everything animates: always name the properties.
- A play test that waits for a story to settle waits only for animations that end: a spinner or a skeleton's sheen never does.
- Zag's navigation menu sets an inline `transition: none` on its viewport on a fresh open and after a switch, cutting running transitions: bloom's need `!` there. A parent's presence must last at least as long as its children's, or a child is still "leaving" at the next open.

### Tailwind notes

- Variant classes (`starting:`, `max-sm:`, `data-*:`) come after a custom `@utility`'s nested rules, so they override them.
- Tailwind's preflight `[hidden] { display: none !important }` beats a utility's `!important`: show a part zag hides through its `hidden` prop.
- Classes built from template literals are never generated.
