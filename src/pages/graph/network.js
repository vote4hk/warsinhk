import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Typography } from "@material-ui/core"
import { graphql } from "gatsby"
import NetworkGraph from "@/components/charts/NetworkGraph"
import _groupBy from "lodash.groupby"
import { withLanguage } from "@/utils/i18n"

const ChartsPage = ({ data, location }) => {
  const { t, i18n } = useTranslation()

  const getDataForChart = edges => {
    const groupedByClassification = _groupBy(
      edges.filter(({ node }) => node.classification !== "imported"),
      ({ node }) => withLanguage(i18n, node, "classification")
    )

    const parentMap = {}
    edges.forEach(({ node }) => {
      parentMap[node.parent_case] = (parentMap[node.parent_case] || 0) + 1
    })

    return {
      nodes: [
        ...edges.map(({ node }) => ({
          id: node.case_no,
          name: `#${node.case_no}`,
          level: 3 + (parentMap[node.case_no] || 0),
        })),
        ...Object.keys(groupedByClassification).map(classification => ({
          id: classification,
          name: classification,
          level: 2,
        })),
        {
          id: "local",
          name: t("relation_chart.key_local"),
          level: 1,
        },
        {
          id: "imported",
          name: t("relation_chart.key_imported"),
          level: 1,
        },
        // {
        //   id: "confirmed",
        //   name: t("relation_chart.key_confirmed"),
        // }
      ],
      // Prepare the links
      links: [
        // Get classification first
        ...Object.keys(groupedByClassification).map(classification => ({
          source: "local",
          target: classification,
          strength: 0.09,
        })),
        ...edges.map(({ node }) => ({
          source:
            node.parent_case !== "-"
              ? node.parent_case
              : node.classification === "imported"
              ? "imported"
              : withLanguage(i18n, node, "classification"),
          target: node.case_no,
          strength: node.classification === "imported" ? 0.05 : 0.05,
        })),
      ],
    }
  }

  return (
    <Layout noPadding={true}>
      <SEO title="Charts" />
      <Typography variant="h2">{t("charts.title")}</Typography>
      <NetworkGraph data={getDataForChart(data.allWarsCase.edges)} />
    </Layout>
  )
}

export default ChartsPage

export const ChartsQuery = graphql`
  query {
    allWarsCase(
      sort: { order: DESC, fields: case_no }
      filter: { enabled: { eq: "Y" } }
    ) {
      edges {
        node {
          case_no
          onset_date
          confirmation_date
          gender
          age
          hospital_zh
          hospital_en
          status
          status_zh
          status_en
          type_zh
          type_en
          citizenship_zh
          citizenship_en
          detail_zh
          detail_en
          classification
          classification_zh
          classification_en
          source_url
          parent_case
        }
      }
    }
  }
`
