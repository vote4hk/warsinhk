import React from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { bps } from "@/ui/theme"
import { formatNumber } from "@/utils"
import Link from "@material-ui/core/Link"
import { useStaticQuery, graphql } from "gatsby"
import { BasicCard } from "@components/atoms/Card"

const DailyChange = styled(({ badSign, children, ...props }) => (
  <Typography {...props}>{children}</Typography>
))`
  font-size: 14px;
  font-weight: 700;
  color: ${props => {
    return props.badSign
      ? props.theme.palette.secondary.dark
      : props.theme.palette.trafficLight.green
  }};
`

const DailyStatsContainer = styled(BasicCard)`
  display: flex;
  justify-content: space-between;
`

const DailyStat = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const DailyStatFigureLabel = styled(Typography)`
  text-align: center;
  font-size: ${props => props.theme.typography.xsmallFontSize};

  ${bps.down("sm")} {
    font-size: 11px;
  }
`

const DailyStatFigure = styled(Typography)`
  font-size: 25px;
  font-weight: 700;
`

export default props => {
  const data = useStaticQuery(
    graphql`
      query {
        allBotWarsLatestFigures(sort: { order: DESC, fields: date }) {
          edges {
            node {
              date
              time
              confirmed
              ruled_out
              investigating
              reported
              death
              discharged
            }
          }
        }
        allWarsLatestFiguresOverride(sort: { order: DESC, fields: date }) {
          edges {
            node {
              date
              confirmed
              death
              discharged
            }
          }
        }
      }
    `
  )
  const { t } = useTranslation()

  let today, ytd

  const [{ node: first }, { node: second }] = data.allBotWarsLatestFigures.edges
  const latestFiguresOverride = data.allWarsLatestFiguresOverride.edges[0].node
  const latestFigures = data.allBotWarsLatestFigures.edges[0].node
  const overridedata = data.allWarsLatestFiguresOverride.edges[0].node

  today = {
    ...first,
    confirmed: Math.max(overridedata.confirmed, first.confirmed),
    discharged: Math.max(overridedata.discharged, first.discharged),
    death: Math.max(overridedata.death, first.death),
  }

  if (
    overridedata.date > first.date &&
    (overridedata.confirmed > first.confirmed ||
      overridedata.discharged > first.discharged ||
      overridedata.death > first.death)
  ) {
    ytd = {
      ...first,
    }
  } else {
    ytd = {
      ...second,
    }
  }

  const dataArray = [
    {
      label: t("dashboard.death"),
      today_stat: today.death || 0,
      diff: today.death - ytd.death,
    },
    {
      label: t("dashboard.discharged"),
      today_stat: today.discharged || 0,
      diff: today.discharged - ytd.discharged,
    },
    {
      label: t("dashboard.confirmed"),
      today_stat: today.confirmed,
      diff: today.confirmed - ytd.confirmed,
    },
    {
      label: t("dashboard.investigating"),
      today_stat: today.investigating,
      diff: today.investigating - ytd.investigating,
    },
    {
      label: t("dashboard.reported"),
      today_stat: today.reported,
      diff: today.reported - ytd.reported,
    },
  ]

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
        {`${t("dashboard.last_updated")}${
          latestFiguresOverride.date > latestFigures.date
            ? latestFiguresOverride.date
            : latestFigures.date
        }`}
      </Typography>
      <DailyStatsContainer>
        {dataArray.map((d, i) => (
          <DailyStat key={i}>
            <DailyStatFigureLabel>{d.label}</DailyStatFigureLabel>
            <DailyStatFigure>{formatNumber(d.today_stat)}</DailyStatFigure>
            <DailyChange
              badSign={
                d.label === t("dashboard.discharged") ? false : d.diff > 0
              }
            >
              {d.diff > 0
                ? `▲ ${formatNumber(d.diff)}`
                : d.diff < 0
                ? `▼ ${formatNumber(Math.abs(d.diff))}`
                : `-`}
            </DailyChange>
          </DailyStat>
        ))}
      </DailyStatsContainer>
    </>
  )
}
