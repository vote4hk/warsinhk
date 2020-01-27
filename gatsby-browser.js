/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from "react"
import "@/i18n"
import I18nWrapper from "@/components/I18nWrapper"
import { ContextStoreProvider } from "@/contextStore"
import { ThemeProvider } from "@material-ui/core/styles/"
import theme from "@/ui/theme"
import { ResetStyle, GlobalStyle } from "@components/globalStyle"

export const wrapPageElement = ({ element, props }) => {
  return (
    <>
      <I18nWrapper locale={props.pageContext.locale}>{element}</I18nWrapper>
    </>
  )
}

// Wrap the theme
export const wrapRootElement = ({ element }) => {
  return (
    <>
      <ContextStoreProvider>
        <ResetStyle />
        <GlobalStyle />
        <ThemeProvider theme={theme}>{element}</ThemeProvider>
      </ContextStoreProvider>
    </>
  )
}
