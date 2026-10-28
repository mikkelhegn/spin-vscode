# Change Log

## [Unreleased]

* Added `Spin: Start Dev Dashboard` / `Spin: Stop Dev Dashboard`, wrapping the `spin dashboard`
  plugin for local topology/log/trace inspection. Opens in the default browser or an embedded
  VS Code panel, configurable via `spin.dashboardOpenIn` and `spin.dashboardPort`. The plugin is
  installed from its manifest URL (`spin.dashboardPluginUrl`) since it isn't yet in Spin's
  official plugin catalog.
* Added `spin.deployPlugin` to set `SPIN_DEPLOY_PLUGIN` for all `spin login`/`spin deploy`
  invocations — required on modern Spin versions when more than one deployment plugin
  (`cloud`, `aka`, ...) is installed, otherwise `spin login --status` and `spin deploy` fail.
* Updated project dependencies and fixed npm audit vulnerabilities; modernized CI workflows.

## [0.8.0]

* Updated to Spin 0.8.0
* Use XDG cache directory for downloaded Spin binary

## [0.6.0]

* Updated to Spin 0.6.0
* The extension no longer manages multiple deployment environments. Use the `Spin: Log In` command to switch between deployment environments.
* The `Spin: Deploy` no longer prompts for URLs or credentials. Use `Spin: Login` to provide these. This follows the new Spin 0.6 deployment model.
* Added support for GitHub authentication

## [0.5.0]

* Updated to Spin 0.5.0

## [0.3.1]

* Fixed issue with adding Spin to path on WSL

## [0.3.0]

- Automatically install Spin
- Tasks for `spin build` and `spin up`
- Add auto-installed Spin to integrated terminal path
