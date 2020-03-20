
//  *---------------------------------------------------------------------------------------------
//  *  Copyright (c) Microsoft Corporation. All rights reserved.
//  *  Licensed under the MIT License. See License.txt in the project root for license information.
//  *--------------------------------------------------------------------------------------------*/
// @ts-check
// Note https://www.npmjs.com/package/vscode-tmgrammar-test does a similar thing to this, however, it cannot handle grammar injections
'use strict'

import * as assert from 'assert'
import { commands, Uri } from 'vscode'
import { join, basename, dirname } from 'path'
import * as fs from 'fs'


function assertUnchangedTokens(testFixurePath: string, done: MochaDone) {
    const fileName = basename(testFixurePath)

    return commands.executeCommand('_workbench.captureSyntaxTokens', Uri.file(testFixurePath)).then((data: any) => {
        try {
            const resultsFolderPath = join(dirname(dirname(testFixurePath)), 'colorize-results')
            if (!fs.existsSync(resultsFolderPath)) {
                fs.mkdirSync(resultsFolderPath)
            }
            const resultPath = join(resultsFolderPath, fileName.replace('.', '_') + '.json')
            if (fs.existsSync(resultPath)) {
                const previousData = JSON.parse(fs.readFileSync(resultPath).toString())
                try {
                    assert.deepEqual(data, previousData)
                } catch (e) {
                    // TODO use global variable to set whether we regenerate or not?
                    fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'), { flag: 'w' })
                    if (Array.isArray(data) && Array.isArray(previousData) && data.length === previousData.length) {
                        for (let i = 0; i < data.length; i++) {
                            const d = data[i]
                            const p = previousData[i]
                            if (d.c !== p.c || hasThemeChange(d.r, p.r)) {
                                throw e
                            }
                        }
                        // different but no tokenization of color change: no failure
                    } else {
                        throw e
                    }
                }
            } else {
                fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'))
            }
            done()
        } catch (e) {
            done(e)
        }
    }, done)
}

function hasThemeChange(d: { [key: string]: any }, p: { [key: string]: any }) {
    const keys = Object.keys(d)
    for (const key of keys) {
        if (d[key] !== p[key]) {
            return true
        }
    }
    return false
}

suite('colorization', () => {
    // ensure the extension is activated, so the grammar is injected
    commands.executeCommand('myst.Activate').then((_data: any) => {
        // We place the test files in this lower level FoldingRange, so that when this file is compiled to out/test/,
        // it still finds them
        const extensionColorizeFixturePath = join(__dirname, '../../../test_static/colorize-fixtures')
        if (fs.existsSync(extensionColorizeFixturePath)) {
            // pause to allow extension to load?
            const fixturesFiles = fs.readdirSync(extensionColorizeFixturePath)
            fixturesFiles.forEach(fixturesFile => {
                // define a test for each fixture
                test(fixturesFile, (done) => {
                    assertUnchangedTokens(join(extensionColorizeFixturePath, fixturesFile), done)
                })
            })
        }
    })
})
