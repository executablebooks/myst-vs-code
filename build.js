// @ts-check

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import * as plist from 'plist'
import * as jinja from 'nunjucks'

const buildGrammar = () => {
    const templateYaml = fs.readFileSync(path.join(__dirname, 'template/myst.tmLanguage.j2.yaml'), 'utf8')
    const languageYaml = fs.readFileSync(path.join(__dirname, 'template/languages.yaml'), 'utf8')
    const directiveYaml = fs.readFileSync(path.join(__dirname, 'template/directives.yaml'), 'utf8')

    // read variables
    const languages = yaml.safeLoad(languageYaml)
    const directives = yaml.safeLoad(directiveYaml)

    // inject variables
    // eslint-disable-next-line @typescript-eslint/camelcase
    const inputYaml = jinja.renderString(templateYaml, { admonition_classes: directives['admonition_classes'], code_classes: directives['code_classes'], languages }).toString()

    // dump to plist
    const grammar = yaml.safeLoad(inputYaml)
    const plistString = plist.build(grammar)
    fs.writeFileSync(path.join(__dirname, 'syntaxes', 'myst.tmLanguage'), plistString)
}

buildGrammar()
