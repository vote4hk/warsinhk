import _ from "lodash"

export const withLanguage = (i18n, object, path) => {
  return (
    _.get(object, `${path}_${i18n.language}`) ||
    _.get(object, `${path}_zh`) ||
    ""
  )
}

export const getLocalizedPath = (i18n, path) => {
  return i18n.language === "en" ? `/en${path}` : path
}
