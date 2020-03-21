import * as MarkdownIt from 'markdown-it'
import Token = require('markdown-it/lib/token')  // eslint-disable-line

export function toTokens(input: string) {
    const md = new MarkdownIt()
    const env = {}
    return md.parse(input, env)
}


function makeEnclosure(original: Token, name: string, attributes: string) {
    const openToken = new Token('admonition_open', 'div', original.nesting)
    openToken.meta = { name, attributes }
    openToken.attrSet('class', `admonition ${name}`)
    openToken.map = original.map
    openToken.info = original.info
    openToken.block = true
    const closeToken = new Token('admonition_close', 'div', original.nesting)
    closeToken.meta = { name, attributes }
    closeToken.block = true
    return { openToken, closeToken }
}


export function expandAdmonitions(tokens: Token[], regex: RegExp) {
    let changed = true
    while (changed) {
        changed = false
        const newTokens: Token[] = []
        for (let index = 0; index < tokens.length; index++) {
            const token = tokens[index]
            const match = token.info.match(regex)
            if ((token.type === 'fence') && (match !== null)) {
                changed = true
                // TODO parse inital yaml block (of present)
                const nestedTokens = toTokens(token.content)
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
