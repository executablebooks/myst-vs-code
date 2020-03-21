'use strict'
import * as vscode from 'vscode'
import * as yaml from 'js-yaml'
import * as dirDict from './data/directives.json'

const dirRegexp = new RegExp('.*[`]{3,}\\{')  // TODO check not backslash escapes
const dirStartRegexp = new RegExp('\\{[a-zA-Z0-9\\-]+\\}')


export function getDirectiveData(name: string) {
  const dict: {[key: string]: any} = dirDict
  return dict[name]
}

export class CompletionItemProvider implements vscode.CompletionItemProvider {

  public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken) {

    const { line, character } = position
    if (character < 3) {
      return []
    }
    const textLine = document.lineAt(line)
    const startLine = textLine.text.slice(undefined, character)
    if (dirRegexp.test(startLine)) {
      const completions: vscode.CompletionItem[] = []
      const dict: {[key: string]: any} = dirDict
      for (const name in dirDict) {
        directiveCompletion(name, dict[name], completions)
      }
      return completions
    }
    return []
  }
}


export function makeDescription(data: any, addClass: boolean = false) {
  const opts = yaml.safeDump({
    'Required Args': data['required_arguments'],
    'Optional Args': data['optional_arguments'],
    'Has Content': data['has_content'],
    'Options': data['options']
  })
  let string = ''
  if (addClass) {
    string = '`' + data['klass'] + '`\n\n'
  }
  string = string + data['description']
  const mdown = new vscode.MarkdownString(string)
  mdown.appendCodeblock(opts, 'yaml')
  return mdown
}


export function directiveCompletion(name: string, data: any, completions: vscode.CompletionItem[]) {
  const completion = new vscode.CompletionItem(name, vscode.CompletionItemKind.Class)
  completion.detail = data['klass']
  completion.documentation = makeDescription(data)
  // completion.insertText = new vscode.SnippetString()
  completions.push(completion)
}

export class HoverProvider implements vscode.HoverProvider {

  public provideHover(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken): Promise<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position, dirStartRegexp)
    if (range === undefined) {
      return new Promise((resolve) => resolve())
    }
    const textLine = document.lineAt(range.start)
    const startLine = textLine.text.slice(undefined, range.start.character)
    if (!(startLine.endsWith('```'))) {
      return new Promise((resolve) => resolve())
    }
    // TODO check for backslash escapes
    let text = document.getText(range)
    text = text.slice(1, -1)
    if (!(text in dirDict)) {
      return new Promise((resolve) => resolve())
    }
    const data = getDirectiveData(text)
    const mkdown = makeDescription(data, true)
    const hover = new vscode.Hover(mkdown, range)
    return new Promise((resolve) => resolve(hover))
  }
}
