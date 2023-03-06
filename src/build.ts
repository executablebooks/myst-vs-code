import * as fs from "fs"
import * as path from "path"

import { readSnippets } from "./readTemplates"

const buildSnippets = () => {
  const outputJSON = readSnippets(true)
  fs.writeFileSync(path.join(__dirname, "../snippets", "directives.json"), outputJSON)
}

buildSnippets()
