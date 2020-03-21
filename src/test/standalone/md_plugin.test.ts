
'use strict'
import * as assert from 'assert'
import { makeToTokens, expandAdmonitions, fixCodeCells } from '../../md_it_plugin'
import * as MarkdownIt from 'markdown-it'


suite('Parse Tests', () => {

    test('Parse tokens', () => {
        const toTokens = makeToTokens(new MarkdownIt())
        const tokens = toTokens('```{code} dsf\ncontent\n```')
        assert.equal(tokens.length, 1)
    })

    test('Expand admonitions', () => {
        const toTokens = makeToTokens(new MarkdownIt())
        let tokens = toTokens(
            '`````{note}\n\n\n````{tip}\n```python\ncontent\n```\na\n````\nb\n`````'
        )
        tokens = expandAdmonitions(tokens, /^\{(note|tip)\}\s*(.*)/, toTokens)
        const types = tokens.map((t) => t.type)
        assert.deepEqual(types, [
            'admonition_open',
            'admonition_open',
            'fence',
            'paragraph_open',
            'inline',
            'paragraph_close',
            'admonition_close',
            'paragraph_open',
            'inline',
            'paragraph_close',
            'admonition_close'])
        const positions = tokens.map((t) => t.map)
        assert.deepEqual(positions, [
            [0, 11],
            [2, 8],
            [2, 5],
            [5, 6],
            [5, 6],
            null,
            null,
            [8, 9],
            [8, 9],
            null,
            null])
    })

    test('fix Code Cell language', () => {
        const toTokens = makeToTokens(new MarkdownIt())
        let tokens = toTokens('```{code} python\ncontent\n```')
        tokens = fixCodeCells(tokens, /^\{(code)\}\s*(.*)/)
        assert.equal(tokens.length, 1)
        assert.equal(tokens[0].info, 'python')
    })

})
