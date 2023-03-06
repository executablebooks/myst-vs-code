import * as fs from "fs"
import * as path from "path"
import * as yaml from "js-yaml"

function getDefault(obj: any, name: any, defaultValue: any = null) {
  const value = obj[name]
  if (value === undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return defaultValue
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value
}

export function readSnippets(asJson = false) {
  const snippetsYaml = fs.readFileSync(
    path.join(__dirname, "../snippets/dir.template.yaml"),
    "utf8"
  )
  const snippets = yaml.safeLoad(snippetsYaml) as { [key: string]: any }
  const finalData: { [index: string]: any } = {}
  for (const name in snippets) {
    const data = snippets[name]
    if (data === null || data === undefined) {
      finalData[`directive-${name}`] = {
        description: `a ${name} directive`,
        prefix: [`directive-${name}`],
        body: [`\`\`\${1:\`}{${name}}`, "${0:content}", "``${1:`}", ""]
      }
    } else {
      let dname = getDefault(data, "name", null)
      if (dname === null) {
        dname = name
      }
      const args = getDefault(data, "arguments", null)
      const options = getDefault(data, "options", null)

      let bodyStrings: string[]
      if (args !== null) {
        bodyStrings = [`\`\`\${1:\`}{${dname}} \${2:${args}}`]
      } else {
        bodyStrings = [`\`\`\${1:\`}{${dname}}`]
      }

      if (options !== null) {
        let lines = yaml.safeDump(options).split(/\r?\n/)
        const unnested = (line: string) => {
          return !line.startsWith(" ")
        }
        if (lines.every(unnested)) {
          lines = lines.filter(l => l !== "")
          bodyStrings.push(...lines.map(l => `:${l}`))
          bodyStrings.push("")
        } else {
          bodyStrings.push("---")
          bodyStrings.push(...lines)
          bodyStrings.push("---")
        }
      }

      if (getDefault(data, "content", true) !== false) {
        let content = getDefault(data, "content", null)
        if (content === null) {
          content = "content"
        }
        bodyStrings.push(`\${0:${content}}`)
      }

      bodyStrings.push("``${1:`}")
      bodyStrings.push("")
      finalData[`directive-${name}`] = {
        description: `a ${name} directive`,
        prefix: [`directive-${name}`],
        body: bodyStrings
      }
    }
  }
  if (asJson) {
    return JSON.stringify(finalData, null, 2)
  }
  return finalData
}
