const fs = require("fs")
const yaml = require("js-yaml")

async function asyncMain(inner) {
  (async () => {
    try {
      inner()
    } catch (e) {
      console.error(e)
    }
  })()
}

async function collectFonts() {
  let result = {}

  const dataPath = "content/_data/fonts"

  const fileNames = await fs.promises.readdir(dataPath)
  for await (const fileName of fileNames) {
    if (!fileName.endsWith('.yaml'))
      continue;

    const fileContents = await fs.promises.readFile(dataPath + "/" + fileName, { encoding: 'utf-8' })
    const fontKey = fileName.substr(0,fileName.length - 5)
    result[fontKey] = yaml.safeLoad(fileContents)
  }

  return result
}

function filterOutDrafts(fonts) {
  return Object.keys(fonts)
    .filter(key => !("draft" in fonts[key]) || !fonts[key]["draft"])
    .reduce((accu,key) => { accu[key] = fonts[key]; return accu }, {})
}

exports.asyncMain = asyncMain
exports.collectFonts = collectFonts
exports.filterOutDrafts = filterOutDrafts