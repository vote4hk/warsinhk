import React from "react"
import SEO from "@/components/templates/SEO"
import App from "@components/App"
import Layout from "@components/templates/Layout"

const HighRiskPage = props => (
  <App locale={props.pageContext.locale}>
    <Layout>
      <SEO title="HighRiskPage" />
      <h1>HighRiskPage</h1>
      <p>TODO</p>
    </Layout>
  </App>
)

export default HighRiskPage
