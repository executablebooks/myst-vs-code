from pathlib import Path
import plistlib

import yaml
from jinja2 import Template

IN_PATH = Path(__file__).parent.joinpath("../template/myst.tmLanguage.j2.yaml")
LANGUAGE_PATH = Path(__file__).parent.joinpath("../template/languages.yaml")
DIRECTIVE_PATH = Path(__file__).parent.joinpath("../template/directives.yaml")
OUT_PATH = Path(__file__).parent.joinpath("../syntaxes/myst.tmLanguage")

if __name__ == "__main__":

    # read variables
    directives = yaml.safe_load(DIRECTIVE_PATH.read_text())
    languages = yaml.safe_load(LANGUAGE_PATH.read_text())

    # inject variables
    template_yaml = IN_PATH.read_text()
    template = Template(template_yaml)
    input_yaml = template.render(
        admonition_classes=directives["admonition_classes"],
        code_classes=directives["code_classes"],
        languages=languages,
    )

    # dump to plist
    data = yaml.safe_load(input_yaml)
    plist_string = plistlib.dumps(data, sort_keys=False)
    OUT_PATH.write_bytes(plist_string)
