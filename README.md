### Hexlet tests and linter status:
[![Actions Status](https://github.com/Alatr/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/Alatr/frontend-project-lvl2/actions)
[![Node CI](https://github.com/Alatr/frontend-project-lvl2/workflows/Node%20CI/badge.svg)](https://github.com/Alatr/frontend-project-lvl2/actions?query=workflow%3A%22Node+CI%22)
[![Maintainability](https://api.codeclimate.com/v1/badges/02a65054e8a4b3e2275b/maintainability)](https://codeclimate.com/github/Alatr/frontend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/02a65054e8a4b3e2275b/test_coverage)](https://codeclimate.com/github/Alatr/frontend-project-lvl2/test_coverage)

# Gendiff

CLI compares two configuration files and shows a difference. This project can be used as a CLI utility, and as a module

## Install

```
make install
```

## Get help

Yields the following help output:

```

Example call:
  $ gendiff -h

Usage: gendiff [options] <filepath1> <filepath2>

Compares two configuration files and shows a difference.

Options:
  -V, --version        output the version number
  -f, --format [type]  output format (default: "stylish")
  -h, --help           display help for command
```

## Arguments and options

```gendiff [options] <filepath1> <filepath2>```
###### Options format
<!-- toc -->
- --format stylish
- --format plain
- --format json

###### Available file extension
<!-- toc -->
- json
- yml

```
Example call:
  $ gendiff file.json file2.yml
```
###### example with different file extension
[![asciicast](https://asciinema.org/a/6CKwxmigLMFHHqkCJkTZehvr0.svg)](https://asciinema.org/a/6CKwxmigLMFHHqkCJkTZehvr0)


## Output format

#### CLI supports 3 type formats output
<!-- toc -->
- Stylish
- Plain
- AST json

### Stylish format output
Stulish format selected by default.

```
$ gendiff filepath1.json filepath2.json
or
$ gendiff filepath1.json filepath2.json -f stylish

{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}
```
###### example with stylish format output
[![asciicast](https://asciinema.org/a/gKGl8EGQnPk9FqXJFctIVLsZ0.svg)](https://asciinema.org/a/gKGl8EGQnPk9FqXJFctIVLsZ0)
### Plain format output

```
$ gendiff filepath1.json filepath2.json -f plain

Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]
```
###### example with plain format output
[![asciicast](https://asciinema.org/a/qxv58sHY2rKdZ70FEyjriOPc5.svg)](https://asciinema.org/a/qxv58sHY2rKdZ70FEyjriOPc5)
### JSON format output
for json format you need to specify a flag

```
$ gendiff filepath1.json filepath2.json -f json
[
  {
    "name": "group3",
    "value": "complex",
    "status": "added",
    "children": [
      {
        "name": "fee",
        "value": 100500,
        "status": "added"
      },
      {
        "name": "deep",
        "value": "complex",
        "status": "added",
        "children": [
          {
            "name": "id",
            "value": "complex",
            "status": "added",
            "children": [
              {
                "name": "number",
                "value": 45,
                "status": "added"
              }
            ]
          }
        ]
      }
    ]
  }
]
```
###### example with json format output
[![asciicast](https://asciinema.org/a/IK17dS05xYePtyaz9TZPDKMAV.svg)](https://asciinema.org/a/IK17dS05xYePtyaz9TZPDKMAV)