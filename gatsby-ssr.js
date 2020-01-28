/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React, { useEffect } from "react"
import "@/i18n"
import I18nWrapper from "@/components/I18nWrapper"
import RootLayout from "@/components/templates/RootLayout"
import ContextStore from "@/contextStore"
import { ROUTE_CHANGE } from "@/reducers/route"

// update the route
const Router = ({ path }) => {
  // some shit when useStaticQuery here..
  const {
    route: { dispatch },
  } = React.useContext(ContextStore)
  let actualPath = path
  // TODO: dynamic langauges from somewhere?
  actualPath = actualPath.replace(`/en/`, "/")

  useEffect(() => {
    dispatch({ type: ROUTE_CHANGE, path: actualPath })
  }, [actualPath, dispatch])
  return null
}

export const wrapPageElement = ({ element, props }) => {
  return (
    <>
      <Router path={props.uri}></Router>
      <I18nWrapper locale={props.pageContext.locale}>{element}</I18nWrapper>
    </>
  )
}

// Wrap the theme
export const wrapRootElement = ({ element }) => {
  return <RootLayout>{element}</RootLayout>
}
