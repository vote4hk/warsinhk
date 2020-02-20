import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Typography } from "@material-ui/core"
import { graphql } from "gatsby"
import SimpleLineChart from "@/components/charts/SimpleLineChart"
import _times from "lodash.times"

const ChartsPage = ({ data, location }) => {
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
    return data
  }

  const get2xDataForChart = ({ node }) => {
    const data = {
      ...node,
    }
    Object.keys(data).forEach(key => {
      if (!isNaN(parseInt(data[key], 0))) {
        data[key] = parseInt(data[key], 0) * 2
      }
    })
    return data
  }

  const thisWeek = data.last7days.edges.map(getDataForChart).reverse()
  // const accumlatedLast7Days = thisWeek.map((d, i) => {
  //   const record = { ...d }
  //   for (let j = 0; j < 7 && i - j >= 0; j ++) {
  //     record.confirmed thisWeek[i - j]
  //   }
  //   return record
  // })
  const lastWeek = data.last7days.edges
    .map(getDataForChart)
    .reverse()
    .map((d, i) =>
      i < 7
        ? { confirmed: 0 }
        : { confirmed: d.confirmed - thisWeek[i - 7].confirmed }
    )
  return (
    <Layout noPadding={true}>
      <SEO title="Charts" />
      <Typography variant="h2">{t("charts.title")}</Typography>
      <SimpleLineChart
        data={{
          xaxis: data.last7days.edges.map(({ node }) => node.date).reverse(),
          fields: ["confirmed"],
          datasets: [
            // {
            //   legend: "2x過往十四日",
            //   line: {
            //     color: "#ff574f",
            //   },
            //   data: data.last7days.edges.map(getDataForChart).reverse()
            // }, {
            {
              line: {
                legend: "過往十四日",
                color: "#bcff4c",
                "stroke-dasharray": "5, 5",
              },
              data: data.last14days.edges
                .map(get2xDataForChart)
                .concat(_times(7, _ => ({ confirmed: "0" })))
                .reverse(),
            },
            {
              line: {
                legend: "過往十四日",
                color: "#ffbc4c",
                "stroke-dasharray": "5, 2",
              },
              // data: data.last14days.edges.map(get2xDataForChart).concat(_times(7, _ => ({ "confirmed": "0" }))).reverse()
              data: lastWeek,
            },
            {
              line: {
                legend: "過往十四日",
                color: "#ff574f",
                // 'stroke-dasharray': '5, 2',
              },
              data: data.last7days.edges.map(getDataForChart).reverse(),
            },
            //  {
            //   line: {
            //     legend: "過往七日",
            //     color: "#ffbc4c",
            //     'stroke-dasharray': '5, 5',
            //   },
            //   data: data.last14days.edges.map(get2xDataForChart).reverse()
            // },
          ],
        }}
      />
    </Layout>
  )
}

export default ChartsPage

export const ChartsQuery = graphql`
  query {
    last7days: allBotWarsLatestFigures(
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

    last14days: allBotWarsLatestFigures(
      sort: { order: DESC, fields: date }
      filter: { date: { gt: "2020-01-20" } }
      skip: 7
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
