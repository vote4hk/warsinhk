import React from "react"
import { MuiThemeProvider } from "@material-ui/core/styles/"
import { ThemeProvider } from "styled-components"
import { createThemeWithFontZoom } from "@/ui/theme"
import { ResetStyle, GlobalStyle } from "@components/globalStyle"
import ContextStore, { ContextStoreProvider } from "@/contextStore"

const ThemeProviderWrapper = ({ children }) => {
  const {
    pageOptions: { state },
  } = React.useContext(ContextStore)

  const theme = React.useMemo(() => createThemeWithFontZoom(state.fontZoom), [
    state.fontZoom,
  ])

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MuiThemeProvider>
  )
}

export default ({ children, initialStore }) => {
  return (
    <>
      <ResetStyle />
      <GlobalStyle />
      {/* TODO: should stick to single theme provider? */}
      <ContextStoreProvider initialStore={initialStore}>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </ContextStoreProvider>
    </>
  )
}
