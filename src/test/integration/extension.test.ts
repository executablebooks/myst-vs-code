'use strict'
import * as assert from 'assert'
import * as vscode from 'vscode'

import * as completion from '../../directives'


suite('Completions Tests', () => {

    test('Read directives', () => {
        const dirs = completion.getDirectives()
        assert.equal(dirs['acks']['name'], 'acks')
    })

    test('Make description', () => {
        const dirs = completion.getDirectives()
        const text = completion.makeDescription(dirs['note'], true)
        assert.equal(text.value.includes('.Note'), true)
    })

    test('Create completion', () => {
        const data = {'klass': 'class', 'required_arguments': 1, 'optional_arguments': 0, 'has_content': true, 'options': {}}
        const completions: vscode.CompletionItem[] = []
        completion.directiveCompletion('acks', data, completions)
        assert.equal(completions.length, 1)
    })

})
