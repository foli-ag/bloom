{
  perSystem =
    { self', playwrightEnv, ... }:
    let
      # Runs a package.json script against the package's source and installed dependencies
      bunScript =
        script:
        self'.packages.default.overrideAttrs {
          name = "foliag-bloom-${script}";
          env = playwrightEnv;
          buildPhase = ''
            runHook preBuild
            bun run ${script}
            runHook postBuild
          '';
          installPhase = "touch $out";
        };
    in
    {
      checks = {
        package = self'.packages.default;
        typecheck = bunScript "typecheck";
        test = bunScript "test";
      };
    };
}
