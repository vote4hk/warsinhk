import React from "react"
import { useTranslation } from "react-i18next"
import { useStaticQuery, graphql } from "gatsby"
import SimpleLineChart from "@/components/charts/SimpleLineChart"
import Typography from "@material-ui/core/Typography"

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
              bed_number
              bed_percent
              room_number
              room_percent
            }
          }
        }
        pendingAdmission: allWarsCase(
          filter: { status: { eq: "pending_admission" } }
        ) {
          totalCount
        }
      }
    `
  )
  const { t } = useTranslation()

  const getDataForChart = ({ node }, i) => {
    const chartData = {
      ...node,
    }
    Object.keys(chartData).forEach(key => {
      if (!isNaN(parseInt(chartData[key], 0))) {
        chartData[key] = parseInt(chartData[key], 0)
      }
    })
    return {
      ...chartData,
      hospitalised:
        chartData.confirmed -
        chartData.death -
        chartData.discharged -
        ((i === 0 && data.pendingAdmission.totalCount) || 0),
    }
  }

  const isolationBed = () => {
    const { node: item } = data.dailyFigures.edges.find(e => e.node.bed_number)

    return {
      date: item.date,
      bedCount: Number(item.bed_number),
      bedPercent: item.bed_percent,
      roomCount: Number(item.room_number),
      roomPercent: item.room_percent,
    }
  }

  const isolationText = t("isolation_beds.helmet", {
    date: isolationBed().date,
    bedPercent: isolationBed().bedPercent,
    roomCount: isolationBed().roomCount,
    roomPercent: isolationBed().roomPercent,
  })

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
              legend: t("cases.isolation_bed", {
                bedCount: isolationBed().bedCount,
              }),
              value: isolationBed().bedCount,
            },
          ],
          datasets: [
            {
              line: {
                legend: t("cases.status_hospitalised"),
                color: "#ff574f",
                // 'stroke-dasharray': '5, 2',
              },
              data: data.dailyFigures.edges
                .map((e, i) => getDataForChart(e, i))
                .reverse(),
            },
          ],
        }}
      />
    </>
  )
}
