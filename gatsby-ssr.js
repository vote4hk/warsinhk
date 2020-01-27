/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React from "react"
import RootLayout from "@/components/templates/RootLayout"

// Wrap the theme
export const wrapRootElement = ({ element }) => {
  return <RootLayout>{element}</RootLayout>
}
