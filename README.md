# myst-highlight-grammar

[![VS Marketplace](https://vsmarketplacebadge.apphb.com/version/ExecutableBookProject.myst-highlight.svg "Current Release")](https://marketplace.visualstudio.com/items?itemName=ExecutableBookProject.myst-highlight)
[![Build Status](https://travis-ci.org/ExecutableBookProject/myst-highlight-grammar.svg?branch=master)](https://travis-ci.org/ExecutableBookProject/myst-highlight-grammar)

[MyST (Markedly Structured Text)](https://myst-parser.readthedocs.io) markdown's official Textmate grammar, and VS Code extension.

**Important** This extension is still in alpha development, and may change in the future.

This extension will override the syntax highlighting of
markdown files and will also highlight `.myst`, `.mystnb` and `.mnb` files.

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/Screenshot.png">

Embedded code blocks/cells can be utilised in their native language:

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/embedded-code.gif">

Originally adapted from [vscode-markdown-tm-grammar](https://github.com/microsoft/vscode-markdown-tm-grammar/tree/59a5962e4775bf96484bba64c5322422b555a40d).

## Contributing

The main grammar is stored in `syntaxes/myst.tmLanguage`. This file is generated from `myst.tmLanguage.base.yaml`.

See [this guide on textmate bundles](https://macromates.com/manual/en/language_grammars) and
[the VS Code guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide) for more help.

### Building

To generate the main grammar:

```bash
$ npm install
$ npm run build
```

### Testing

To launch a development version of the extension in VS Code, press `F5`.

To run the grammar tests:

```bash
$ npm run test
```

The test cases are stored as markdown files under `test/colorize-fixtures`. Grammar test results are stored under `test/colorize-results`, which are automatically generated from the fixtures.

To test the grammar in VS Code, select the `Launch Extension` configuration in the VS Code debugger and run.

### Publishing to VS Marketplace

See: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#publishing-extensions

```console
$ vsce publish minor
```
