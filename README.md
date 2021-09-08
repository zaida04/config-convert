# `config-convert`  

[![GitHub](https://img.shields.io/github/license/zaida04/config-convert)](https://github.com/zaida04/config-convert/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/config-convert?color=crimson&logo=npm)](https://www.npmjs.com/package/config-convert)
[![CI workflows](https://github.com/zaida04/config-convert/actions/workflows/ci.yml/badge.svg)](https://github.com/zaida04/config-convert/actions/workflows/ci.yml)

🚀 Need to convert a JS config file to JSON or vice-versa? Are you also very lazy and want a tool to do this for you? Welcome to config-convert.

## 📥 Installation
You can install this package from [NPM](https://www.npmjs.com/package/config-convert)
- `npm install -g config-convert`  
- `yarn global add config-convert`

## ⚡ Usage
```
config-convert -f <input_file>

Options:
  -f, --file     Path to the file to convert.                [string] [required]
  -t, --to       What format to convert to               [choices: "js", "json"]
  -o, --output   The name of the output file.                           [string]
      --es6      For converting to JS, whether to use es6 exports.     [boolean]
  -b, --baseDir  Set the base dir of where to start a path.             [string]
```
### Examples
Say we have a directory that looks like this:
```
your-project/
├─ .eslintrc.js
├─ src/
├─ package.json
```
You have your `.eslintrc.js` file that you want to convert to `.eslintrc.json`.   
Simply run `config-convert -f .eslintrc.js` and voila! Converted and written to a `.eslintrc.json` file! 

## ✋ Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please ensure any and all commits pass our tests, linting, and build steps
  
## ⚖️ LICENSE
Licensed under the [MIT License](https://github.com/zaida04/config-convert/blob/main/LICENSE)
  
