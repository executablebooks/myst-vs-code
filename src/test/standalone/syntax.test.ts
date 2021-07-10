"use strict"
import * as assert from "assert"
import * as fs from "fs"
import MarkdownIt from "markdown-it"
import * as path from "path"
import { colonFencePlugin, mystBlockPlugin } from "../../mdPlugins"

suite("Syntax Fixtures: MyST Blocks", () => {
  const fixtures = fs
    .readFileSync(
      path.join(__dirname, "../../../test_static/syntax-fixtures", "myst_block.md"),
      "utf8"
    )
    .replace(/\r\n|\n\r|\n|\r/g, "\n")
  const mdit = MarkdownIt("commonmark").use(mystBlockPlugin)
  fixtures
    .split(/\n\.\n\n/)
    .map(s => s.split(/\n\.\n/))
    .forEach(([name, text, expected]) => {
      test(name, () => {
        const rendered = mdit.render(text)
        assert.equal(rendered.trim(), expected.trim())
      })
    })
})

suite("Syntax Fixtures: Colon Fence", () => {
  const fixtures = fs
    .readFileSync(
      path.join(__dirname, "../../../test_static/syntax-fixtures", "colon_fence.md"),
      "utf8"
    )
    .replace(/\r\n|\n\r|\n|\r/g, "\n")
  const mdit = MarkdownIt("commonmark").use(colonFencePlugin)
  fixtures
    .split(/\n\.\n\n/)
    .map(s => s.split(/\n\.\n/))
    .forEach(([name, text, expected]) => {
      test(name, () => {
        const rendered = mdit.render(text)
        assert.equal(rendered.trim(), expected.trim())
      })
    })
})
