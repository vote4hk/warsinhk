import React, { useEffect } from "react"
import PropTypes from "prop-types"
import "@/i18n"
import { useTranslation } from "react-i18next"

const App = props => {
  const { children, locale } = props
  const { i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(locale)
  }, [i18n, locale])

  console.log(`
  --------------------------------------
  Fight for freedom, Stand from MO HONG!
  --------------------------------------

  We are waiting for your commit :)
  
  GitHub Repo:
  https://github.com/nandiheath/warsinhk

  Telegram:
  https://t.me/joinchat/BwXunhP9xMWBmopAFrvD8A
  `)
  return <>{children}</>
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.string.isRequired,
}

export default App
