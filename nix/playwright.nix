{
  perSystem =
    { pkgs, ... }:
    let
      # Chromium and the headless shell Playwright runs it as. Playwright only drives browser builds from its own
      # release, so the `playwright` devDependency stays pinned to `pkgs.playwright-driver.version`.
      browsers = pkgs.playwright-driver.browsers.override {
        withFirefox = false;
        withWebkit = false;
        withFfmpeg = false;
      };
    in
    {
      # Environment for Vitest browser mode, shared by the dev shell and the test check
      _module.args.playwrightEnv = {
        PLAYWRIGHT_BROWSERS_PATH = "${browsers}";
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
        # Playwright looks for Ubuntu system libraries, which the Nix builds link in themselves
        PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
        # Chromium aborts on its first text without a font configuration, which the build sandbox lacks. Pinning the
        # fonts also lays text out the same on every machine.
        FONTCONFIG_FILE = "${pkgs.makeFontsConf { fontDirectories = [ pkgs.dejavu_fonts ]; }}";
      };
    };
}
