'use strict'
import * as assert from 'assert'
import * as vscode from 'vscode'

import * as completion from '../../directives'


suite('Completions Tests', () => {

    test('Make description', () => {
        const directive = completion.getDirectiveData('note')
        const text = completion.makeDescription(directive['note'], true)
        assert.equal(text.value.includes('.Note'), true)
    })

    test('Create completion', () => {
        const data = {'klass': 'class', 'required_arguments': 1, 'optional_arguments': 0, 'has_content': true, 'options': {}}
        const completions: vscode.CompletionItem[] = []
        completion.directiveCompletion('acks', data, completions)
        assert.equal(completions.length, 1)
    })

})
