import React from "react"
import { MuiThemeProvider } from "@material-ui/core/styles/"
import { ThemeProvider } from "styled-components"
import theme from "@/ui/theme"
import { ResetStyle, GlobalStyle } from "@components/globalStyle"
import { ContextStoreProvider } from "@/contextStore"
export default ({ children, initialStore }) => {
  return (
    <>
      <ResetStyle />
      <GlobalStyle />
      {/* TODO: should stick to single theme provider? */}
      <ContextStoreProvider initialStore={initialStore}>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </MuiThemeProvider>
      </ContextStoreProvider>
    </>
  )
}
