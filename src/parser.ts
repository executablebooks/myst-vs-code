import * as MarkdownIt from 'markdown-it'
import Token = require('markdown-it/lib/token')  // eslint-disable-line

export function toTokens(input: string) {
    const md = new MarkdownIt()
    const env = {}
    return md.parse(input, env)
}

export function makeEnclosure(original: Token) {
    const openToken = new Token('admonition_open', 'div', original.nesting)
    openToken.meta = {'directive': original.info}  // TODO splitline into name and attributes (seperate func)
    openToken.map = original.map
    openToken.info = original.info
    openToken.block = true
    const closeToken = new Token('admonition_close', 'div', original.nesting)
    closeToken.block = true
    openToken.meta = {'directive': original.info}
    return { openToken, closeToken }
}


export function expandAdmonitions(tokens: Token[], match: RegExp) {
    let changed = true
    while (changed) {
        changed = false
        const newTokens: Token[] = []
        for (let index = 0; index < tokens.length; index++) {
            const token = tokens[index]
            if ((token.type === 'fence') && (token.info.match(match))) {
                changed = true
                const nestedTokens = toTokens(token.content)
                const { openToken, closeToken } = makeEnclosure(token)
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
