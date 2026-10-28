# spin-vscode

[Spin](https://spin.fermyon.dev) is a framework for building, deploying, and running fast, secure, and composable
cloud microservices with WebAssembly. This extension integrates Spin developer
tasks into the Visual Studio Code editor.

The project is at a very early stage. It currently provides the following features:

* Tasks for building and running Spin applications (`spin: build` and `spin: up`)
* `Spin: Start Dev Dashboard` / `Spin: Stop Dev Dashboard` — runs the
  [Spin Dev Dashboard](https://github.com/mikkelhegn/dash) plugin (`spin dashboard`), a local
  developer dashboard with a topology graph, live logs, and OpenTelemetry traces/metrics for
  your running Spin application. Prompts to install the `dashboard` Spin plugin the first time
  it's used.

## Configuration

The extension provides the following configuration options:

* `spin.customProgramPath`: By default, the extension downloads and uses a compatible version
  of Spin for you.  If you want to use your own copy of Spin, provide the full path
  (including filename and extension) here.  This can be useful if you are working on
  Spin itself and want to use your development build.
* `spin.dashboardOpenIn`: Where to open the Spin Dev Dashboard UI — `"browser"` (default) opens
  your system's default browser, `"webview"` embeds it in a VS Code panel.
* `spin.dashboardPort`: Port for the Spin Dev Dashboard HTTP server. Defaults to `3001`.
* `spin.dashboardPluginUrl`: Plugin manifest URL used to install the Spin Dashboard plugin. The
  plugin isn't yet listed in Spin's official plugin catalog, so it's installed from this manifest
  URL rather than by name; override it if a newer build is published.
* `spin.deployPlugin`: Default deployment plugin for `spin login`/`spin deploy` (e.g. `cloud`,
  `aka`). Modern versions of Spin require this to be set (via the `SPIN_DEPLOY_PLUGIN`
  environment variable) when more than one deploy-capable plugin is installed — leave blank to
  use Spin's own default behavior.

## Contributing

We welcome contributions, whether bug reports, feature suggestions, or pull requests.
Any contribution and interaction on this or any Fermyon project MUST follow our
[code of conduct](https://www.fermyon.com/code-of-conduct). Thank you for being
part of an inclusive and open community!
