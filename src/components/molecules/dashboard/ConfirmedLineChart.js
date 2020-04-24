import React from "react"
import { useTranslation } from "react-i18next"
import { useStaticQuery, graphql } from "gatsby"
import SimpleLineChart from "@/components/charts/SimpleLineChart"
import Typography from "@material-ui/core/Typography"
import { withLanguage } from "@/utils/i18n"
import _get from "lodash.get"

export default props => {
  const data = useStaticQuery(
    graphql`
      query {
        dailyFigures: allWarsLatestFiguresOverride(
          sort: { order: DESC, fields: date }
          filter: { date: { gt: "2020-01-20" } }
          skip: 0
        ) {
          edges {
            node {
              date(formatString: "M.DD")
              confirmed
              discharged
              investigating
              death
              reported
            }
          }
        }
        allSiteConfig(
          filter: {
            key: { in: ["isolation_beds.helmet", "isolation_beds.count"] }
          }
        ) {
          edges {
            node {
              key
              value_zh
              value_en
            }
          }
        }
      }
    `
  )
  const { i18n, t } = useTranslation()

  const getDataForChart = ({ node }) => {
    const data = {
      ...node,
    }
    Object.keys(data).forEach(key => {
      if (!isNaN(parseInt(data[key], 0))) {
        data[key] = parseInt(data[key], 0)
      }
    })
    return {
      ...data,
      hospitalised: data.confirmed - data.discharged,
    }
  }

  const isolationBedCount = _get(
    data.allSiteConfig.edges.find(
      ({ node }) => node.key === "isolation_beds.count"
    ),
    "node.value_zh",
    "0"
  )
  const isolationText = withLanguage(
    i18n,
    _get(
      data.allSiteConfig.edges.find(
        ({ node }) => node.key === "isolation_beds.helmet"
      ),
      "node",
      {}
    ),
    "value"
  )
  return (
    <>
      <Typography variant="body2">*{isolationText}</Typography>
      <SimpleLineChart
        data={{
          showLegend: false,
          xaxis: data.dailyFigures.edges.map(({ node }) => node.date).reverse(),
          fields: ["hospitalised"],
          horizontalLines: [
            {
              color: "#ff574f",
              "stroke-dasharray": "5, 2",
              legend: `${t("cases.isolation_bed")}${isolationBedCount}`,
              value: isolationBedCount,
            },
          ],
          datasets: [
            {
              line: {
                legend: t("cases.status_hospitalised"),
                color: "#ff574f",
                // 'stroke-dasharray': '5, 2',
              },
              data: data.dailyFigures.edges.map(getDataForChart).reverse(),
            },
          ],
        }}
      />
    </>
  )
}
