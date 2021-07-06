import * as path from 'path'

import { runTests } from 'vscode-test'

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, '../../../')

        // The path to the extension test runner script
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './integration/index')

        // Download VS Code, unzip it and run the integration test
        await runTests({ extensionDevelopmentPath, extensionTestsPath, version: '1.55.2' })
    } catch (err) {
        console.error(err)
        console.error('Failed to run tests')
        process.exit(1)
    }
}

main()
