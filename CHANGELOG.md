# Change Log

## v0.11.0 - 2021-07-10

This version marks a complete re-write of the Markdown preview extension, to more fully support the MyST syntax:

- Full rendering of many common directives, including: all core admonitions, `image`, `figure`, `code`, `code-block`, `code-cell`, `list-table`.
- Fixes previous issues with admonition renderings.
- Support for MyST syntax extensions via the `myst.preview.extensions` [configuration setting][vscode-settings]: `amsmath`, `colon_fence`, `deflist`, `dollarmath` (default), `tasklist`

See the README for more details!

Under the hood, the version also marks a large number of changes, to improve the maintenance and documentation of the extension, and to use a number of new external markdown-it plugin libraries, such as [markdown-it-docutils](https://github.com/executablebooks/markdown-it-docutils).

[vscode-settings]: https://code.visualstudio.com/docs/getstarted/settings
