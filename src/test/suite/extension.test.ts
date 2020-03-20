'use strict'
import * as assert from 'assert'
import * as vscode from 'vscode'

import * as completion from '../../completion'


suite('Completions Tests', () => {

    test('Read directives', () => {
        const dirs = completion.getDirectives()
        assert.equal(dirs['acks']['name'], 'acks')
    })

    test('Create completion', () => {
        const data = {'klass': 'class', 'required_arguments': 1, 'optional_arguments': 0, 'has_content': true, 'options': {}}
        const completions: vscode.CompletionItem[] = []
        completion.directiveCompletion('acks', data, completions)
        assert.equal(completions.length, 1)
    })

})
