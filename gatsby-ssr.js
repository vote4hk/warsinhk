/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React from "react"
import "@/i18n"
import I18nWrapper from "@/components/I18nWrapper"
import RootLayout from "@/components/templates/RootLayout"

export const wrapPageElement = ({ element, props }) => {
  // remove the trailing slash
  const fullPath =
    props.location.pathname !== "/"
      ? props.location.pathname.replace(/\/$/, "")
      : "/"
  const path = fullPath.replace(`/en/`, "/")
  return (
    <>
      <RootLayout
        initialStore={{
          route: {
            path,
            fullPath,
          },
        }}
      >
        <I18nWrapper locale={props.pageContext.locale} ssr={true}>
          {element}
        </I18nWrapper>
      </RootLayout>
    </>
  )
}
