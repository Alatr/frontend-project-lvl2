### Hexlet tests and linter status:
[![Actions Status](https://github.com/Alatr/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/Alatr/frontend-project-lvl2/actions)
[![Node CI](https://github.com/Alatr/frontend-project-lvl2/workflows/Node%20CI/badge.svg)](https://github.com/Alatr/frontend-project-lvl2/actions?query=workflow%3A%22Node+CI%22)
[![Maintainability](https://api.codeclimate.com/v1/badges/02a65054e8a4b3e2275b/maintainability)](https://codeclimate.com/github/Alatr/frontend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/02a65054e8a4b3e2275b/test_coverage)](https://codeclimate.com/github/Alatr/frontend-project-lvl2/test_coverage)

# Difference calculator

CLI compares two configuration files and shows a difference.

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

###### asciinema help
[![asciicast](https://asciinema.org/a/inHEOcggog4o8jdnayuWQJqVS.svg)](https://asciinema.org/a/inHEOcggog4o8jdnayuWQJqVS)

## Arguments and options


Angled brackets (e.g. ```<required>```) indicate required command-arguments. Square brackets (e.g. ```[optional]```) indicate optional command-arguments.

```gendiff [options] <filepath1> <filepath2>```


## Support for different file formats for comparison. YML and JSON


```
Example call:
  $ gendiff file.json file2.yml
```
###### asciinema different file formats
[![asciicast](https://asciinema.org/a/inHEOcggog4o8jdnayuWQJqVS.svg)](https://asciinema.org/a/inHEOcggog4o8jdnayuWQJqVS)

## Output format

** CLI supports 3 type formats **
<!-- toc -->
- [Stulih](#stulih-type)
- [Plain](#plain-type)
- [AST json](#json-type)

### Output stulish format
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
###### asciinema output stylish format
[![asciicast](https://asciinema.org/a/inHEOcggog4o8jdnayuWQJqVS.svg)](https://asciinema.org/a/inHEOcggog4o8jdnayuWQJqVS)
### Output plain format
for plain format you need to specify a flag

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
###### asciinema output plain format
[![asciicast](https://asciinema.org/a/inHEOcggog4o8jdnayuWQJqVS.svg)](https://asciinema.org/a/inHEOcggog4o8jdnayuWQJqVS)
### Output json format
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
###### asciinema output json format
[![asciicast](https://asciinema.org/a/inHEOcggog4o8jdnayuWQJqVS.svg)](https://asciinema.org/a/inHEOcggog4o8jdnayuWQJqVS)
```





