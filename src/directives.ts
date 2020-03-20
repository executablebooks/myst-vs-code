'use strict'
import * as vscode from 'vscode'
import * as yaml from 'js-yaml'

const dirRegexp = new RegExp('.*[`]{3,}\\{')  // TODO check not backslash escapes
const dirStartRegexp = new RegExp('\\{[a-zA-Z0-9\\-]+\\}')
// Since these completions never change, we can store a global copy, on first load, to improve efficiency
let dirDict: null | any = null


export function loadDirDict() {
  if (dirDict !== null) {
    return dirDict
  }
  dirDict = getDirectives()
  return dirDict
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
      dirDict = loadDirDict()
      const completions: vscode.CompletionItem[] = []
      for (const name in dirDict) {
        directiveCompletion(name, dirDict[name], completions)
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
    dirDict = loadDirDict()
    if (!(text in dirDict)) {
      return new Promise((resolve) => resolve())
    }
    const data = dirDict[text]
    const mkdown = makeDescription(data, true)
    const hover = new vscode.Hover(mkdown, range)
    return new Promise((resolve) => resolve(hover))
  }
}


export function getDirectives(): any {
  const data = yaml.safeLoad(`
  acks:
    description: Directive for a list of names.
    has_content: true
    klass: sphinx.directives.other.Acks
    name: acks
    optional_arguments: 0
    options: {}
    required_arguments: 0
  admonition:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.admonitions.Admonition
    name: admonition
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 1
  attention:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.admonitions.Attention
    name: attention
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  bibliography:
    description: |
        Class for processing the bibliography directive.
        Parses the bibliography files, and produces a bibliography node.
    has_content: false
    klass: sphinxcontrib.bibtex.directives.BibliographyDirective
    name: bibliography
    optional_arguments: 0
    options:
      all: flag
      cited: flag
      encoding: encoding
      enumtype: unchanged
      filter: unchanged
      keyprefix: unchanged
      labelprefix: unchanged
      list: unchanged
      notcited: flag
      start: process_start_option
      style: unchanged
    required_arguments: 1
  caution:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.admonitions.Caution
    name: caution
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  centered:
    description: Directive to create a centered line of bold text.
    has_content: false
    klass: sphinx.directives.other.Centered
    name: centered
    optional_arguments: 0
    options: {}
    required_arguments: 1
  class:
    description: 'Set a "class" attribute on the directive content or the next element.
      When applied to the next element, a "pending" element is inserted, and a
      transform does the work later.'
    has_content: true
    klass: docutils.parsers.rst.directives.misc.Class
    name: class
    optional_arguments: 0
    options: {}
    required_arguments: 1
  code:
    description: Parse and mark up content of a code block.
    has_content: true
    klass: sphinx.directives.patches.Code
    name: code
    optional_arguments: 1
    options:
      class: class_option
      force: flag
      name: unchanged
      number-lines: optional_int
    required_arguments: 0
  code-block:
    description: 'Directive for a code block with special highlighting or line numbering settings.'
    has_content: true
    klass: sphinx.directives.code.CodeBlock
    name: code-block
    optional_arguments: 1
    options:
      caption: unchanged_required
      class: class_option
      dedent: int
      emphasize-lines: unchanged_required
      force: flag
      lineno-start: int
      linenos: flag
      name: unchanged
    required_arguments: 0
  code-cell:
    name: code-cell
    description: |
      This is a special directive cell, used by [MyST-NB](https://myst-nb.readthedocs.io) notebooks,
      converted by [jupytext](https://jupytext.readthedocs.io/en/latest/formats.html#myst-markdown)
      The optional argument should be the syntax highlighting language.
    required_arguments: 0
    optional_arguments: 1
    has_content: true
    klass: CodeCell
    options: any
  codeauthor:
    description: 'Directive to give the name of the author of the current document
      or section. Shown in the output only if the show_authors option is on.'
    has_content: false
    klass: sphinx.directives.other.Author
    name: codeauthor
    optional_arguments: 0
    options: {}
    required_arguments: 1
  compound:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.body.Compound
    name: compound
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  container:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.body.Container
    name: container
    optional_arguments: 1
    options:
      name: unchanged
    required_arguments: 0
  contents:
    description: 'Table of contents.
      The table of contents is generated in two passes: initial parse and
      transform.  During the initial parse, a ''pending'' element is generated
      which acts as a placeholder, storing the TOC title and any options
      internally.  At a later stage in the processing, the ''pending'' element is
      replaced by a ''topic'' element, a title and the table of contents proper.'
    has_content: false
    klass: docutils.parsers.rst.directives.parts.Contents
    name: contents
    optional_arguments: 1
    options:
      backlinks: backlinks
      class: class_option
      depth: nonnegative_int
      local: flag
    required_arguments: 0
  cssclass:
    description: 'Set a "class" attribute on the directive content or the next element.
      When applied to the next element, a "pending" element is inserted, and a
      transform does the work later.'
    has_content: true
    klass: docutils.parsers.rst.directives.misc.Class
    name: cssclass
    optional_arguments: 0
    options: {}
    required_arguments: 1
  csv-table:
    description: 'The csv-table directive which sets source and line information to its caption.'
    has_content: true
    klass: sphinx.directives.patches.CSVTable
    name: csv-table
    optional_arguments: 1
    options:
      align: align
      class: class_option
      delim: single_char_or_whitespace_or_unicode
      encoding: encoding
      escape: single_char_or_unicode
      file: path
      header: unchanged
      header-rows: nonnegative_int
      keepspace: flag
      name: unchanged
      quote: single_char_or_unicode
      stub-columns: nonnegative_int
      url: uri
      width: length_or_percentage_or_unitless
      widths: auto_or_other
    required_arguments: 0
  danger:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.admonitions.Danger
    name: danger
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  date:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.misc.Date
    name: date
    optional_arguments: 0
    options: {}
    required_arguments: 0
  default-domain:
    description: Directive to (re-)set the default domain for this source file.
    has_content: false
    klass: sphinx.directives.DefaultDomain
    name: default-domain
    optional_arguments: 0
    options: {}
    required_arguments: 1
  default-role:
    description: Set the default interpreted text role.  Overridden from docutils.
    has_content: false
    klass: sphinx.directives.DefaultRole
    name: default-role
    optional_arguments: 1
    options: {}
    required_arguments: 0
  deprecated:
    description: Directive to describe a change/addition/deprecation in a specific version.
    has_content: true
    klass: sphinx.domains.changeset.VersionChange
    name: deprecated
    optional_arguments: 1
    options: {}
    required_arguments: 1
  describe:
    description: 'Directive to describe a class, function or similar object.  Not used
      directly, but subclassed (in domain-specific directives) to add custom
      behavior.'
    has_content: true
    klass: sphinx.directives.ObjectDescription
    name: describe
    optional_arguments: 0
    options:
      noindex: flag
    required_arguments: 1
  epigraph:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.body.Epigraph
    name: epigraph
    optional_arguments: 0
    options: {}
    required_arguments: 0
  error:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.admonitions.Error
    name: error
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  figure:
    description: 'The figure directive which applies :name: option to the figure node
      instead of the image node.'
    has_content: true
    klass: sphinx.directives.patches.Figure
    name: figure
    optional_arguments: 0
    options:
      align: align
      alt: unchanged
      class: class_option
      figclass: class_option
      figwidth: figwidth_value
      height: length_or_unitless
      name: unchanged
      scale: percentage
      target: unchanged_required
      width: length_or_percentage_or_unitless
    required_arguments: 1
  footer:
    description: Contents of document footer.
    has_content: true
    klass: docutils.parsers.rst.directives.parts.Footer
    name: footer
    optional_arguments: 0
    options: {}
    required_arguments: 0
  header:
    description: Contents of document header.
    has_content: true
    klass: docutils.parsers.rst.directives.parts.Header
    name: header
    optional_arguments: 0
    options: {}
    required_arguments: 0
  highlight:
    description: 'Directive to set the highlighting language for code blocks, as well
      as the threshold for line numbers.'
    has_content: false
    klass: sphinx.directives.code.Highlight
    name: highlight
    optional_arguments: 0
    options:
      force: flag
      linenothreshold: positive_int
    required_arguments: 1
  highlightlang:
    description: highlightlang directive (deprecated)
    has_content: false
    klass: sphinx.directives.code.HighlightLang
    name: highlightlang
    optional_arguments: 0
    options:
      force: flag
      linenothreshold: positive_int
    required_arguments: 1
  highlights:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.body.Highlights
    name: highlights
    optional_arguments: 0
    options: {}
    required_arguments: 0
  hint:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.admonitions.Hint
    name: hint
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  hlist:
    description: Directive for a list that gets compacted horizontally.
    has_content: true
    klass: sphinx.directives.other.HList
    name: hlist
    optional_arguments: 0
    options:
      columns: int
    required_arguments: 0
  image:
    description: ''
    has_content: false
    klass: docutils.parsers.rst.directives.images.Image
    name: image
    optional_arguments: 0
    options:
      align: align
      alt: unchanged
      class: class_option
      height: length_or_unitless
      name: unchanged
      scale: percentage
      target: unchanged_required
      width: length_or_percentage_or_unitless
    required_arguments: 1
  important:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.admonitions.Important
    name: important
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  include:
    description: 'Like the standard "Include" directive, but interprets absolute paths
      "correctly", i.e. relative to source directory.'
    has_content: false
    klass: sphinx.directives.other.Include
    name: include
    optional_arguments: 0
    options:
      class: class_option
      code: unchanged
      encoding: encoding
      end-before: unchanged_required
      end-line: int
      literal: flag
      name: unchanged
      number-lines: unchanged
      start-after: unchanged_required
      start-line: int
      tab-width: int
    required_arguments: 1
  index:
    description: Directive to add entries to the index.
    has_content: false
    klass: sphinx.directives.other.Index
    name: index
    optional_arguments: 0
    options: {}
    required_arguments: 1
  line-block:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.body.LineBlock
    name: line-block
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  list-table:
    description: 'The list-table directive which sets source and line information to
      its caption.'
    has_content: true
    klass: sphinx.directives.patches.ListTable
    name: list-table
    optional_arguments: 1
    options:
      align: align
      class: class_option
      header-rows: nonnegative_int
      name: unchanged
      stub-columns: nonnegative_int
      width: length_or_percentage_or_unitless
      widths: auto_or_other
    required_arguments: 0
  literalinclude:
    description: 'Like {include} literal, but only warns if the include file
      is not found, and does not raise errors. Also has several options for
      selecting what to include.'
    has_content: false
    klass: sphinx.directives.code.LiteralInclude
    name: literalinclude
    optional_arguments: 0
    options:
      append: unchanged_required
      caption: unchanged
      class: class_option
      dedent: int
      diff: unchanged_required
      emphasize-lines: unchanged_required
      encoding: encoding
      end-at: unchanged_required
      end-before: unchanged_required
      force: flag
      language: unchanged_required
      lineno-match: flag
      lineno-start: int
      linenos: flag
      lines: unchanged_required
      name: unchanged
      prepend: unchanged_required
      pyobject: unchanged_required
      start-after: unchanged_required
      start-at: unchanged_required
      tab-width: int
    required_arguments: 1
  math:
    description: |
        A base class for Sphinx directives.
        This class provides helper methods for Sphinx directives.
    has_content: true
    klass: sphinx.directives.patches.MathDirective
    name: math
    optional_arguments: 1
    options:
      class: class_option
      label: unchanged
      name: unchanged
      nowrap: flag
    required_arguments: 0
  meta:
    description: |
        A base class for Sphinx directives.
        This class provides helper methods for Sphinx directives.
    has_content: true
    klass: sphinx.directives.patches.Meta
    name: meta
    optional_arguments: 0
    options: {}
    required_arguments: 0
  moduleauthor:
    description: 'Directive to give the name of the author of the current document
      or section. Shown in the output only if the show_authors option is on.'
    has_content: false
    klass: sphinx.directives.other.Author
    name: moduleauthor
    optional_arguments: 0
    options: {}
    required_arguments: 1
  note:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.admonitions.Note
    name: note
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  object:
    description: 'Directive to describe a class, function or similar object.  Not used
      directly, but subclassed (in domain-specific directives) to add custom
      behavior.'
    has_content: true
    klass: sphinx.directives.ObjectDescription
    name: object
    optional_arguments: 0
    options:
      noindex: flag
    required_arguments: 1
  only:
    description: Directive to only include text if the given tag(s) are enabled.
    has_content: true
    klass: sphinx.directives.other.Only
    name: only
    optional_arguments: 0
    options: {}
    required_arguments: 1
  parsed-literal:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.body.ParsedLiteral
    name: parsed-literal
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  pull-quote:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.body.PullQuote
    name: pull-quote
    optional_arguments: 0
    options: {}
    required_arguments: 0
  raw:
    description: 'Pass through content unchanged
      Content is included in output based on type argument
      Content may be included inline (content section of directive) or
      imported from a file or url.'
    has_content: true
    klass: docutils.parsers.rst.directives.misc.Raw
    name: raw
    optional_arguments: 0
    options:
      encoding: encoding
      file: path
      url: uri
    required_arguments: 1
  raw-cell:
    name: raw-cell
    description: |
      This is a special directive cell, used by [MyST-NB](https://myst-nb.readthedocs.io) notebooks,
      converted by [jupytext](https://jupytext.readthedocs.io/en/latest/formats.html#myst-markdown)
    required_arguments: 0
    optional_arguments: 0
    has_content: true
    klass: RawCell
    options: any
  replace:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.misc.Replace
    name: replace
    optional_arguments: 0
    options: {}
    required_arguments: 0
  restructuredtext-test-directive:
    description: This directive is useful only for testing purposes.
    has_content: true
    klass: docutils.parsers.rst.directives.misc.TestDirective
    name: restructuredtext-test-directive
    optional_arguments: 1
    options:
      option: unchanged_required
    required_arguments: 0
  role:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.misc.Role
    name: role
    optional_arguments: 0
    options: {}
    required_arguments: 0
  rst-class:
    description: |
        Set a "class" attribute on the directive content or the next element.
        When applied to the next element, a "pending" element is inserted, and a
        transform does the work later.
    has_content: true
    klass: docutils.parsers.rst.directives.misc.Class
    name: rst-class
    optional_arguments: 0
    options: {}
    required_arguments: 1
  rubric:
    description: ''
    has_content: false
    klass: docutils.parsers.rst.directives.body.Rubric
    name: rubric
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 1
  sectionauthor:
    description: |
        Directive to give the name of the author of the current document
        or section. Shown in the output only if the show_authors option is on.
    has_content: false
    klass: sphinx.directives.other.Author
    name: sectionauthor
    optional_arguments: 0
    options: {}
    required_arguments: 1
  sectnum:
    description: Automatic section numbering.
    has_content: false
    klass: docutils.parsers.rst.directives.parts.Sectnum
    name: sectnum
    optional_arguments: 0
    options:
      depth: int
      prefix: unchanged_required
      start: int
      suffix: unchanged_required
    required_arguments: 0
  seealso:
    description: An admonition mentioning things to look at as reference.
    has_content: true
    klass: sphinx.directives.other.SeeAlso
    name: seealso
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  sidebar:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.body.Sidebar
    name: sidebar
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
      subtitle: unchanged_required
    required_arguments: 1
  sourcecode:
    description: 'Directive for a code block with special highlighting or line numbering
      settings.'
    has_content: true
    klass: sphinx.directives.code.CodeBlock
    name: sourcecode
    optional_arguments: 1
    options:
      caption: unchanged_required
      class: class_option
      dedent: int
      emphasize-lines: unchanged_required
      force: flag
      lineno-start: int
      linenos: flag
      name: unchanged
    required_arguments: 0
  table:
    description: 'The table directive which sets source and line information to its caption.'
    has_content: true
    klass: sphinx.directives.patches.RSTTable
    name: table
    optional_arguments: 1
    options:
      align: align
      class: class_option
      name: unchanged
      width: length_or_percentage_or_unitless
      widths: auto_or_other
    required_arguments: 0
  tabularcolumns:
    description: Directive to give an explicit tabulary column definition to LaTeX.
    has_content: false
    klass: sphinx.directives.other.TabularColumns
    name: tabularcolumns
    optional_arguments: 0
    options: {}
    required_arguments: 1
  target-notes:
    description: Target footnote generation.
    has_content: false
    klass: docutils.parsers.rst.directives.references.TargetNotes
    name: target-notes
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  tip:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.admonitions.Tip
    name: tip
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0
  title:
    description: ''
    has_content: false
    klass: docutils.parsers.rst.directives.misc.Title
    name: title
    optional_arguments: 0
    options: {}
    required_arguments: 1
  toctree:
    description: 'Directive to notify Sphinx about the hierarchical structure of the
      docs, and to include a table-of-contents like tree in the current document.'
    has_content: true
    klass: sphinx.directives.other.TocTree
    name: toctree
    optional_arguments: 0
    options:
      caption: unchanged_required
      glob: flag
      hidden: flag
      includehidden: flag
      maxdepth: int
      name: unchanged
      numbered: int_or_nothing
      reversed: flag
      titlesonly: flag
    required_arguments: 0
  topic:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.body.Topic
    name: topic
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 1
  unicode:
    description: Convert Unicode character codes (numbers) to characters.
    has_content: false
    klass: docutils.parsers.rst.directives.misc.Unicode
    name: unicode
    optional_arguments: 0
    options:
      ltrim: flag
      rtrim: flag
      trim: flag
    required_arguments: 1
  versionadded:
    description: Directive to describe a change/addition/deprecation in a specific version.
    has_content: true
    klass: sphinx.domains.changeset.VersionChange
    name: versionadded
    optional_arguments: 1
    options: {}
    required_arguments: 1
  versionchanged:
    description: Directive to describe a change/addition/deprecation in a specific version.
    has_content: true
    klass: sphinx.domains.changeset.VersionChange
    name: versionchanged
    optional_arguments: 1
    options: {}
    required_arguments: 1
  warning:
    description: ''
    has_content: true
    klass: docutils.parsers.rst.directives.admonitions.Warning
    name: warning
    optional_arguments: 0
    options:
      class: class_option
      name: unchanged
    required_arguments: 0  
    `)
  return data
}
