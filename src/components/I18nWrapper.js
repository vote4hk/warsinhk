import React, { useEffect } from "react"
import PropTypes from "prop-types"
import "@/i18n"
import { useTranslation } from "react-i18next"

const App = props => {
  const { children, locale, ssr } = props
  const { i18n } = useTranslation()
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [i18n, locale])

  // since ssr does not have useEffect.
  // a little bit hacky but welcome for a better solution
  if (ssr && i18n.language !== locale) {
    i18n.changeLanguage(locale)
  }

  return <>{children}</>
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.string.isRequired,
}

export default App
