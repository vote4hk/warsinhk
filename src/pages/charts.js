import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Typography } from "@material-ui/core"
import { graphql } from "gatsby"
import EpidemicChart from "@/components/charts/StackedBarChart"

const ChartsPage = ({ data, location }) => {
  const { t } = useTranslation()

  return (
    <Layout noPadding={true}>
      <SEO title="Charts" />
      <Typography variant="h2">{t("charts.title")}</Typography>
      <EpidemicChart
        keys={[
          "imported",
          "possibly_local",
          "local",
          "close_contact_of_imported_case",
        ]}
        keyToLabel={key => {
          return t(`epidemic_chart.key_${key}`)
        }}
        data={data.allEpidemicData.edges.map(({ node }) => ({
          label: node.first_symptions_date,
          imported: parseInt(node.imported),
          possibly_local: parseInt(node.possibly_local),
          local: parseInt(node.local),
          close_contact_of_imported_case: parseInt(
            node.close_contact_of_imported_case
          ),
          total: parseInt(node.total),
        }))}
      />
    </Layout>
  )
}

export default ChartsPage

export const ChartsQuery = graphql`
  query {
    allEpidemicData {
      edges {
        node {
          first_symptions_date
          imported
          possibly_local
          local
          close_contact_of_imported_case
          total
        }
      }
    }
  }
`
