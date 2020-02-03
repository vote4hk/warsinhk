import React from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import { WarsCaseCard } from "@components/organisms/CaseCard"

const ConfirmedCasePage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()

  data.allWarsCase.edges.sort(
    (a, b) => parseInt(b.node.case_no) - parseInt(a.node.case_no)
  )

  return (
    <Layout>
      <SEO title="ConfirmedCasePage" />
      <Typography variant="h4">{t("cases.title")}</Typography>
      {data.allWarsCase.edges.map(item => (
        <WarsCaseCard node={item.node} i18n={i18n} t={t} />
      ))}
    </Layout>
  )
}

export default ConfirmedCasePage

export const ConfirmedCaseQuery = graphql`
  query {
    allWarsCase(
      sort: { order: DESC, fields: case_no }
      filter: { enabled: { eq: "Y" } }
    ) {
      edges {
        node {
          case_no
          confirmation_date
          gender
          age
          hospital_zh
          hospital_en
          status_zh
          status_en
          type_zh
          type_en
          citizenship_zh
          citizenship_en
          detail_zh
          detail_en
          source_url
        }
      }
    }
  }
`
