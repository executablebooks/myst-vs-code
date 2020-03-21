// @ts-check

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import * as plist from 'plist'
import * as jinja from 'nunjucks'

const buildGrammar = () => {
    const templateYaml = fs.readFileSync(path.join(__dirname, '../template/myst.tmLanguage.j2.yaml'), 'utf8')
    const languageYaml = fs.readFileSync(path.join(__dirname, '../template/languages.yaml'), 'utf8')
    const directiveYaml = fs.readFileSync(path.join(__dirname, '../template/directives.yaml'), 'utf8')

    // read variables
    const languages = yaml.safeLoad(languageYaml)
    const directives = yaml.safeLoad(directiveYaml)

    // inject variables
    // eslint-disable-next-line @typescript-eslint/camelcase
    const inputYaml = jinja.renderString(templateYaml, { admonition_classes: directives['admonition_classes'], code_classes: directives['code_classes'], languages }).toString()

    // dump to plist
    const grammar = yaml.safeLoad(inputYaml)
    const plistString = plist.build(grammar)
    fs.writeFileSync(path.join(__dirname, '../syntaxes', 'myst.tmLanguage'), plistString)
}

buildGrammar()

function getDefault(obj: any, name: any, defaultValue: any = null) {
    const value = obj[name]
    if (value === undefined) {
        return defaultValue
    }
    return value
}

const buildSnippets = () => {
    const snippetsYaml = fs.readFileSync(path.join(__dirname, '../snippets/dir.template.yaml'), 'utf8')
    const snippets = yaml.safeLoad(snippetsYaml)
    const finalData: { [index: string]: any } = {}
    for (const name in snippets) {
        const data = snippets[name]
        if ((data === null) || (data === undefined)) {
            finalData[`directive-${name}`] = {
                'description': `a ${name} directive`,
                'prefix': [`directive-${name}`],
                'body': [`\`\`\${1:\`}{${name}}`, '${0:content}', '``${1:`}', ''],
            }
        } else {
            let dname = getDefault(data, 'name', null)
            if (dname === null) {
                dname = name
            }
            const args = getDefault(data, 'arguments', null)
            const options = getDefault(data, 'options', null)

            let bodyStrings: string[]
            if (args !== null) {
                bodyStrings = [`\`\`\${1:\`}{${dname}} \${2:${args}}`]
            } else {
                bodyStrings = [`\`\`\${1:\`}{${dname}}`]
            }

            if (options !== null) {
                let lines = yaml.safeDump(options).split(/\r?\n/)
                const unnested = (line: string) => { return !line.startsWith(' ') }
                if (lines.every(unnested)) {
                    lines = lines.filter((l) => l !== '')
                    bodyStrings.push(...lines.map((l) => `:${l}`))
                    bodyStrings.push('')
                } else {
                    bodyStrings.push('---')
                    bodyStrings.push(...lines)
                    bodyStrings.push('---')
                }
            }

            if (getDefault(data, 'content', true) !== false) {
                let content = getDefault(data, 'content', null)
                if (content === null) {
                    content = 'content'
                }
                bodyStrings.push(`\${0:${content}}`)
            }

            bodyStrings.push('``${1:`}')
            bodyStrings.push('')
            finalData[`directive-${name}`] = {
                'description': `a ${name} directive`,
                'prefix': [`directive-${name}`],
                'body': bodyStrings,
            }
        }
    }
    const outputJSON = JSON.stringify(finalData, null, 2)
    fs.writeFileSync(path.join(__dirname, '../snippets', 'directives.json'), outputJSON)
}

buildSnippets()
