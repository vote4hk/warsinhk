import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Typography } from "@material-ui/core"
import { graphql } from "gatsby"
import NetworkGraph from "@/components/charts/NetworkGraph"
// import _groupBy from "lodash.groupby"
// import { withLanguage } from "@/utils/i18n"

const ChartsPage = ({ data, location }) => {
  const { t } = useTranslation()

  const constructTreeByParentCase = (edges, parent) => {
    return edges
      .filter(({ node }) => node.parent_case === parent)
      .map(({ node }) => {
        // construct the children with recursion
        const children = constructTreeByParentCase(edges, node.case_no)
        // include the parent itself inside the group
        if (children.length > 0) {
          children.push({
            name: `#${node.case_no}`,
            value: 1,
          })
        }
        return {
          name: `#${node.case_no}`,
          value: 1,
          children,
        }
      })
  }

  // const constructTreeByClassification = edges => {
  //   const groupedByClassification = _groupBy(edges, ({ node }) =>
  //     withLanguage(i18n, node, "classification")
  //   )
  //   return Object.keys(groupedByClassification).map(classification => ({
  //     name: classification,
  //     children: constructTreeByParentCase(
  //       groupedByClassification[classification], '-'
  //     ),
  //   }))
  // }

  const getDataForChart = edges => {
    return {
      name: "confirmed_cases",
      children: [
        {
          name: t("relation_chart.key_local"),
          children: constructTreeByParentCase(
            edges.filter(({ node }) => node.classification !== "imported"),
            "-"
          ),
        },
        {
          name: t("relation_chart.key_imported"),
          children: constructTreeByParentCase(
            edges.filter(({ node }) => node.classification === "imported"),
            "-"
          ),
        },
      ],
    }
  }

  console.log(getDataForChart(data.allWarsCase.edges))
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
