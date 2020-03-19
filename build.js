// @ts-check

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const plist = require('plist');
const jinja = require('nunjucks');

const buildGrammar = () => {
    let template_yaml = fs.readFileSync(path.join(__dirname, 'template/myst.tmLanguage.j2.yaml'), "utf8");
    let language_yaml = fs.readFileSync(path.join(__dirname, 'template/languages.yaml'), "utf8");
    let directive_yaml = fs.readFileSync(path.join(__dirname, 'template/directives.yaml'), "utf8");

    // read variables
    const languages = yaml.safeLoad(language_yaml);
    const directives = yaml.safeLoad(directive_yaml);

    // inject variables
    const input_yaml = jinja.renderString(template_yaml, { admonition_classes: directives['admonition_classes'], code_classes: directives['code_classes'], languages: languages  }).toString();

    // dump to plist
    const grammar = yaml.safeLoad(input_yaml);
    const plist_string = plist.build(grammar);
    fs.writeFileSync(path.join(__dirname, 'syntaxes', 'myst.tmLanguage'), plist_string);
};

buildGrammar();