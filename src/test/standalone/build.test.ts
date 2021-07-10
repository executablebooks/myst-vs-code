"use strict"
import * as assert from "assert"
import * as fs from "fs"
import MarkdownIt from "markdown-it"
import * as path from "path"
import { mystBlockPlugin } from "../../mdPlugins"
import { readGrammar, readSnippets } from "../../readTemplates"

function sanitize(fileString: string) {
  fileString = fileString.replace("\\r\\n", "\n")
  fileString = fileString.replace("\\r", "\n")
  return fileString
}

suite("Build Tests", () => {
  test("Build directives", () => {
    const expected = fs.readFileSync(
      path.join(__dirname, "../../../syntaxes", "myst.tmLanguage"),
      "utf8"
    )
    const plistString = readGrammar(true) as string
    assert.equal(sanitize(plistString), sanitize(expected))
  })

  test("Build snippets", () => {
    const expected = fs.readFileSync(
      path.join(__dirname, "../../../snippets", "directives.json"),
      "utf8"
    )
    const jsonString = readSnippets(true)
    assert.equal(sanitize(jsonString as string), sanitize(expected))
  })
})

suite("Syntax Fixtures: MyST Blocks", () => {
  const fixtures = fs.readFileSync(
    path.join(__dirname, "../../../test_static/syntax-fixtures", "myst_block.md"),
    "utf8"
  )
  const mdit = MarkdownIt("commonmark").use(mystBlockPlugin)
  fixtures
    .split("\n.\n\n")
    .map(s => s.split("\n.\n"))
    .forEach(([name, text, expected]) => {
      test(name, () => {
        const rendered = mdit.render(text)
        assert.equal(rendered.trim(), expected.trim())
      })
    })
})
