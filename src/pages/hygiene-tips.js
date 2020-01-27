import React from "react"
import SEO from "@/components/templates/SEO"
import App from "@components/App"
import Layout from "@components/templates/Layout"

const HygieneTipsPage = props => (
  <App locale={props.pageContext.locale}>
    <Layout>
      <SEO title="HygieneTipsPage" />
      <h1>HygieneTipsPage</h1>
      <p>TODO</p>
    </Layout>
  </App>
)

export default HygieneTipsPage
