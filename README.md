# MyST VS Code Extension

[![VS Marketplace][vs-market-badge]][vs-market-link]
[![Github-CI][github-ci-badge]][github-ci-link]

The official [MyST (Markedly Structured Text)](https://myst-parser.readthedocs.io) Textmate grammar, and VS Code extension, for extending the markdown language.

This extension injects additional elements into the base markdown syntax highlighting grammar, and adds additional language support for MyST specific elements.

**NEW**: In version 0.11, the preview parser has been fully re-written!

- [MyST VS Code Extension](#myst-vs-code-extension)
  - [Features](#features)
    - [Syntax Highlighting](#syntax-highlighting)
    - [Hover and Autocompletion](#hover-and-autocompletion)
    - [Preview Enhancement](#preview-enhancement)
      - [A note on dollar-math](#a-note-on-dollar-math)
  - [Working with Markdown](#working-with-markdown)
  - [Contributing](#contributing)
    - [Manual testing](#manual-testing)
    - [Building the grammar and snippet assets](#building-the-grammar-and-snippet-assets)
    - [Unit and integration testing](#unit-and-integration-testing)
    - [Linting](#linting)
    - [Publishing to VS Marketplace](#publishing-to-vs-marketplace)
  - [Acknowledgements](#acknowledgements)

## Features

### Syntax Highlighting

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/Screenshot.png">

Embedded code blocks/cells can be utilised in their native language:

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/embedded-code.gif">

### Hover and Autocompletion

Directive completion and hover is available for all built-in sphinx directives:

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/directive-completion.gif">

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/directive-hover.gif">

Snippet completions are also available for a number of Sphinx directives:

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/snippet-completion.gif">

### Preview Enhancement

This extension enhances VS Code's built-in Markdown previewer
([see this guide for info](https://code.visualstudio.com/api/extension-guides/markdown-extension)), to properly render MyST syntax like directives and other extensions.

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/preview.gif">

If you encounter any issues with this, you can disable it with the `myst.preview.enable` [configuration setting][vscode-settings] (and please report it).

You can add MyST syntax extensions with the `myst.preview.extensions` [configuration setting][vscode-settings]. Available extensions:

- `amsmath`: Parse AMS LaTeX math environments
- `deflist`: Parse definition lists
- `dollarmath`: Parse dollar-delimited math (on by default)
- `tasklist`: Parse GitHub style task lists

Note after changing this setting you should reload the VS Code window.

#### A note on dollar-math

From VS Code version `v1.58.0`, VS Code natively supports dollar math rendering ([see here](https://code.visualstudio.com/updates/v1_58#_math-formula-rendering-in-the-markdown-preview)).
Using the `dollarmath` extension overrides this with some slightly different parsing rules (e.g. dollarmath allows `$$` display math in inline contexts and also labels: `$$a=1$$ (label)`).

If there are still any incompatibilities you can turn off the native support with `markdown.math.enabled` [configuration setting][vscode-settings].

## Working with Markdown

Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
- Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
- Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

For more information:

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

## Contributing

The main grammar is stored in `syntaxes/myst.tmLanguage`. This file is generated from `myst.tmLanguage.base.yaml`.

See [this guide on textmate bundles](https://macromates.com/manual/en/language_grammars) and
[the VS Code guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide) for more help.

### Manual testing

To launch a local version of the extension in VS Code, first ensure the extension build is updated:

```console
$ npm run build
```

Now select the `Launch Extension` configuration in the VS Code `Run and Debug` side panel.
To launch a development version of the extension in VS Code, press `F5`.

### Building the grammar and snippet assets

The grammar is written as a [Jinja template](https://jinja.palletsprojects.com) YAML file,
with the templates and default variables stored in `template/`

To generate the asset files (grammar and snippets):

```bash
$ npm ci
$ npm run build:assets
```

or with python:

```bash
$ pip install yaml jinja2
$ python src/build.py
```

### Unit and integration testing

The test suite is split into:

- 'integration' tests, which require VS Code to be launched, and
- 'unit' tests, which can be run in the standard fashion with [mocha](https://mochajs.org)

You can run them on the CLI with `npm test`, or separately:

```bash
$ npm run pretest
$ npm run test:unit
$ npm run test:integration
```

Running from the CLI will download and launch a specific version of VS Code (see `src/test/runIntergration.ts`).

Note though, that running integration tests from within VS Code may error (see [Testing extensions tips](https://code.visualstudio.com/api/working-with-extensions/testing-extension#using-insiders-version-for-extension-development)).
In this case you can run the tests directly through the `Debug Launcher` in the side panel (see `.vscode/launch.json`). The output can be viewed in the debug console.

The highlighting test cases are stored as markdown files under `test_static/colorize-fixtures`.
Grammar test results are stored under `test_static/colorize-results`, which are automatically generated/updated from the fixtures.
Note though that the fixture results can change between VS Code versions, so you should use the version specified in `src/test/runIntergration.ts`.

### Linting

```bash
$ npm run lint
```

and to auto-fix lints:

```bash
$ npm run lint:fix
```

### Publishing to VS Marketplace

The publishing of the package should be done *via* the Github Actions CI. To trigger a release, bump the version in `package.json`, and create a new release tag on Github
starting with `release`, e.g. `release-0.9.4`.

See: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#publishing-extensions

## Acknowledgements

Testing originally adapted from [vscode-markdown-tm-grammar](https://github.com/microsoft/vscode-markdown-tm-grammar/tree/59a5962e4775bf96484bba64c5322422b555a40d).

VS Code Markdown extension exemplars were taken from [vscode/extensions/markdown-math](https://github.com/microsoft/vscode/blob/main/extensions/markdown-math).

[vs-market-badge]: https://vsmarketplacebadge.apphb.com/version/ExecutableBookProject.myst-highlight.svg "Current Release"
[vs-market-link]: https://marketplace.visualstudio.com/items?itemName=ExecutableBookProject.myst-highlight
[github-ci-badge]: https://img.shields.io/github/workflow/status/ExecutableBookProject/myst-highlight-grammar/Github-CI?label=Github-CI
[github-ci-link]: https://github.com/ExecutableBookProject/myst-highlight-grammar/actions
[vscode-settings]: https://code.visualstudio.com/docs/getstarted/settings
