from pathlib import Path
import json
import yaml

IN_PATH = Path(__file__).parent.joinpath("dir.template.yaml")
OUT_PATH = Path(__file__).parent.joinpath("directives.json")

if __name__ == "__main__":

    final_data = {}

    dir_data = yaml.safe_load(IN_PATH.read_text())

    for name, data in dir_data.items():
        if data is None:
            final_data[f"directive-{name}"] = {
                "description": f"a {name} directive",
                "prefix": [f"directive-{name}"],
                "body": [f"``${{1:`}}{{{name}}}", "${0:content}", "``${1:`}", ""],
            }
            continue
        dname = data.get("name", None) or name
        content = data.get("content", None) or "content"
        arguments = data.get("arguments", None)
        options = data.get("options", None)

        if arguments:
            body = [f"``${{1:`}}{{{dname}}} ${{2:{arguments}}}"]
        else:
            body = [f"``${{1:`}}{{{dname}}}"]

        if options:
            lines = yaml.safe_dump(options).splitlines()
            if any(l.startswith(" ") for l in lines):
                body += ["---"] + lines + ["---", ""]
            else:
                body += [f":{l}" for l in lines] + [""]

        body.append(f"${{0:{content}}}")
        body.append("``${1:`}")
        body.append("")

        final_data[f"directive-{name}"] = {
            "description": f"a {name} directive",
            "prefix": [f"directive-{name}"],
            "body": body,
        }

    OUT_PATH.write_text(json.dumps(final_data, indent=2))
