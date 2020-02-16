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

  const getDataForChart = (cases, relations) => {
    const groupedByClassification = _groupBy(
      cases.filter(({ node }) => node.classification !== "imported"),
      ({ node }) => withLanguage(i18n, node, "classification")
    )

    const groupMap = {}
    const groupSizeMap = {}
    relations.forEach(({ node }) => {
      const group = withLanguage(i18n, node, "group")
      groupMap[node.from_case_no] = group
      groupMap[node.to_case_no] = group
      groupSizeMap[group] = (groupSizeMap[group] || 0) + 1
    })

    return {
      nodes: [
        ...cases.map(({ node }) => ({
          id: node.case_no,
          name: `#${node.case_no}`,
          level: 3,
          group: groupMap[node.case_no],
          groupSize: groupSizeMap[groupMap[node.case_no]] || 1,
          size: 20,
        })),
        ...Object.keys(groupedByClassification).map(classification => ({
          id: classification,
          name: classification,
          level: 2,
          groupSize: 1,
          size: 20,
        })),
        {
          id: "local",
          name: t("relation_chart.key_local"),
          level: 1,
          groupSize: 1,
          size: 25,
        },
        {
          id: "imported",
          name: t("relation_chart.key_imported"),
          level: 1,
          groupSize: 1,
          size: 30,
        },
      ],
      // Prepare the links
      links: [
        // Get classification first
        // ...Object.keys(groupedByClassification).map(classification => ({
        //   source: "local",
        //   target: classification,
        //   strength: 0.09,
        //   type: "dotted",
        //   distance: 500,
        // })),
        ...relations.map(({ node }) => ({
          source: node.from_case_no,
          target: node.to_case_no,
          relationships: withLanguage(i18n, node, "relationship").split("/"),
          strength: 0.05,
          distance: Math.max(
            200 / (groupSizeMap[withLanguage(i18n, node, "group")] || 1),
            50
          ),
        })),
        ...cases
          // only case with no group has link to big circle
          .filter(({ node }) => !groupMap[node.case_no])
          .map(({ node }) => ({
            source:
              node.classification === "imported"
                ? "imported"
                : withLanguage(i18n, node, "classification"),
            type: "dotted",
            target: node.case_no,
            strength: node.classification === "imported" ? 0.05 : 0.1,
          })),
      ],
    }
  }

  return (
    <Layout noPadding={true}>
      <SEO title="Charts" />
      <Typography variant="h2">{t("charts.title")}</Typography>
      <NetworkGraph
        data={getDataForChart(
          data.allWarsCase.edges,
          data.allWarsCaseRelation.edges
        )}
      />
    </Layout>
  )
}

export default ChartsPage

export const ChartsQuery = graphql`
  query {
    allWarsCase(sort: { order: DESC, fields: case_no }) {
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
        }
      }
    }
    allWarsCaseRelation {
      edges {
        node {
          from_case_no
          to_case_no
          relationship_zh
          relationship_en
          group_zh
          group_en
        }
      }
    }
  }
`
