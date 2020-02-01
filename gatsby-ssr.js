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
  const path = props.location.pathname.replace(`/en/`, "/")
  return (
    <>
      <RootLayout
        initialStore={{
          route: {
            path,
            fullPath: props.location.pathname,
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
