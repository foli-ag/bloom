# @foliag/bloom

Styled Solid 2 components for generic products. Nothing is exported yet: `package.json` `exports` lists only
`./package.json`, and `src/` has a placeholder so that `tsc` has an input.

Each component will be imported from its own subpath, as in `@foliag/seeds`, with no root entry. A server or a dev
server does not tree-shake, so a root entry would load every component.

## Development

The flake provides Bun, Node and the Chromium build that Playwright drives. Run `direnv allow` once, or enter the shell
with `nix develop`.

```sh
bun install
bun run storybook        # previews and docs at http://localhost:6006
bun run build-storybook  # static site in storybook-static/
bun run test             # Vitest: tests/ and stories in headless Chromium, bundle checks in Node
bun run typecheck
bun run build            # tsc, one module and declaration per source file in dist/
bun run format           # biome
```

Component tests run in a real browser because positioning, focus trapping and outside clicks do nothing useful in
jsdom, and files in `tests/*.test.ts` run in Node. Playwright only drives browsers from its own release, so the
`playwright` devDependency stays at the version of `playwright-driver` in the locked nixpkgs. Update both together.

## Storybook

Storybook is the preview and the documentation site, through [storybook-solidjs-vite](https://github.com/solidjs-community/storybook).
Stories live next to their component as `src/<component>/<component>.stories.tsx`. The `stories` project in
`vite.config.ts` runs every story as a test in headless Chromium, so a story with a `play` function is also an
interaction test. `tsconfig.build.json` leaves stories out of `dist/`. Docs pages are `.mdx` files in `src/`. Add
`../src/**/*.mdx` to `stories` in `.storybook/main.ts` when the first one exists.

`storybook-solidjs-vite` imports `vite-plugin-solid`, the old name of `@solidjs/vite-plugin`. The `overrides` entry in
`package.json` points that name at `@solidjs/vite-plugin`, so the stories project uses the Solid 2 plugin. Without it Bun
installs `vite-plugin-solid` 2.11, the Solid 1 plugin, which breaks the stories project. Keep the override at the
same version as the `@solidjs/vite-plugin` devDependency, and remove it once `storybook-solidjs-vite` imports the new
name.

`nix flake check` builds the package and runs the typecheck and the tests in the sandbox. After changing `bun.lock`,
set `outputHash` of `bunDeps` in `nix/package.nix` to `lib.fakeHash`, run `nix build` and paste the hash it reports.

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
