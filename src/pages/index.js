import React from "react"
import SEO from "@components/SEO"
import App from "@components/App"
import Layout from "@components/templates/Layout"
import SimpleTabs from "@components/organisms/SimpleTabs"

const IndexPage = props => {
  return (
    <App locale={props.pageContext.locale}>
      <SEO title="home"></SEO>
      <Layout>
        <SimpleTabs
          tabs={[
            {
              title: "港島",
              content: "Buttons of subdistricts",
            },
            {
              title: "九龍",
              content: "Buttons of subdistricts",
            },
            {
              title: "新界",
              content: "Buttons of subdistricts",
            },
          ]}
        />
      </Layout>
    </App>
  )
}

export default IndexPage
