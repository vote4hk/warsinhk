/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React, { useEffect } from "react"
import "@/i18n"
import I18nWrapper from "@/components/I18nWrapper"
import RootLayout from "@/components/templates/RootLayout"
import ContextStore from "@/contextStore"
import { ROUTE_CHANGE } from "@/reducers/route"

const Router = ({ path }) => {
  const {
    route: { dispatch },
  } = React.useContext(ContextStore)
  useEffect(() => {
    dispatch({ type: ROUTE_CHANGE, path })
  }, [path, dispatch])
  return null
}

export const wrapPageElement = ({ element, props }) => {
  return (
    <>
      <Router path={props.path}></Router>
      <I18nWrapper locale={props.pageContext.locale}>{element}</I18nWrapper>
    </>
  )
}

// Wrap the theme
export const wrapRootElement = ({ element }) => {
  return <RootLayout>{element}</RootLayout>
}
