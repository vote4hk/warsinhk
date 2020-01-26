import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { ContextStoreProvider } from '@/contextStore'
import { ThemeProvider } from '@material-ui/core/styles/'
import theme from '@/ui/theme'
import '@/i18n'
import { useTranslation } from 'react-i18next'

const App = (props) => {
  const { children, locale } = props
  const { i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(locale)
  }, [i18n, locale])

  return (<>
    <ContextStoreProvider>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ContextStoreProvider>
  </>)
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.string.isRequired,
}

export default App
