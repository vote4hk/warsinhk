import React from "react"
import { useTranslation } from "react-i18next"
import { useStaticQuery, graphql } from "gatsby"
import MiniLineChart from "@/components/charts/MiniLineChart"
import styled from "styled-components"

const CHIP_SIZE = 7

const ChartContainer = styled.div`
  position: relative;
  height: ${CHIP_SIZE} * 11 + px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 ${CHIP_SIZE}px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 150px;
  height: 90px;
  margin-bottom: 16px;

  &::before {
    content: "";
    position: absolute;
    width: ${CHIP_SIZE * 2}px;
    height: ${CHIP_SIZE * 6.5}px;
    top: -${CHIP_SIZE} px;
    left: -${CHIP_SIZE}px;
    background-color: ${props => props.color};
    border-radius: ${CHIP_SIZE}px;
  }

  span {
    position: absolute;
    left: 15px;
  }
  .title {
    top: 6px;
  }
  .figure {
    top: 25px;
    font-size: 24px;
    font-weight: 500;
  }
  .increase-figure {
    top: 60px;
  }

  .mini-chart {
    position: absolute;
    left: 40%;
    width: 60%;
  }
`

const Container = styled.div`
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

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
  const getIncreasedByField = field => {
    const array = data.allBotWarsLatestFigures.edges
      .map(getDataForChart)
      .map(data => data[field] || 0)

    if (array.length > 1) {
      return array[0] - array[1]
    }
    return 0
  }

  const chartsData = [
    {
      title: t("tredning.accu_confirmed"),
      field: "confirmed",
      color: "rgb(266,106,108)",
    },
    {
      title: t("tredning.discharged"),
      field: "discharged",
      color: "rgb(72,163,158)",
    },
    {
      title: t("tredning.death"),
      field: "death",
      color: "rgb(118,118,118)",
    },
    {
      title: t("tredning.hospitalized"),
      field: "hospitalised",
      color: "rgb(242,171,64)",
    },
  ]

  const renderChart = ({ title, field, color, index }) => {
    return (
      <ChartContainer color={color} key={index}>
        <span className="title">{title}</span>
        <span className="figure">{getLastFigureByField(field)}</span>
        <span className="increase-figure">{getIncreasedByField(field)}</span>
        <div className="mini-chart">
          <MiniLineChart
            data={{
              showLegend: false,
              xaxis: data.allBotWarsLatestFigures.edges
                .map(({ node }) => node.date)
                .reverse(),
              fields: [field],
              max,
              datasets: [
                {
                  line: {
                    color,
                  },
                  data: data.allBotWarsLatestFigures.edges
                    .map(getDataForChart)
                    .reverse(),
                },
              ],
            }}
          />
        </div>
      </ChartContainer>
    )
  }

  return (
    <Container>
      <div className="row">
        {chartsData.map((c, index) => renderChart({ ...c, index }))}
      </div>
    </Container>
  )
}
