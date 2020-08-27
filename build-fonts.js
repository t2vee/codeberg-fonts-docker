const child_process = require('child_process')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const url = require('url')

const util = require('./util')

const BUILD_DIR = "./built_fonts"
const BUILDSCRIPT_DIR = "./font_buildscripts"
const DOWNLOAD_DIR = "./downloaded_fonts"


async function buildFont(fontKey, font) {
  console.log("\nBuilding font " + font.displayName)

  const downloadPath = fontDownloadPath(font)
  const outputDir = `${BUILD_DIR}/${fontKey}`

  console.log("Preparing output directory...")
  await fs.promises.mkdir(outputDir)

  try {
    console.log("Extracting font...")
    if (font.releaseUrl.endsWith('.zip')) {
      child_process.execSync(`unzip ${downloadPath} -d ${outputDir}`)
    }
    else {
      console.error("Unsupported archive format")
    }
    console.log("Extraction finished")

    const buildscriptPath = `${BUILDSCRIPT_DIR}/${fontKey}.sh`
    if (fs.existsSync(buildscriptPath)) {
      console.log("Running build script " + buildscriptPath + " in " + outputDir)
      child_process.execSync(`bash ${path.resolve(buildscriptPath)}`, { cwd: outputDir, stdio: 'inherit' })
    }
    else {
      console.info("No build script exists for this font")
    }
  }
  catch (e) {
    console.error("Fatal error: " + e)
    process.exit(-1)
  }
}

async function buildFonts(fonts) {
  for (fontKey of Object.keys(fonts)) {
    await buildFont(fontKey, fonts[fontKey])
  }
}

async function downloadFile(url, targetPath) {
  console.log("Downloading " + url + " to " + targetPath)
  child_process.execSync(`wget ${url} -O ${targetPath}`, { stdio: 'inherit' })
}

async function downloadFont(font) {
  console.log("\nDownload - processing font " + font.displayName)

  if ('draft' in font && font.draft) {
    console.log("Skipping draft")
    return
  }

  const downloadPath = fontDownloadPath(font)

  if (fs.existsSync(downloadPath)) {
    console.log("File already exists. Checking hash.")
    if (await fileSHA256(downloadPath) === font.releaseSHA256) {
      console.log("Hash matches, no need to download")
      return;
    }
    else {
      console.log("Hash mismatch - Redownloading")
    }
  }

  await downloadFile(font.releaseUrl, downloadPath)

  const hash = await fileSHA256(downloadPath)
  if (hash !== font.releaseSHA256) {
    console.error("SHA256 hash of font " + font.displayName + " does not match expected hash from the font's yaml file")
    console.log("Expected: " + font.releaseSHA256)
    console.log("Got: " + hash)
    process.exit(-1)
  }
}

async function downloadFonts(fonts) {
  for (fontKey of Object.keys(fonts)) {
    await downloadFont(fonts[fontKey]) //TODO: Find out if it's acceptable to run this concurrently
  }
}

async function fileSHA256(path) {
  const contents = await fs.promises.readFile(path)

  const hash = crypto.createHash('sha256')
  hash.update(contents)

  return hash.digest('hex')
}

function fontDownloadPath(font) {
  return `${DOWNLOAD_DIR}/${fontFilename(font)}`
}

function fontFilename(font) {
  return path.basename(url.parse(font.releaseUrl).pathname)
}

async function prepareDirectories() {
  if (!fs.existsSync(DOWNLOAD_DIR))
    await fs.promises.mkdir(DOWNLOAD_DIR)
  if (fs.existsSync(BUILD_DIR))
    await fs.promises.rmdir(BUILD_DIR, { recursive: true })
  await fs.promises.mkdir(BUILD_DIR)
}




util.asyncMain(async () => {
  const fonts = util.filterOutDrafts(await util.collectFonts())

  await prepareDirectories()
  await downloadFonts(fonts)
  await buildFonts(fonts)

  console.log("\ndone")
})
