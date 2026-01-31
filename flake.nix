{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { nixpkgs, ... }:
    let
      eachSystem = f:
        nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = eachSystem (pkgs:
        let
          playwright-browsers = pkgs.playwright-driver.browsers.override {
            withFirefox = true;
            withWebkit = true;
            withFfmpeg = false;
          };
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.nodejs_22
              pkgs.pnpm
              pkgs.nodePackages.typescript
              pkgs.nodePackages.typescript-language-server
              playwright-browsers
              pkgs.playwright-test
            ];

            shellHook = ''
              export PLAYWRIGHT_NODEJS_PATH="${pkgs.nodejs_22}/bin/node";
              export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
              export PLAYWRIGHT_BROWSERS_PATH="${playwright-browsers}"
              export PLAYWRIGHT_HOST_PLATFORM_OVERRIDE="ubuntu-24.04"
            '';
          };
        });
    };
}
