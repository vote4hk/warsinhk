import _get from "lodash.get"
import { removePathTrailingSlash } from "@/utils/urlHelper"

export const withLanguage = (
  i18n,
  object,
  path,
  checkPendingTranslation = false
) => {
  if (
    checkPendingTranslation &&
    i18n.language === "en" &&
    _get(object, `${path}_zh`) &&
    !_get(object, `${path}_en`)
  ) {
    // Add prefix for untranslated text
    return `[Pending Translation] ${_get(object, `${path}_zh`)}`
  }

  return (
    _get(object, `${path}_${i18n.language}`) || _get(object, `${path}_zh`) || ""
  )
}

export const withLanguagePendingTranslation = (i18n, object, path) => {
  if (_get(object, `${path}_zh`) && !_get(object, `${path}_zh`)) {
    return `[Pending Translation] ${_get(object, `${path}_${i18n.language}`)}`
  }
  return (
    _get(object, `${path}_${i18n.language}`) || _get(object, `${path}_zh`) || ""
  )
}

export const getLocalizedPath = (i18n, path) => {
  return removePathTrailingSlash(i18n.language === "en" ? `/en${path}` : path)
}
