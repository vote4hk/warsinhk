import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"

const NotFoundPage = props => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
)

export default NotFoundPage
