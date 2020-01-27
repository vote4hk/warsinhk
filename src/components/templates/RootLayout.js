import React from "react"
import { MuiThemeProvider } from "@material-ui/core/styles/"
import { ThemeProvider } from "styled-components"
import theme from "@/ui/theme"
import { ResetStyle, GlobalStyle } from "@components/globalStyle"

export default ({ children }) => {
  console.log(theme)
  return (
    <>
      <ResetStyle />
      <GlobalStyle />
      {/* TODO: should stick to single theme provider? */}
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </MuiThemeProvider>
    </>
  )
}
