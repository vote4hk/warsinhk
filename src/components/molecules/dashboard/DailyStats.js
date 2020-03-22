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
              probably
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
              probably
              ruled_out
              investigating
              reported
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

  const [
    { node: first_bot },
    { node: second_bot },
  ] = data.allBotWarsLatestFigures.edges
  const [
    { node: first },
    { node: second },
  ] = data.allWarsLatestFiguresOverride.edges
  const must_increase_items = [
    "confirmed",
    "death",
    "discharged",
    "ruled_out",
    "reported",
  ]

  today = {
    ...first_bot,
    probably: first.probably || first_bot.probably,
  }

  ytd = {
    ...second_bot,
    probably: second.probably || second_bot.probably,
  }

  must_increase_items.forEach(dat => {
    const desc_figures = [first[dat], first_bot[dat], second[dat]].sort(
      (a, b) => b - a
    )
    today[dat] = desc_figures[0]
    ytd[dat] = desc_figures[1]
  })

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
      label: t("dashboard.probably"),
      today_stat: today.probably,
      diff: today.probably - ytd.probably,
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
          first.date > first_bot.date ? first.date : first_bot.date
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
