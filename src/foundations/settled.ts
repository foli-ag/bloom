import { expect, waitFor } from "storybook/test"

/**
 * Resolves once nothing on the page is animating. A check made after it reads the state an animation ends in, never a
 * frame on the way, and axe, which runs after the story, measures colors at full opacity.
 */
export async function settled(): Promise<void> {
  await waitFor(() =>
    expect(document.getAnimations().filter((animation) => animation.playState === "running")).toEqual([]),
  )
}
