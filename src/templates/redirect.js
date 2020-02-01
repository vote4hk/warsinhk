import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { navigate } from "gatsby"

// This is a template for generating redirect page
export default ({ pageContext }) => {
  const { uri, redirectURL } = pageContext
  React.useEffect(() => {
    navigate(redirectURL)
  })
  return (
    <Layout hideAlerts={true}>
      <SEO uri={uri} />
    </Layout>
  )
}
