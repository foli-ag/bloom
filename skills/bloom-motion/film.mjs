#!/usr/bin/env node
/**
 * Films an animation in headless Chromium and lays it out on one sheet: frames at even steps of animation time,
 * cropped to what moves, a chart of what was measured on every frame, and a report of each animation the page ran.
 *
 *   node skills/bloom-motion/film.mjs --story components-switch--playground \
 *     --act "click:[data-scope=switch][data-part=root]" --track "[data-part=thumb]" --name switch-on
 *
 * The page's animations are slowed down (`--slow`, 10 times by default) through the DevTools protocol, which slows the
 * document timeline: CSS transitions, CSS animations, the Web Animations API, and the timestamp requestAnimationFrame
 * passes in. Timers and `performance.now()` keep real time, so a script that animates from them runs at full speed.
 * Frames come from the compositor's screencast, each stamped with the moment it was drawn, and every time on the sheet
 * is animation time: real time since the first `--act` step, divided by `--slow`.
 *
 * Steps for `--before` (run before filming, at full speed) and `--act` (run while filming, `wait` in animation time):
 *   click:SEL  tap:SEL  hover:SEL  focus:SEL  down:SEL (press and hold)  up  press:KEY  type:TEXT  wait:MS
 *   move:X,Y   drag:SEL:DX,DY   eval:JS
 * A selector is anything `page.locator()` takes: CSS, `text=Ouvrir`, `role=button[name="Ouvrir"]`.
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"
import { chromium } from "playwright"

const { values: o } = parseArgs({
  options: {
    url: { type: "string" },
    story: { type: "string" },
    storybook: { type: "string", default: process.env.STORYBOOK_URL ?? "http://localhost:6006" },
    globals: { type: "string", default: "" },
    args: { type: "string", default: "" },
    width: { type: "string", default: "480" },
    height: { type: "string", default: "360" },
    scale: { type: "string", default: "2" },
    touch: { type: "boolean", default: false },
    dark: { type: "boolean", default: false },
    reduced: { type: "boolean", default: false },
    before: { type: "string", multiple: true, default: [] },
    act: { type: "string", multiple: true, default: [] },
    track: { type: "string", multiple: true, default: [] },
    prop: { type: "string", multiple: true, default: [] },
    clip: { type: "string", multiple: true, default: [] },
    pad: { type: "string", default: "16" },
    ms: { type: "string", default: "600" },
    slow: { type: "string", default: "10" },
    frames: { type: "string", default: "16" },
    zoom: { type: "string" },
    out: { type: "string", default: process.env.FILM_DIR ?? "film" },
    name: { type: "string", default: "film" },
    json: { type: "boolean", default: false },
    still: { type: "boolean", default: false },
    focus: { type: "string", multiple: true, default: [] },
    help: { type: "boolean", default: false },
  },
})

if (o.help || (!o.url && !o.story)) {
  console.log(`film.mjs --story <id> | --url <url> [--act step]... [--track selector]... [options]

  --story ID        Storybook story id, opened from --storybook (default $STORYBOOK_URL or http://localhost:6006)
  --globals G       Storybook globals, as in its URL: "theme:dark;motion:reduced"
  --args A          Storybook args, as in its URL: "disabled:!true"
  --url URL         Any page instead of a story
  --width/--height  Viewport in CSS px (480x360). Under 640 wide is a phone for bloom.
  --scale N         Device pixel ratio (2)
  --touch           A touch screen: tap works and hover does not
  --dark            prefers-color-scheme: dark
  --reduced         prefers-reduced-motion: reduce
  --before STEP     Run before filming, at full speed. Repeatable.
  --act STEP        Run while filming. Repeatable. wait:MS is in animation time.
  --track SEL       Measure every element it matches on every frame, and crop the sheet to them. Repeatable.
  --prop NAME       Also measure this computed property on tracked elements, such as stroke-dashoffset. Repeatable.
  --clip SEL        Crop to these elements too, without charting them. "viewport" keeps the whole screen.
  --pad PX          Room around the crop (16)
  --ms MS           Animation time to film after the first step (600)
  --slow N          How many times slower the animations run while filmed (10). 1 is real time.
  --frames N        Frames on the sheet, at even steps of animation time (16)
  --zoom N          Scale of each frame on the sheet, worked out from the crop by default
  --out DIR         Where the sheet goes (film, or $FILM_DIR)
  --name NAME       File name of the sheet, without extension (film)
  --json            Also write the measurements as NAME.json
  --still           One still of the settled page after --before, cropped the same way, for reviewing a look
  --focus SEL       One picture per entry with that element focused from the keyboard, all on one sheet. Repeatable.
                    "FOCUS | CROP" focuses one element and crops to another, such as a checkbox's input and its box.`)
  process.exit(o.help ? 0 : 1)
}

const slow = Number(o.slow)
const filmMs = Number(o.ms)
const viewport = { width: Number(o.width), height: Number(o.height) }
const scale = Number(o.scale)
const pad = Number(o.pad)

const url =
  o.url ??
  `${o.storybook.replace(/\/$/, "")}/iframe.html?id=${encodeURIComponent(o.story)}&viewMode=story` +
    (o.globals ? `&globals=${o.globals}` : "") +
    (o.args ? `&args=${o.args}` : "")

const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: scale,
    hasTouch: o.touch,
    isMobile: false,
    colorScheme: o.dark ? "dark" : "light",
    reducedMotion: o.reduced ? "reduce" : "no-preference",
  })
  const page = await context.newPage()
  const pageErrors = []
  page.on("pageerror", (error) => pageErrors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") pageErrors.push(`${message.type()}: ${message.text()}`)
  })

  await page.goto(url, { waitUntil: "load" })
  if (o.story) {
    await page.waitForFunction(
      () => document.querySelector("#storybook-root")?.childElementCount > 0 || document.querySelector(".sb-show-errordisplay"),
      undefined,
      { timeout: 30000 },
    )
    const error = await page.evaluate(() =>
      document.body.classList.contains("sb-show-errordisplay") ? document.querySelector("#error-message")?.textContent : null,
    )
    if (error) throw new Error(`The story failed to render: ${error}`)
  }
  await page.evaluate(() => document.fonts.ready)
  await settle(page)

  for (const step of o.before) await run(page, step, 1)
  await settle(page)

  const cropSelectors = [...o.track, ...o.clip.filter((s) => s !== "viewport")]
  if (o.focus.length) {
    // One picture per entry, each with that element focused from the keyboard, so `:focus-visible` and zag's
    // `data-focus-visible` both hold. "FOCUS | CROP" focuses one element and crops to another, such as the hidden input
    // of a checkbox and its box.
    const shots = []
    for (const entry of o.focus) {
      const [focusSelector, cropSelector = focusSelector] = entry.split(" | ").map((part) => part.trim())
      // A key that moves nothing, so zag counts the focus as a keyboard one: it ignores Shift
      await page.keyboard.press("F12")
      await page.locator(focusSelector).first().focus()
      await page.waitForTimeout(80)
      await settle(page)
      const box = await page.locator(cropSelector).first().boundingBox()
      const shot = await page.screenshot({ type: "png" })
      shots.push({
        label: entry,
        data: shot.toString("base64"),
        crop: box
          ? {
              x: Math.max(0, box.x - pad),
              y: Math.max(0, box.y - pad),
              w: Math.min(viewport.width, box.x + box.width + pad) - Math.max(0, box.x - pad),
              h: Math.min(viewport.height, box.y + box.height + pad) - Math.max(0, box.y - pad),
            }
          : { x: 0, y: 0, w: viewport.width, h: viewport.height },
      })
    }
    await mkdir(o.out, { recursive: true })
    const sheetPath = path.join(o.out, `${o.name}.png`)
    await renderGallery(browser, { shots, sheetPath, title: `${o.story ?? o.url}  focused from the keyboard` })
    if (pageErrors.length) console.log(`page errors:\n  ${pageErrors.join("\n  ")}`)
    console.log(`sheet: ${sheetPath}`)
    await browser.close()
    process.exit(0)
  }
  if (o.still) {
    const still = await page.screenshot({ type: "png" })
    const state = await page.evaluate(sampleOnce, { tracks: cropSelectors, props: [] })
    await mkdir(o.out, { recursive: true })
    const sheetPath = path.join(o.out, `${o.name}.png`)
    const crop = cropBox([], state, o.clip.includes("viewport"))
    await renderSheet(browser, { shots: [{ label: "still", data: still.toString("base64") }], crop, series: [], sheetPath, title: `${o.story ?? o.url}  ${o.before.join("  ")}` })
    if (pageErrors.length) console.log(`page errors:\n  ${pageErrors.join("\n  ")}`)
    console.log(`sheet: ${sheetPath}`)
    await browser.close()
    process.exit(0)
  }

  const cdp = await context.newCDPSession(page)
  await cdp.send("Animation.enable")

  // Frames as the compositor draws them, each with its own timestamp
  const frames = []
  cdp.on("Page.screencastFrame", (frame) => {
    frames.push({ data: frame.data, t: frame.metadata.timestamp * 1000 })
    cdp.send("Page.screencastFrameAck", { sessionId: frame.sessionId }).catch(() => {})
  })
  await page.evaluate(installSampler, { tracks: cropSelectors, props: o.prop })
  await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1 })
  await cdp.send("Animation.setPlaybackRate", { playbackRate: 1 / slow })
  // A frame of the state before the first step, as the screencast only sends a frame when something changes
  await page.evaluate(() => {
    document.documentElement.style.setProperty("--film-nudge", "1")
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
  await page.waitForTimeout(150)
  const before = await page.screenshot({ type: "png" })

  const actAt = await page.evaluate(() => performance.timeOrigin + performance.now())
  for (const step of o.act) await run(page, step, slow)
  const elapsed = (await page.evaluate(() => performance.timeOrigin + performance.now())) - actAt
  await page.waitForTimeout(Math.max(0, filmMs * slow - elapsed) + 100)

  await cdp.send("Page.stopScreencast")
  const film = await page.evaluate(() => {
    if (!window.__film) return null
    window.__film.stop = true
    return { samples: window.__film.samples, anims: window.__film.anims }
  })
  // A hot update of the page's code reloads it, and what was measured goes with it
  if (!film) throw new Error("The page reloaded while filming, probably a hot update: film it again")
  await cdp.send("Animation.setPlaybackRate", { playbackRate: 1 })
  await settle(page)
  const settled = await page.screenshot({ type: "png" })
  const settledState = await page.evaluate(sampleOnce, { tracks: cropSelectors, props: o.prop })

  const animTime = (t) => (t - actAt) / slow
  const samples = film.samples.map((sample) => ({ ...sample, at: animTime(sample.t) }))
  const anims = film.anims.map((anim) => ({
    ...anim,
    at: animTime(anim.t),
    finishedAt: anim.finished === undefined ? undefined : animTime(anim.finished),
    canceledAt: anim.canceled === undefined ? undefined : animTime(anim.canceled),
  }))

  // The frame on screen at each step: the last one drawn at or before it
  const shots = [{ label: "before", data: before.toString("base64") }]
  const timed = frames.map((frame) => ({ ...frame, at: animTime(frame.t) })).sort((a, b) => a.at - b.at)
  const count = Number(o.frames)
  for (let index = 0; index < count; index++) {
    const at = (filmMs * index) / (count - 1)
    const shown = timed.filter((frame) => frame.at <= at).at(-1)
    shots.push({ label: `${Math.round(at)}ms`, data: shown?.data ?? before.toString("base64"), stale: !shown })
  }
  shots.push({ label: "settled", data: settled.toString("base64") })

  const crop = cropBox(samples, settledState, o.clip.includes("viewport"))
  const series = toSeries(samples, o.track, o.prop)
  const report = describe({ anims, series, frames: timed, pageErrors, settledState })

  await mkdir(o.out, { recursive: true })
  const sheetPath = path.join(o.out, `${o.name}.png`)
  await renderSheet(browser, { shots, crop, series, sheetPath, title: `${o.story ?? o.url}  ${o.act.join("  ")}` })
  if (o.json) {
    await writeFile(
      path.join(o.out, `${o.name}.json`),
      JSON.stringify({ url, slow, ms: filmMs, anims, samples, settledState }, null, 1),
    )
  }
  console.log(report)
  console.log(`sheet: ${sheetPath}`)
} finally {
  await browser.close()
}

/** Runs one step. `wait` is in animation time, so it is stretched as much as the animations are. */
async function run(page, step, stretch) {
  const [verb, ...restParts] = step.split(":")
  const rest = restParts.join(":")
  const target = () => page.locator(rest).first()
  switch (verb) {
    case "click":
      return target().click({ force: stretch > 1 })
    case "tap":
      return target().tap({ force: stretch > 1 })
    case "hover":
      return target().hover({ force: stretch > 1 })
    case "focus":
      return target().focus()
    case "down": {
      const box = await target().boundingBox()
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      return page.mouse.down()
    }
    case "up":
      return page.mouse.up()
    case "press":
      return page.keyboard.press(rest)
    case "type":
      return page.keyboard.type(rest)
    case "wait":
      return page.waitForTimeout(Number(rest) * stretch)
    case "move": {
      const [x, y] = rest.split(",").map(Number)
      return page.mouse.move(x, y)
    }
    case "drag": {
      const at = rest.lastIndexOf(":")
      const box = await page.locator(rest.slice(0, at)).first().boundingBox()
      const [dx, dy] = rest.slice(at + 1).split(",").map(Number)
      const x = box.x + box.width / 2
      const y = box.y + box.height / 2
      await page.mouse.move(x, y)
      await page.mouse.down()
      await page.mouse.move(x + dx, y + dy, { steps: 12 })
      return page.mouse.up()
    }
    case "eval":
      return page.evaluate(rest)
    default:
      throw new Error(`Unknown step "${step}"`)
  }
}

/** Waits until no animation that ends is running: spinners and other endless ones are left to run */
async function settle(page) {
  await page
    .waitForFunction(
      () =>
        document
          .getAnimations()
          .filter((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations !== Infinity).length === 0,
      undefined,
      { timeout: 10000, polling: 50 },
    )
    .catch(() => console.warn("warning: animations were still running after 10s"))
}

/** Runs in the page: measures the tracked elements on every frame and logs each animation as it starts */
function installSampler({ tracks, props }) {
  const film = (window.__film = { samples: [], anims: [], stop: false })
  const seen = new WeakSet()
  // The output of each stop of a `linear()` curve. The page serializes a resolved curve with its stops' positions, so
  // two spellings of one curve are compared by their outputs.
  const outputs = (value) =>
    /^\s*linear\(/.test(value ?? "")
      ? value
          .replace(/^\s*linear\(|\)\s*$/g, "")
          .split(",")
          .map((stop) => Number.parseFloat(stop))
          .join(",")
      : undefined
  const root = getComputedStyle(document.documentElement)
  const curves = Object.fromEntries(
    ["smooth", "pop", "press"].map((curve) => [curve, outputs(root.getPropertyValue(`--ease-${curve}`))]),
  )
  // Two elements of the same name, such as the two paths of a mark, stay apart in the report
  const ids = new WeakMap()
  let lastId = 0
  const idOf = (element) => {
    if (!element) return 0
    if (!ids.has(element)) ids.set(element, ++lastId)
    return ids.get(element)
  }
  const name = (element, pseudo) => {
    if (!element) return "?"
    const scope = element.getAttribute("data-scope")
    const part = element.getAttribute("data-part")
    const id = scope || part ? `[${[scope, part].filter(Boolean).join(":")}]` : ""
    const cls = typeof element.className === "string" ? element.className.split(/\s+/).slice(0, 2).join(".") : ""
    return `${element.tagName.toLowerCase()}${id || (cls ? `.${cls}` : "")}${pseudo ?? ""}`
  }
  const easing = (value) => {
    const stops = outputs(value)
    if (stops === undefined) return value
    const known = Object.entries(curves).find(([, curve]) => curve === stops)
    return known ? `ease-${known[0]}` : `linear(${stops.split(",").length} stops)`
  }
  // How opaque it shows: its own opacity times that of everything around it, as a panel often fades on a wrapper
  const alpha = (element) => {
    let value = 1
    for (let at = element; at; at = at.parentElement) value *= Number(getComputedStyle(at).opacity)
    return value
  }
  // CSS, or CSS followed by " >> nth=N" as in the steps
  const pick = (selector) => {
    const nth = /^(.*?)\s*>>\s*nth=(-?\d+)$/.exec(selector)
    const all = [...document.querySelectorAll(nth ? nth[1] : selector)]
    if (!nth) return all
    const element = all.at(Number(nth[2]))
    return element ? [element] : []
  }
  const read = (element) => {
    const style = getComputedStyle(element)
    const box = element.getBoundingClientRect()
    const values = {
      x: box.x,
      y: box.y,
      w: box.width,
      h: box.height,
      opacity: Number(style.opacity),
      alpha: alpha(element),
      translate: style.translate,
      scale: style.scale,
      rotate: style.rotate,
      transform: style.transform,
      visibility: style.visibility,
    }
    for (const prop of props) values[prop] = style.getPropertyValue(prop)
    return values
  }
  // The time a frame is measured, on the wall clock the screencast stamps its frames with. Not the timestamp
  // requestAnimationFrame passes in: that one follows the document timeline, which runs slowed while filming.
  const frame = () => {
    if (film.stop) return
    const t = performance.timeOrigin + performance.now()
    film.samples.push({ t, tracks: tracks.map((selector) => pick(selector).map(read)) })
    for (const animation of document.getAnimations()) {
      if (seen.has(animation)) continue
      seen.add(animation)
      // An enter animation that ended before filming and holds its end state, as `fill: both` does, is not news
      if (animation.playState === "finished") continue
      const effect = animation.effect
      const timing = effect?.getComputedTiming() ?? {}
      const keyframes = effect?.getKeyframes?.() ?? []
      const animated = new Set(
        keyframes.flatMap((keyframe) =>
          Object.keys(keyframe).filter((key) => !["offset", "computedOffset", "easing", "composite"].includes(key)),
        ),
      )
      const entry = {
        t,
        kind: animation.constructor.name,
        what: animation.transitionProperty ?? animation.animationName ?? animation.id,
        props: [...animated],
        target: name(effect?.target, effect?.pseudoElement),
        element: idOf(effect?.target),
        duration: timing.duration,
        delay: timing.delay,
        iterations: timing.iterations,
        easing: easing(animation.transitionProperty ? effect?.getTiming().easing : keyframes[0]?.easing),
      }
      film.anims.push(entry)
      animation.addEventListener("finish", () => (entry.finished = performance.timeOrigin + performance.now()))
      animation.addEventListener("cancel", () => (entry.canceled = performance.timeOrigin + performance.now()))
    }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

function sampleOnce({ tracks, props }) {
  const pick = (selector) => {
    const nth = /^(.*?)\s*>>\s*nth=(-?\d+)$/.exec(selector)
    const all = [...document.querySelectorAll(nth ? nth[1] : selector)]
    if (!nth) return all
    const element = all.at(Number(nth[2]))
    return element ? [element] : []
  }
  const alpha = (element) => {
    let value = 1
    for (let at = element; at; at = at.parentElement) value *= Number(getComputedStyle(at).opacity)
    return value
  }
  return tracks.map((selector) =>
    pick(selector).map((element) => {
      const style = getComputedStyle(element)
      const box = element.getBoundingClientRect()
      const values = { x: box.x, y: box.y, w: box.width, h: box.height, opacity: Number(style.opacity), alpha: alpha(element) }
      for (const prop of props) values[prop] = style.getPropertyValue(prop)
      return values
    }),
  )
}

/** The part of the screen to show: every tracked element on every frame, with room around it */
function cropBox(samples, settledState, whole) {
  const full = { x: 0, y: 0, w: viewport.width, h: viewport.height }
  if (whole) return full
  const boxes = [...samples.flatMap((sample) => sample.tracks.flat()), ...settledState.flat()].filter(
    // Not a frame where it cannot be seen, such as a floating panel drawn once at 0,0 before it is placed
    (box) => box.w > 0 && box.h > 0 && (box.alpha === undefined || box.alpha > 0.02) && box.visibility !== "hidden",
  )
  if (boxes.length === 0) return full
  const left = Math.max(0, Math.min(...boxes.map((box) => box.x)) - pad)
  const top = Math.max(0, Math.min(...boxes.map((box) => box.y)) - pad)
  const right = Math.min(viewport.width, Math.max(...boxes.map((box) => box.x + box.w)) + pad)
  const bottom = Math.min(viewport.height, Math.max(...boxes.map((box) => box.y + box.h)) + pad)
  return { x: left, y: top, w: right - left, h: bottom - top }
}

/** Numbers that changed on the first element of each track, over animation time */
function toSeries(samples, tracks, props) {
  const series = []
  tracks.forEach((selector, index) => {
    const keys = ["x", "y", "w", "h", "opacity", "alpha", "scale", "rotate", "translateX", "translateY", ...props]
    for (const key of keys) {
      const points = samples
        .filter((sample) => sample.at >= -50)
        .map((sample) => {
          const values = sample.tracks[index]?.[0]
          const seen = values !== undefined && values.alpha > 0.02 && values.visibility !== "hidden"
          return { at: sample.at, value: numeric(values, key), seen }
        })
        .filter((point) => point.value !== undefined && Number.isFinite(point.value))
      const values = points.map((point) => point.value)
      if (values.length < 2 || Math.max(...values) - Math.min(...values) < 0.01) continue
      series.push({ label: `${selector} ${key}`, points })
    }
  })
  return series
}

function numeric(values, key) {
  if (!values) return undefined
  if (key === "scale") return values.scale === "none" ? 1 : Number.parseFloat(values.scale)
  if (key === "rotate") return values.rotate === "none" ? 0 : Number.parseFloat(values.rotate)
  if (key === "translateX" || key === "translateY") {
    const [x = "0", y = "0"] = values.translate === "none" ? [] : values.translate.split(" ")
    return Number.parseFloat(key === "translateX" ? x : y)
  }
  const value = values[key]
  return typeof value === "number" ? value : Number.parseFloat(value)
}

/** What a reviewer reads first: each animation, how each measured value travelled, and anything that jumped */
function describe({ anims, series, frames, pageErrors }) {
  const lines = []
  const fast = new Set(["opacity", "transform", "translate", "scale", "rotate", "filter"])
  lines.push(`frames: ${frames.length} drawn while filming`)
  lines.push(anims.length ? "animations:" : "animations: none started")
  // Transitions of one element that start together on one curve are one line: a color change is five transitions
  const groups = new Map()
  for (const anim of anims) {
    const end =
      anim.canceledAt !== undefined
        ? `CANCELED at ${Math.round(anim.canceledAt)}ms`
        : anim.finishedAt !== undefined
          ? `ended ${Math.round(anim.finishedAt)}ms`
          : anim.iterations === Infinity
            ? "endless"
            : "still running"
    const kind = anim.kind === "CSSTransition" ? "transition" : anim.kind === "CSSAnimation" ? `animation ${anim.what}` : anim.kind
    const timing = `${Math.round(anim.duration)}ms${anim.delay ? ` +${anim.delay}ms delay` : ""} ${anim.easing ?? ""}`
    const key = [Math.round(anim.at), kind, anim.element, anim.target, timing, end].join("|")
    const props = anim.kind === "CSSTransition" ? [anim.what] : anim.props
    if (groups.has(key)) groups.get(key).props.push(...props)
    else groups.set(key, { at: anim.at, kind, target: anim.target, timing, end, props: [...props] })
  }
  for (const group of groups.values()) {
    const props = shorten(group.props)
    const slowProps = props.filter((prop) => !fast.has(prop) && !prop.startsWith("--"))
    lines.push(
      `  ${fmt(group.at)}  ${group.kind} on ${group.target}  ${group.timing}  [${props.join(", ")}]  ${group.end}` +
        (slowProps.length ? `  (main thread: ${slowProps.join(", ")})` : ""),
    )
  }
  if (series.length) lines.push("measured:")
  for (const { label, points } of series) {
    const first = points.find((point) => point.at >= 0) ?? points[0]
    const start = (points.filter((point) => point.at < 0).at(-1) ?? first).value
    const end = points.at(-1).value
    const range = end - start
    const values = points.map((point) => point.value)
    let note = `${round(start)} → ${round(end)}`
    const span = Math.max(...values) - Math.min(...values)
    if (Math.abs(range) > span * 0.05) {
      const over = range > 0 ? Math.max(...values) - end : end - Math.min(...values)
      const under = range > 0 ? start - Math.min(...values) : Math.max(...values) - start
      const ninety = points.find((point) => point.at >= 0 && (point.value - start) / range >= 0.9)
      const still = [...points].reverse().find((point) => Math.abs(point.value - end) > Math.abs(range) * 0.01)
      note += `  90% at ${ninety ? Math.round(ninety.at) : "?"}ms, still from ${still ? Math.round(still.at) : 0}ms`
      if (over > Math.abs(range) * 0.005) note += `, overshoots ${Math.round((over / Math.abs(range)) * 1000) / 10}%`
      if (under > Math.abs(range) * 0.02) note += `, first goes the wrong way ${Math.round((under / Math.abs(range)) * 100)}%`
    } else {
      note += `  (comes back where it started, after going ${round(Math.min(...values))} to ${round(Math.max(...values))})`
    }
    // A jump is a break in the motion: from one measured frame to the next, more than a quarter of the travel, and
    // enough to notice, 2px or a sixth of full opacity, while it can be seen. Slowed down, frames are a tenth of a real
    // frame apart, so only a real break shows; a fast but continuous motion, such as a reversed transition Chrome
    // shortens or a flick, does not. At --slow 1 a frame is a real frame, and a quarter of the travel in one is a jump.
    const measure = label.slice(label.lastIndexOf(" ") + 1)
    const floor = ["x", "y", "w", "h", "translateX", "translateY"].includes(measure)
      ? 2
      : ["opacity", "alpha"].includes(measure)
        ? 0.15
        : 0
    const jumps = []
    for (let index = 1; index < points.length; index++) {
      if (!points[index].seen || !points[index - 1].seen) continue
      const step = Math.abs(points[index].value - points[index - 1].value)
      if (step <= Math.max(Math.abs(range), span) * 0.25 || step <= floor) continue
      if (jumps.length === 0 || points[index].at - jumps.at(-1).at > 16.7) jumps.push(points[index])
    }
    if (jumps.length) note += `  JUMPS at ${jumps.map((point) => `${Math.round(point.at)}ms`).join(", ")}`
    lines.push(`  ${label}: ${note}`)
  }
  if (pageErrors.length) lines.push(`page errors:\n  ${pageErrors.join("\n  ")}`)
  return lines.join("\n")
}

/** border-top-color, border-right-color… as border-color */
function shorten(props) {
  const sides = ["top", "right", "bottom", "left"]
  const out = [...new Set(props)]
  for (const suffix of ["color", "width", "style"]) {
    const longhands = sides.map((side) => `border-${side}-${suffix}`)
    if (longhands.every((prop) => out.includes(prop))) {
      out.splice(out.indexOf(longhands[0]), 1, `border-${suffix}`)
      for (const prop of longhands.slice(1)) out.splice(out.indexOf(prop), 1)
    }
  }
  return out
}

function fmt(at) {
  return `${at < 0 ? "" : "+"}${Math.round(at)}ms`.padStart(7)
}

function round(value) {
  return Math.round(value * 1000) / 1000
}

/**
 * Lays the frames out in a grid, each cropped and labelled, with the chart under them, and saves it as a PNG. Time runs
 * across the motion: down the columns when things move sideways, so each frame sits right under the one before and a
 * step of a few pixels shows, and along the rows when they move up or down.
 */
async function renderSheet(browser, { shots, crop, series, sheetPath, title }) {
  const travel = (axis) =>
    Math.max(
      0,
      ...series
        .filter(({ label }) => (axis === "x" ? / (x|w|translateX)$/ : / (y|h|translateY)$/).test(label))
        .map(({ points }) => {
          const seen = points.filter((point) => point.seen).map((point) => point.value)
          return seen.length ? Math.max(...seen) - Math.min(...seen) : 0
        }),
    )
  const sideways = travel("x") > travel("y")
  // The grid whose frames come out largest on a sheet a viewer can show without shrinking it, about 1600px square
  let layout
  for (let columns = 1; columns <= shots.length; columns++) {
    const rows = Math.ceil(shots.length / columns)
    const fits = Math.min(3, (1600 - 12 * (columns - 1)) / (columns * crop.w), (1300 - 36 * rows) / (rows * crop.h))
    if (!layout || fits > layout.fits + 1e-9) layout = { columns, rows, fits }
  }
  const { columns, rows } = layout
  const zoom = o.zoom ? Number(o.zoom) : layout.fits
  const cellWidth = Math.round(crop.w * zoom)
  const cellHeight = Math.round(crop.h * zoom)
  const chart = chartSvg(series, Math.max(columns * (cellWidth + 12) - 12, 600))
  const html = `<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; padding: 16px; background: #1b1d1a; color: #e6e9e3; font: 13px/1.3 ui-monospace, monospace; }
    h1 { font-size: 13px; font-weight: 600; margin: 0 0 12px; white-space: pre-wrap; word-break: break-all; }
    .grid { display: grid; grid-template-columns: repeat(${columns}, ${cellWidth}px); gap: 12px; }
    ${sideways ? `.grid { grid-auto-flow: column; grid-template-rows: repeat(${rows}, auto); }` : ""}
    .cell { display: grid; gap: 4px; }
    .frame { position: relative; width: ${cellWidth}px; height: ${cellHeight}px; overflow: hidden; outline: 1px solid #444; }
    .frame img { position: absolute; left: ${-crop.x * zoom}px; top: ${-crop.y * zoom}px; width: ${viewport.width * zoom}px; }
    .stale { opacity: .35 }
    svg { margin-top: 16px; display: block; }
  </style><h1>${escapeHtml(title)}</h1><div class="grid">${shots
    .map(
      (shot) =>
        `<div class="cell"><div class="frame"><img src="data:image/png;base64,${shot.data}"></div><div class="${shot.stale ? "stale" : ""}">${shot.label}</div></div>`,
    )
    .join("")}</div>${chart}`
  const page = await browser.newPage({ viewport: { width: 400, height: 300 }, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: "load" })
  await page.screenshot({ path: sheetPath, fullPage: true })
  await page.close()
}

/** Each measured value from where it started (0) to where it ended (1) over animation time, so curves compare */
function chartSvg(series, width) {
  if (series.length === 0) return ""
  const height = 220
  const left = 40
  const right = 12
  const top = 12
  const bottom = 24
  const end = filmMs
  const x = (at) => left + (Math.min(Math.max(at, 0), end) / end) * (width - left - right)
  const y = (value) => top + (1 - (value + 0.25) / 1.5) * (height - top - bottom)
  const colors = ["#8fd16a", "#6ab0f3", "#f3b16a", "#e57373", "#c792ea", "#4dd0e1", "#fff176", "#a1887f"]
  const lines = series.map(({ label, points }, index) => {
    const start = (points.filter((point) => point.at < 0).at(-1) ?? points[0]).value
    const stop = points.at(-1).value
    // A value that comes back where it started, such as a flash, is drawn from its lowest (0) to its highest (1)
    const values = points.map((point) => point.value)
    const span = Math.max(...values) - Math.min(...values)
    const there = Math.abs(stop - start) > span * 0.05
    const from = there ? start : Math.min(...values)
    const range = there ? stop - start : span || 1
    const path = points
      .filter((point) => point.at >= 0 && point.at <= end)
      .map((point, i) => `${i ? "L" : "M"}${x(point.at).toFixed(1)},${y((point.value - from) / range).toFixed(1)}`)
      .join("")
    const color = colors[index % colors.length]
    return `<path d="${path}" fill="none" stroke="${color}" stroke-width="2"/><text x="${left + 8}" y="${top + 14 + index * 15}" fill="${color}">${escapeHtml(label)}</text>`
  })
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((step) => {
    const at = end * step
    return `<line x1="${x(at)}" x2="${x(at)}" y1="${top}" y2="${height - bottom}" stroke="#333"/><text x="${x(at)}" y="${height - 6}" fill="#888" text-anchor="middle">${Math.round(at)}ms</text>`
  })
  const levels = [0, 1].map(
    (level) =>
      `<line x1="${left}" x2="${width - right}" y1="${y(level)}" y2="${y(level)}" stroke="#555" stroke-dasharray="4 4"/><text x="${left - 6}" y="${y(level) + 4}" fill="#888" text-anchor="end">${level}</text>`,
  )
  return `<svg width="${width}" height="${height}" font-family="ui-monospace, monospace" font-size="12">${ticks.join("")}${levels.join("")}${lines.join("")}</svg>`
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char])
}

/** Lays out pictures each cropped on its own, at one zoom, for comparing one look across many parts */
async function renderGallery(browser, { shots, sheetPath, title }) {
  const zoom = o.zoom ? Number(o.zoom) : 2
  const cells = shots
    .map(
      (shot) =>
        `<div class="cell"><div class="frame" style="width:${Math.round(shot.crop.w * zoom)}px;height:${Math.round(shot.crop.h * zoom)}px"><img src="data:image/png;base64,${shot.data}" style="left:${-shot.crop.x * zoom}px;top:${-shot.crop.y * zoom}px;width:${viewport.width * zoom}px"></div><div>${escapeHtml(shot.label)}</div></div>`,
    )
    .join("")
  const html = `<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; padding: 16px; width: 1568px; background: #1b1d1a; color: #e6e9e3; font: 12px/1.3 ui-monospace, monospace; }
    h1 { font-size: 13px; font-weight: 600; margin: 0 0 12px; }
    .grid { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
    .cell { display: grid; gap: 4px; max-width: 760px; word-break: break-all; }
    .frame { position: relative; overflow: hidden; outline: 1px solid #444; }
    .frame img { position: absolute; }
  </style><h1>${escapeHtml(title)}</h1><div class="grid">${cells}</div>`
  const page = await browser.newPage({ viewport: { width: 1600, height: 300 }, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: "load" })
  await page.screenshot({ path: sheetPath, fullPage: true })
  await page.close()
}
