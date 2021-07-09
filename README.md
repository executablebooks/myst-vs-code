# myst-language-support

[![VS Marketplace][vs-market-badge]][vs-market-link]
[![Github-CI][github-ci-badge]][github-ci-link]

The official [MyST (Markedly Structured Text)](https://myst-parser.readthedocs.io) Textmate grammar, and VS Code extension, for extending the markdown language.

This extension injects additional elements into the base markdown syntax highlighting grammar,
and adds additional language support for MyST specific elements.

**Important** This extension is a work in progress, and future changes are likely.

- [myst-language-support](#myst-language-support)
  - [Features](#features)
    - [Syntax Highlighting](#syntax-highlighting)
    - [Hover and Autocompletion](#hover-and-autocompletion)
    - [Preview Enhancement](#preview-enhancement)
  - [Working with Markdown](#working-with-markdown)
  - [Contributing](#contributing)
    - [Manual testing](#manual-testing)
    - [Building the grammar and snippet assets](#building-the-grammar-and-snippet-assets)
    - [Testing](#testing)
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
([see this guide for info](https://code.visualstudio.com/api/extension-guides/markdown-extension)),
to properly render nested admonitions, and code directives, etc.

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/preview.gif">

If you encounter any issues with this, you can disable it
with the `myst.preview.enable` configuration option
(and please report it).

## Working with Markdown

Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

For more information:

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

## Contributing

The main grammar is stored in `syntaxes/myst.tmLanguage`. This file is generated from `myst.tmLanguage.base.yaml`.

See [this guide on textmate bundles](https://macromates.com/manual/en/language_grammars) and
[the VS Code guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide) for more help.

### Manual testing

To launch a local version of the extension in VS Code, first ensure the extension build is updated:

```console
$ npm run build
```

Now select the `Launch Extension` configuration in the VS Code debugger and run.
To launch a development version of the extension in VS Code, press `F5`.

See also [VS Code Testing Extension Guide](https://code.visualstudio.com/api/working-with-extensions/testing-extension)

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

### Testing

To run the full test suite:

```bash
$ npm test
```

The test suite is split into 'integration' tests,
which require VS Code to be launched,
and 'standalone' tests,
which can be run in the standard fashion with [mocha](https://mochajs.org).

```bash
$ npm run pretest
$ node ./out/test/runIntergration.js
$ ./node_modules/mocha/bin/mocha --ui tdd out/test/standalone/
```

The highlighting test cases are stored as markdown files under `test_static/colorize-fixtures`.
Grammar test results are stored under `test_static/colorize-results`, which are automatically generated/updated from the fixtures.

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

[vs-market-badge]: https://vsmarketplacebadge.apphb.com/version/ExecutableBookProject.myst-highlight.svg "Current Release"
[vs-market-link]: https://marketplace.visualstudio.com/items?itemName=ExecutableBookProject.myst-highlight
[github-ci-badge]: https://img.shields.io/github/workflow/status/ExecutableBookProject/myst-highlight-grammar/Github-CI?label=Github-CI
[github-ci-link]: https://github.com/ExecutableBookProject/myst-highlight-grammar/actions