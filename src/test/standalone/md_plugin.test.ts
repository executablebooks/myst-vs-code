
'use strict'
import * as assert from 'assert'
// import * as fs from 'fs'
// import * as path from 'path'
import { toTokensBasic, expandAdmonitions, fixCodeCells } from '../../md_it_plugin'


suite('Parse Tests', () => {

    test('Parse tokens', () => {
        const tokens = toTokensBasic('```{code} dsf\ncontent\n```')
        assert.equal(tokens.length, 1)
    })

    test('Expand admonitions', () => {
        let tokens = toTokensBasic('`````{note}\n````{tip}\n```python\ncontent\n```\n````\na\n`````')
        tokens = expandAdmonitions(tokens, /^\{(note|tip)\}\s*(.*)/)
        const types = tokens.map((t) => t.type)
        assert.deepEqual(types, [
            'admonition_open',
            'admonition_open',
            'fence',
            'admonition_close',
            'paragraph_open',
            'inline',
            'paragraph_close',
            'admonition_close'])
    })

    test('fix Code Cell language', () => {
        let tokens = toTokensBasic('```{code} python\ncontent\n```')
        tokens = fixCodeCells(tokens, /^\{(code)\}\s*(.*)/)
        assert.equal(tokens.length, 1)
        assert.equal(tokens[0].info, 'python')
    })

})
