import React from "react"
import { useTranslation } from "react-i18next"
import { useStaticQuery, graphql } from "gatsby"
import MiniLineChart from "@/components/charts/MiniLineChart"
import styled from "styled-components"
import Grid from "@material-ui/core/Grid"
import { formatNumber } from "@/utils"
import { mapColorForStatus } from "@/utils/colorHelper"
import { bps, palette } from "@/ui/theme"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import useMediaQuery from "@material-ui/core/useMediaQuery"
const CHIP_SIZE = 7

const ChartContainer = styled.div`
  position: relative;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: 75px;

  &::before {
    content: "";
    position: absolute;
    width: ${CHIP_SIZE * 2}px;
    height: ${CHIP_SIZE * 5.5}px;
    top: -${CHIP_SIZE} px;
    left: -${CHIP_SIZE}px;
    background-color: ${props => props.color};
    border-radius: 0 0   ${CHIP_SIZE * 1.25}px 0;
  }

  .title, .figure {
    position: absolute;
    left: 20px;
  }

  .title {
    top: 6px;
    padding-right: 5px;
    font-size: 12px;
    line-height: 12px;
    font-weight: 500;
    word-wrap: break-word:
    
    ${bps.up("md")} {
      font-size: 14px;
    }
  }

  .figure {
    top: 26px;
    font-size: 22px;
    font-weight: 700;
  }

  .change-figure {
    position: absolute;
    left: 0px;
    width: 50px;
    
    bottom: -12px;
    font-size: 11px;
    
    ${bps.up("md")} {
      bottom: -16px;
      font-size: 14px;
    }
    font-weight: 500;
  }

  .arrow {
    color: #d1d1d1;
  }

  .mini-chart {
    position: absolute;
    left: ${props => (props.columns === 6 ? "60px" : "30px")};
    ${bps.up("md")} {
      width: ${props => (props.columns === 6 ? "100px" : "75px")};
    }
  }
`

export default props => {
  const data = useStaticQuery(
    graphql`
      query {
        allWarsLatestFiguresOverride(
          sort: { order: DESC, fields: date }
          filter: { date: { gt: "2020-01-20" } }
        ) {
          edges {
            node {
              date
              confirmed
              probably
              hospitalised
              ruled_out
              investigating
              reported
              death
              discharged
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
  const isMidScreen = useMediaQuery(bps.up("md"))

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

  const max = data.allWarsLatestFiguresOverride.edges
    .map(getDataForChart)
    .map(({ confirmed, discharged, death }) =>
      Math.max(confirmed, discharged, death)
    )
    .reduce((c, v) => Math.max(c, v), 0)

  const [{ node: latest }] = data.allWarsLatestFiguresOverride.edges

  const getLastFigureByField = field => {
    return formatNumber(
      data.allWarsLatestFiguresOverride.edges
        .map(getDataForChart)
        .map(data => data[field] || 0)
        .reverse()
        .pop()
    )
  }
  const getDiffByField = field => {
    const array = data.allWarsLatestFiguresOverride.edges
      .map(getDataForChart)
      .map(data => data[field] || 0)

    if (array.length > 1) {
      const diff = array[0] - array[1]
      return diff > 0 ? (
        <span>
          <span className="arrow">▲</span> {formatNumber(diff)}
        </span>
      ) : diff < 0 ? (
        <span>
          <span className="arrow">▼</span> {formatNumber(Math.abs(diff))}
        </span>
      ) : (
        <span>-</span>
      )
    }
    return 0
  }

  const chartsData = [
    [
      {
        title: t("dashboard.confirmed"),
        field: "confirmed",
        color: palette.primary.main,
        trend: true,
        columns: 6,
      },
      {
        title: t("cases.status_discharged"),
        field: "discharged",
        color: mapColorForStatus("discharged").main,
        trend: true,
        columns: 6,
      },
    ],
    [
      {
        title: t("cases.status_deceased"),
        field: "death",
        color: mapColorForStatus("deceased").main,
        trend: true,
        columns: 4,
      },
      {
        title: t("cases.status_hospitalised"),
        field: "hospitalised",
        color: mapColorForStatus("hospitalised").main,
        value: latest.hospitalised,
        trend: false,
        columns: 4,
      },
      {
        title: t("cases.status_pending_admission"),
        field: "pending_admission",
        color: mapColorForStatus("pending_admission").main,
        value: data.pendingAdmission.totalCount,
        trend: false,
        columns: 4,
      },
    ],
  ]

  const renderChart = props => {
    const renderStats = props => {
      const { title, field, color, trend, value, columns = 12, index } = props
      return (
        <Grid xs={columns} item key={title}>
          <ChartContainer color={color} columns={columns} key={index}>
            <div className="title">{title}</div>
            <div className="figure">
              {value || getLastFigureByField(field)}
              {trend && (
                <span className="change-figure">{getDiffByField(field)}</span>
              )}
            </div>

            {trend && (
              <div className="mini-chart">
                <MiniLineChart
                  data={{
                    showLegend: false,
                    xaxis: data.allWarsLatestFiguresOverride.edges
                      .map(({ node }) => node.date)
                      .reverse(),
                    fields: [field],
                    max,
                    datasets: [
                      {
                        line: {
                          color,
                        },
                        data: data.allWarsLatestFiguresOverride.edges
                          .map(getDataForChart)
                          .reverse(),
                      },
                    ],
                  }}
                />
              </div>
            )}
          </ChartContainer>
        </Grid>
      )
    }
    if (Array.isArray(props)) {
      return (
        <Grid container spacing={1}>
          {props.map(prop => renderStats(prop))}
        </Grid>
      )
    }

    return (
      <Grid container spacing={1}>
        {renderStats(props)}
      </Grid>
    )
  }

  return (
    <>
      <Typography variant="body2">
        <Link
          href="https://www.chp.gov.hk/tc/features/102465.html"
          target="_blank"
        >
          {t("dashboard.source_chpgovhk")}
        </Link>
      </Typography>
      <Typography variant="body2" color="textPrimary">
        {`${t("dashboard.last_updated")}${latest.date}`}
      </Typography>
      <Grid style={{ marginTop: 8 }} container spacing={1}>
        {chartsData.map((c, index) => (
          <Grid item xs={isMidScreen ? 6 : 12} key={index}>
            {renderChart(c)}
          </Grid>
        ))}
      </Grid>
    </>
  )
}
