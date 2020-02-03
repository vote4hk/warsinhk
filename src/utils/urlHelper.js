/**
 * No import syntax as this is needed for gatsby-node.js (dont want to setup babel lol)
 */

const getPath = (lang, path) => `${lang === "zh" ? "" : `/${lang}`}${path}`

const getWarTipPath = (lang, title) => {
  const slug = title.replace(/[^a-zA-Z0-9_\u3400-\u9FBF\s-]/g, "")
  return getPath(lang, `/wars-tips/${slug}/`)
}

module.exports = {
  getPath,
  getWarTipPath,
}
