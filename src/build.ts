// @ts-check

import * as fs from 'fs'
import * as path from 'path'

import {readGrammar, readSnippets} from './readTemplates'

const buildGrammar = () => {
    // dump to plist
    const plistString = readGrammar(true)
    fs.writeFileSync(path.join(__dirname, '../syntaxes', 'myst.tmLanguage'), plistString)
}

buildGrammar()

const buildSnippets = () => {
    const outputJSON = readSnippets(true)
    fs.writeFileSync(path.join(__dirname, '../snippets', 'directives.json'), outputJSON)
}

buildSnippets()
