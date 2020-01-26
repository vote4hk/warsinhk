import React from "react"

import SEO from "@components/SEO"
import App from "@components/App"
import Layout from "@components/templates/Layout"

const IndexPage = (props) => {
  return <App locale={props.pageContext.locale}>
    <SEO title="home"></SEO>
    < Layout>
      <h1>Test</h1>
    </Layout >
  </App>
}

export default IndexPage
