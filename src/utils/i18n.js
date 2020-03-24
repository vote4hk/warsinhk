import _get from "lodash.get"
import { removePathTrailingSlash } from "@/utils/urlHelper"

export const withLanguage = (i18n, object, path) => {
  return (
    _get(object, `${path}_${i18n.language}`) || _get(object, `${path}_zh`) || ""
  )
}

export const getLocalizedPath = (i18n, path) => {
  return removePathTrailingSlash(i18n.language === "en" ? `/en${path}` : path)
}
