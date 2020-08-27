const yaml = require("js-yaml")

const util = require("./util")

module.exports = function(eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", data => yaml.safeLoad(data))

  eleventyConfig.addPassthroughCopy("assets")
  eleventyConfig.addPassthroughCopy({ "built_fonts": "dist" })

  eleventyConfig.addFilter("noDrafts", util.filterOutDrafts)

  return {
    dir: {
      input: "content"
    }
  }
}
