import * as MarkdownIt from "markdown-it"
import { Rule } from "markdown-it"
import Token = require("markdown-it/lib/token") // eslint-disable-line

/**
 * Create a block tokenizer function, with an instantiated MarkdownIt instance
 */
export function makeToTokens(md: MarkdownIt, env: any = {}) {
  function toTokens(input: string, startLine: number | null = null) {
    const tokens: Token[] = []
    // TODO I think ideally we would use md.block.tokenize, to directly set startLine
    // however, it is not specified on the type
    // for possible fix: https://github.com/Microsoft/TypeScript/issues/2076
    md.block.parse(input, md, env, tokens)
    if (startLine !== null) {
      for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index]
        if (token.map !== null) {
          token.map = [token.map[0] + startLine, token.map[1] + startLine]
        }
      }
    }
    return tokens
  }
  return toTokens
}

/**
 * make open/close tokens for an admonition
 * @param original the fenced code block that is being expanded
 * @param name the name of the directive
 * @param attributes the sting after the directive declaration
 */
function makeEnclosure(original: Token, name: string, attributes: string) {
  const openToken = new Token("admonition_open", "div", original.nesting)
  const dirType = "admonitions"
  openToken.meta = { name, attributes, dirType }
  openToken.attrSet("class", `admonition ${name}`)
  openToken.map = original.map
  openToken.info = original.info
  openToken.block = true
  const closeToken = new Token("admonition_close", "/div", original.nesting)
  closeToken.meta = { name, attributes }
  closeToken.block = true
  return { openToken, closeToken }
}

/**
 * Find fenced code blocks that relate to admonitions and expand them
 * @param tokens the list of block tokens
 * @param regex the regex to match the string after the triple tick, shoud match groups (name, attributes)
 * @param toTokens the function for running nested parses
 */
export function expandAdmonitions(tokens: Token[], regex: RegExp, toTokens: Function) {
  let changed = true
  while (changed) {
    changed = false
    const newTokens: Token[] = []
    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index]
      const match = token.info.match(regex)
      if (token.type === "fence" && match !== null) {
        changed = true
        // TODO extract inital yaml block (if present)
        const nestedTokens = toTokens(token.content, token.map[0])
        const { openToken, closeToken } = makeEnclosure(token, match[1], match[2])
        newTokens.push(openToken)
        newTokens.push(...nestedTokens)
        newTokens.push(closeToken)
      } else {
        newTokens.push(token)
      }
    }
    tokens = newTokens
  }
  return tokens
}

/**
 * Find fenced code blocks that relate to code directives and 'fix' their language
 * @param tokens the list of block tokens
 * @param regex the regex to match the string after the triple tick, should match groups (name, attributes)
 * @param toTokens the function for running nested parses
 */
export function fixCodeCells(tokens: Token[], regex: RegExp) {
  const newTokens: Token[] = []
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    const match = token.info.match(regex)
    if (token.type === "fence" && match !== null) {
      const name = match[1]
      // TODO could have aliases, like ipython3 -> ipython
      const attributes = match[2]
      const dirType = "code"
      token.meta = { name, attributes, dirType }
      token.attrSet("class", `directive-${name}`)
      token.info = attributes
      // TODO extract inital yaml block (if present)
      // TODO wrap in div (for CSS access)?
      newTokens.push(token)
    } else {
      newTokens.push(token)
    }
  }
  return tokens
}

export function markitPlugin(md: MarkdownIt) {
  // can we initialise/access vscode configuration from here?

  /// this plugin expands nested admonitions
  const ruleAdmonitions: Rule = state => {
    const toTokens = makeToTokens(md, state.env)
    // TODO make the admonitions variable
    state.tokens = expandAdmonitions(
      state.tokens,
      /^\{(attention|caution|danger|error|important|hint|note|seealso|tip|warning)\}\s*(.*)/,
      toTokens
    )
  }
  /// this plugin fixes the language of code directives
  const ruleCodeCells: Rule = state => {
    // TODO make the directive names variable
    state.tokens = fixCodeCells(state.tokens, /^\{(code|code-block|code-cell)\}\s*(.*)/)
  }
  md.core.ruler.after("block", "expandAdmonitions", ruleAdmonitions)
  md.core.ruler.after("block", "fixCodeCells", ruleCodeCells)
}
