import React from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { bps } from "@/ui/theme"
import { formatNumber } from "@/utils"
import { useStaticQuery, graphql } from "gatsby"
import { Paragraph } from "@components/atoms/Text"
import Link from "@material-ui/core/Link"

const DailyStatsContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
`

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

const PassengerDailyStatFigure = styled(Typography)`
  font-size: 20px;
  font-weight: 700;
`

export default () => {
  const data = useStaticQuery(
    graphql`
      query {
        allImmdHongKongZhuhaiMacaoBridge(sort: { order: DESC, fields: date }) {
          edges {
            node {
              arrival_hong_kong
              arrival_mainland
              arrival_other
              arrival_total
              date
              departure_hong_kong
              departure_mainland
              departure_other
              departure_total
              location
            }
          }
        }
        allImmdTotal(sort: { order: DESC, fields: date }) {
          edges {
            node {
              arrival_hong_kong
              arrival_mainland
              arrival_other
              arrival_total
              date
              departure_hong_kong
              departure_mainland
              departure_other
              departure_total
              location
            }
          }
        }
        allImmdAirport(sort: { order: DESC, fields: date }) {
          edges {
            node {
              arrival_hong_kong
              arrival_mainland
              arrival_other
              arrival_total
              date
              departure_hong_kong
              departure_mainland
              departure_other
              departure_total
              location
            }
          }
        }
        allImmdShenzhenBay(sort: { order: DESC, fields: date }) {
          edges {
            node {
              arrival_hong_kong
              arrival_mainland
              arrival_other
              arrival_total
              date
              departure_hong_kong
              departure_mainland
              departure_other
              departure_total
              location
            }
          }
        }
      }
    `
  )

  const { t } = useTranslation()
  const [{ node: bay_today }, { node: bay_ytd }] = data.allImmdShenzhenBay.edges
  const [
    { node: bridge_today },
    { node: bridge_ytd },
  ] = data.allImmdHongKongZhuhaiMacaoBridge.edges
  const [
    { node: airport_today },
    { node: airport_ytd },
  ] = data.allImmdAirport.edges
  const [
    { node: total_today },
    { node: total_ytd },
  ] = data.allImmdShenzhenBay.edges
  const dataArray = [
    {
      label: t("dashboard.airport"),
      today_stat: airport_today.arrival_total,
      diff: airport_today.arrival_total - airport_ytd.arrival_total,
    },
    {
      label: t("dashboard.bay"),
      today_stat: bay_today.arrival_total || 0,
      diff: bay_today.arrival_total - bay_ytd.arrival_total,
    },
    {
      label: t("dashboard.bridge"),
      today_stat: bridge_today.arrival_total,
      diff: bridge_today.arrival_total - bridge_ytd.arrival_total,
    },
    {
      label: t("dashboard.total"),
      today_stat: total_today.arrival_total,
      diff: total_today.arrival_total - total_ytd.arrival_total,
    },
  ]

  return (
    <>
      <Paragraph>{t("dashboard.reference_only")}</Paragraph>
      <Typography variant="body2">
        <Link
          href="https://www.immd.gov.hk/hkt/message_from_us/stat_menu.html"
          target="_blank"
        >
          {t("dashboard.source_immd")}
        </Link>
      </Typography>
      <DailyStatsContainer>
        {dataArray.map((d, i) => (
          <DailyStat key={i}>
            <DailyStatFigureLabel>{d.label}</DailyStatFigureLabel>
            <PassengerDailyStatFigure>
              {formatNumber(d.today_stat)}
            </PassengerDailyStatFigure>
            <DailyChange badSign={d.diff > 0}>
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
