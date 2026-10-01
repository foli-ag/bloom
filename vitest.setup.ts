import { cleanup } from "@solidjs/testing-library"

// Solid 2 reports reactivity misuse (strict reads, owned writes) through the console, and so does zag
beforeEach(() => {
  vi.spyOn(console, "warn")
  vi.spyOn(console, "error")
})

afterEach(() => {
  cleanup()
  expect(console.warn).not.toHaveBeenCalled()
  expect(console.error).not.toHaveBeenCalled()
  vi.restoreAllMocks()
})
