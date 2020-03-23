import React from "react"
import { useTranslation } from "react-i18next"
import { useStaticQuery, graphql } from "gatsby"
import EpidemicChart from "@/components/charts/StackedBarChart"
import Typography from "@material-ui/core/Typography"

export default function ConfirmedCaseVisual(props) {
  const { t } = useTranslation()

  const data = useStaticQuery(
    graphql`
      query {
        fullWarsCase: allWarsCase(
          sort: { order: DESC, fields: case_no }
          filter: { enabled: { eq: "Y" } }
        ) {
          edges {
            node {
              case_no
              onset_date
              confirmation_date
              status
              classification
            }
          }
        }
      }
    `
  )

  const listDate = []
  const startDate = "2020-01-18"
  const date1 = new Date(startDate)
  const date2 = new Date()
  const diffTime = Math.abs(date2 - date1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const dateMove = new Date(startDate)
  let d = startDate
  let k = diffDays
  while (k > 0) {
    d = dateMove.toISOString().slice(0, 10)
    listDate.push(d)
    dateMove.setDate(dateMove.getDate() + 1)
    k--
  }

  const transformedInitialData = listDate.reduce((result, d) => {
    result[d] = {
      imported: 0,
      imported_close_contact: 0,
      local_possibly: 0,
      local: 0,
      local_close_contact: 0,
      local_possibly_close_contact: 0,
      label: d,
    }
    return result
  }, {})
  const transformedData = data.fullWarsCase.edges.reduce((result, { node }) => {
    if (
      node.classification !== "-" &&
      (node.onset_date.toLowerCase() !== "asymptomatic" ||
        node.onset_date.toLowerCase() !== "-")
    ) {
      if (result[node.onset_date]) {
        result[node.onset_date][node.classification]++
      }
    }
    return result
  }, transformedInitialData)
  // Remove the latest data if it is 0 (not updated)
  let chartData = Object.values(transformedData)
  let tail = chartData.length - 1
  for (let i = chartData.length - 1; i > 0; i--) {
    const sum = Object.keys(chartData[i])
      .filter(k => k !== "label")
      .reduce((c, v) => c + v, 0)
    if (sum === 0) {
      tail = i - 1
    } else {
      break
    }
  }
  chartData = chartData.slice(0, tail)
  return (
    <>
      <EpidemicChart
        keys={[
          "imported",
          "imported_close_contact",
          "local",
          "local_close_contact",
          "local_possibly",
          "local_possibly_close_contact",
        ]}
        keyToLabel={key => {
          return t(`epidemic_chart.key_${key}`)
        }}
        data={chartData}
      />
      <Typography variant="body2">{t("epidemic.remarks")}</Typography>
    </>
  )
}
