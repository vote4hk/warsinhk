/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react"
import "@/i18n"
import I18nWrapper from "@/components/I18nWrapper"
import RootLayout from "@/components/templates/RootLayout"

export const wrapPageElement = ({ element, props }) => {
  return (
    <I18nWrapper path={props.uri} locale={props.pageContext.locale}>
      {element}
    </I18nWrapper>
  )
}

// Wrap the theme
export const wrapRootElement = ({ element }) => {
  console.log(`
  -----------------------------
  COVID-19 in HK｜武漢肺炎民間資訊
  -----------------------------

  We are waiting for your commit :)
  
  GitHub Repo:
  https://github.com/vote4hk/warsinhk
  
  `)

  return <RootLayout>{element}</RootLayout>
}
