import React from "react"
import { useTranslation } from "react-i18next"
import { useStaticQuery, graphql } from "gatsby"
import MiniLineChart from "@/components/charts/MiniLineChart"
import Typography from "@material-ui/core/Typography"
import Card from "@material-ui/core/Card"
import styled from "styled-components"

const Container = styled.div`
  .row {
    display: flex;
    flex-direction: row;
    .column {
    }
    .spacer {
      margin-left: 16px;
    }
  }
`

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
              date(formatString: "M.DD")
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

  const max = data.allBotWarsLatestFigures.edges
    .map(getDataForChart)
    .map(({ confirmed, discharged, death, hospitalised }) =>
      Math.max(hospitalised, confirmed, discharged, death)
    )
    .reduce((c, v) => Math.max(c, v), 0)

  const getLastFigureByField = field => {
    return data.allBotWarsLatestFigures.edges
      .map(getDataForChart)
      .map(data => data[field] || 0)
      .reverse()
      .pop()
  }

  return (
    <Container>
      <div className="row">
        <div className="column">
          <Typography variant="h6">
            {t("cases.status_hospitalised")}:
            {getLastFigureByField("hospitalised")}
          </Typography>
          <Card>
            <MiniLineChart
              data={{
                showLegend: false,
                xaxis: data.allBotWarsLatestFigures.edges
                  .map(({ node }) => node.date)
                  .reverse(),
                fields: ["hospitalised"],
                max,
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
          </Card>
        </div>
        <div className="spacer" />
        <div className="column">
          <Typography variant="h6">
            {t("cases.status_discharged")}:{getLastFigureByField("discharged")}
          </Typography>
          <Card>
            <MiniLineChart
              data={{
                showLegend: false,
                xaxis: data.allBotWarsLatestFigures.edges
                  .map(({ node }) => node.date)
                  .reverse(),
                fields: ["discharged"],
                max,
                datasets: [
                  {
                    line: {
                      legend: t("cases.discharged"),
                      color: "#57ff4f",
                      // 'stroke-dasharray': '5, 2',
                    },
                    data: data.allBotWarsLatestFigures.edges
                      .map(getDataForChart)
                      .reverse(),
                  },
                ],
              }}
            />
          </Card>
        </div>
        <div className="spacer" />
        <div className="column">
          <Typography variant="h6">
            {t("dashboard.death")}:{getLastFigureByField("death")}
          </Typography>
          <Card>
            <MiniLineChart
              data={{
                showLegend: false,
                xaxis: data.allBotWarsLatestFigures.edges
                  .map(({ node }) => node.date)
                  .reverse(),
                fields: ["death"],
                max,
                datasets: [
                  {
                    line: {
                      color: "#4f334f",
                      // 'stroke-dasharray': '5, 2',
                    },
                    data: data.allBotWarsLatestFigures.edges
                      .map(getDataForChart)
                      .reverse(),
                  },
                ],
              }}
            />
          </Card>
        </div>
      </div>
    </Container>
  )
}
