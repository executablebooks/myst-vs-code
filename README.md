# myst-highlight-grammar

[![VS Marketplace](https://vsmarketplacebadge.apphb.com/version/ExecutableBookProject.myst-highlight.svg "Current Release")](https://marketplace.visualstudio.com/items?itemName=ExecutableBookProject.myst-highlight)
![Build Status](https://github.com/ExecutableBookProject/myst-highlight-grammar/workflows/Node.js%20CI/badge.svg)

[MyST (Markedly Structured Text)](https://myst-parser.readthedocs.io) official Textmate grammar, and VS Code extension, for extending the markdown language.

This extension injects additional elements into the base markdown syntax highlighting grammar,
and will also highlight `.myst`, `.mystnb` and `.mnb` files.

**Important** This extension is still in alpha development, and may change in the future.

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/Screenshot.png">

Embedded code blocks/cells can be utilised in their native language:

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/embedded-code.gif">

Snippet completions are available for a number of Sphinx directives:

<img width="500" alt="screenshot" src="https://raw.githubusercontent.com/ExecutableBookProject/myst-highlight-grammar/master/images/snippet-completion.gif">

## Working with Markdown

Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

## Contributing

The main grammar is stored in `syntaxes/myst.tmLanguage`. This file is generated from `myst.tmLanguage.base.yaml`.

See [this guide on textmate bundles](https://macromates.com/manual/en/language_grammars) and
[the VS Code guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide) for more help.

### Building

The grammar is written as a [jinja template](https://jinja.palletsprojects.com) YAML file,
with the templates and default variables stored in `template/`

To generate the main grammar with javascript:

```bash
$ npm install
$ npm run build
```

or with python:

```bash
$ pip install yaml jinja2
$ python build.py
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

## Acknowledgements

Testing originally adapted from [vscode-markdown-tm-grammar](https://github.com/microsoft/vscode-markdown-tm-grammar/tree/59a5962e4775bf96484bba64c5322422b555a40d).
