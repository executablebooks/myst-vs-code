'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { CompletionItemProvider, HoverProvider } from './directives'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Activated MyST-Markdown extension')

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('myst.Activate', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Activated MyST-Markdown!')
    })

    context.subscriptions.push(disposable)

    const mdSelector: vscode.DocumentSelector = { scheme: 'file', language: 'markdown' }

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            mdSelector, new CompletionItemProvider(), '{'))
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            mdSelector, new HoverProvider()))

}

// this method is called when your extension is deactivated
export function deactivate() {
}
