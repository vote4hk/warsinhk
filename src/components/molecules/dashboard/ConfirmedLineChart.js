import React from "react"
import { useTranslation } from "react-i18next"
import { useStaticQuery, graphql } from "gatsby"
import SimpleLineChart from "@/components/charts/SimpleLineChart"

export default props => {
  const data = useStaticQuery(
    graphql`
      query {
        allBotWarsLatestFigures(
          sort: { order: DESC, fields: date }
          filter: { date: { gt: "2020-01-20" } }
          skip: 0
        ) {
          edges {
            node {
              date(formatString: "MM-DD")
              confirmed
              discharged
              investigating
              death
              reported
            }
          }
        }
      }
    `
  )
  const { t } = useTranslation()

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
  return (
    <>
      <SimpleLineChart
        data={{
          showLegend: false,
          xaxis: data.allBotWarsLatestFigures.edges
            .map(({ node }) => node.date)
            .reverse(),
          fields: ["hospitalised"],
          horizontalLines: [
            {
              color: "#ff574f",
              "stroke-dasharray": "5, 2",
              legend: t("cases.isolation_bed"),
              value: 954,
            },
          ],
          datasets: [
            {
              line: {
                legend: t("cases.status_hospitalised"),
                color: "#ff574f",
                // 'stroke-dasharray': '5, 2',
              },
              data: data.allBotWarsLatestFigures.edges
                .map(getDataForChart)
                .reverse(),
            },
          ],
        }}
      />
    </>
  )
}
