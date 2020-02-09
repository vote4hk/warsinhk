import React from "react"
import { useTranslation } from "react-i18next"
import { graphql, Link as InternalLink } from "gatsby"
import styled from "styled-components"

import { bps } from "@/ui/theme"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import Button from "@material-ui/core/Button"
import { withLanguage, getLocalizedPath } from "../utils/i18n"

import SEO from "@components/templates/SEO"
import Layout from "@components/templates/Layout"
import { BasicCard } from "@components/atoms/Card"
import { WarsCaseCard } from "@components/organisms/CaseCard"
import AlertMessage from "@components/organisms/AlertMessage"
import { Paragraph } from "@components/atoms/Text"
import { useMediaQuery } from "@material-ui/core"

import { formatNumber } from "@/utils"

// lazy-load the chart to avoid SSR
const ConfirmedCaseVisual = React.lazy(() =>
  import(
    /* webpackPrefetch: true */ "@/components/organisms/ConfirmedCaseVisual"
  )
)

const IndexAlertMessage = styled(AlertMessage)`
  ${bps.up("lg")} {
    > * {
      flex: 1 0 100%;
      margin-right: 0;
    }
  }
`
const SessiontWrapper = styled(Box)`
  margin-bottom: 16px;
`
const SplitWrapper = styled.div`
  ${bps.up("lg")} {
    display: flex;
    align-items: flex-start;

    ${SessiontWrapper} {
      flex: 1 0 calc(50% - 12px);

      &:nth-of-type(2) {
        max-width: 600px;
        flex: 0 0 calc(50% - 12px);
        margin-left: 24px;
      }
    }
  }
`
const DailyStatsContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
`

const DailyStat = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const DailyStatFigure = styled(Typography)`
  font-size: 30px;
  font-weight: 700;
`

const PassengerDailyStatFigure = styled(Typography)`
  font-size: 25px;
  font-weight: 700;
`

const DailyChange = styled(Typography)`
  font-size: 14px;
  font-weight: 700;
  color: ${props =>
    props.badSign
      ? props.theme.palette.secondary.dark
      : props.theme.palette.trafficLight.green};
`
const FullWidthButton = styled(Button)`
  width: 100%;
  padding: 6px 10px;
`

function DailyStats({
  t,
  botdata: [{ node: first }, { node: second }],
  overridedata,
}) {
  let today, ytd

  today = {
    ...first,
    confirmed: Math.max(overridedata.confirmed, first.confirmed),
  }

  if (overridedata.date > first.date) {
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
    <DailyStatsContainer>
      {dataArray.map((d, i) => (
        <DailyStat key={i}>
          <Typography component="span" variant="body2" color="textPrimary">
            {d.label}
          </Typography>
          <DailyStatFigure>{formatNumber(d.today_stat)}</DailyStatFigure>
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
  )
}

function PassengerStats({
  t,
  bay: [{ node: bay_today }, { node: bay_ytd }],
  bridge: [{ node: bridge_today }, { node: bridge_ytd }],
  airport: [{ node: airport_today }, { node: airport_ytd }],
  total: [{ node: total_today }, { node: total_ytd }],
}) {
  const dataArray = [
    {
      label: t("dashboard.airport"),
      today_stat: airport_today.arrival_mainland,
      diff: airport_today.arrival_mainland - airport_ytd.arrival_mainland,
    },
    {
      label: t("dashboard.bay"),
      today_stat: bay_today.arrival_mainland || 0,
      diff: bay_today.arrival_mainland - bay_ytd.arrival_mainland,
    },
    {
      label: t("dashboard.bridge"),
      today_stat: bridge_today.arrival_mainland,
      diff: bridge_today.arrival_mainland - bridge_ytd.arrival_mainland,
    },
    {
      label: t("dashboard.total"),
      today_stat: total_today.arrival_mainland,
      diff: total_today.arrival_mainland - total_ytd.arrival_mainland,
    },
  ]

  return (
    <DailyStatsContainer>
      {dataArray.map((d, i) => (
        <DailyStat key={i}>
          <Typography component="span" variant="body2" color="textPrimary">
            {d.label}
          </Typography>
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
  )
}

export default function IndexPage({ data }) {
  const { i18n, t } = useTranslation()
  const isSSR = typeof window === "undefined"
  const isMobile = useMediaQuery(bps.down("md"))

  const latestFigures = React.useMemo(
    () => data.allBotWarsLatestFigures.edges[0].node,
    [data]
  )

  const latestFiguresOverride = React.useMemo(
    () => data.allWarsLatestFiguresOverride.edges[0].node,
    [data]
  )

  const remarksText = React.useMemo(
    () => withLanguage(i18n, latestFiguresOverride, "remarks"),
    [i18n, latestFiguresOverride]
  )

  data.allWarsCase.edges.sort(
    (a, b) => parseInt(b.node.case_no) - parseInt(a.node.case_no)
  )

  return (
    <>
      <SEO title="Home" />
      <Layout hideAlerts={true}>
        <SplitWrapper>
          <SessiontWrapper>
            <IndexAlertMessage />
            <Typography variant="h2">{t("index.title")}</Typography>
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
            <BasicCard>
              <DailyStats
                t={t}
                botdata={data.allBotWarsLatestFigures.edges}
                overridedata={latestFiguresOverride}
              />
            </BasicCard>
            {remarksText && (
              <Typography variant="body2" color="textPrimary">
                {remarksText}
              </Typography>
            )}
            <Typography variant="h2">{t("dashboard.passenger")}</Typography>

            <Paragraph>{t("dashboard.mainland_only")}</Paragraph>
            <Typography variant="body2">
              <Link
                href="https://www.immd.gov.hk/hkt/message_from_us/stat_menu.html"
                target="_blank"
              >
                {t("dashboard.source_immd")}
              </Link>
            </Typography>

            <Typography variant="body2" color="textPrimary">
              {`${t("dashboard.immd_remark", {
                to: data.allImmdAirport.edges[0].node.date,
                from: data.allImmdAirport.edges[1].node.date,
              })}`}
            </Typography>
            <BasicCard>
              <PassengerStats
                t={t}
                bridge={data.allImmdHongKongZhuhaiMacaoBridge.edges}
                airport={data.allImmdAirport.edges}
                total={data.allImmdTotal.edges}
                bay={data.allImmdShenzhenBay.edges}
              />
            </BasicCard>

            <Typography variant="h2">{t("index.highlight")}</Typography>
            {!isSSR && (
              <React.Suspense fallback={<div />}>
                <ConfirmedCaseVisual />
              </React.Suspense>
            )}
          </SessiontWrapper>
          <SessiontWrapper>
            <Typography variant="h2">{t("index.latest_case")}</Typography>
            {data.allWarsCase.edges
              .slice(0, isMobile ? 5 : 10)
              .map((item, index) => (
                <WarsCaseCard key={index} node={item.node} i18n={i18n} t={t} />
              ))}
            <FullWidthButton
              component={InternalLink}
              to={getLocalizedPath(i18n, "/cases")}
              variant="outlined"
            >
              {t("index.see_more")}
            </FullWidthButton>
          </SessiontWrapper>
        </SplitWrapper>
      </Layout>
    </>
  )
}

export const WarsCaseQuery = graphql`
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
          time
          confirmed
          ruled_out
          investigating
          reported
          death
          discharged
          remarks_zh
          remarks_en
        }
      }
    }
    allWarsCase(
      sort: { order: DESC, fields: confirmation_date }
      filter: { enabled: { eq: "Y" } }
      limit: 10
    ) {
      edges {
        node {
          case_no
          onset_date
          confirmation_date
          gender
          age
          hospital_zh
          hospital_en
          status
          type_zh
          type_en
          citizenship_zh
          citizenship_en
          detail_zh
          detail_en
          classification
          source_url
        }
      }
    }
  }
`
