import React from "react"
import { useTranslation } from "react-i18next"
import { graphql, Link as InternalLink } from "gatsby"
import styled from "styled-components"
import { useMediaQuery } from "react-responsive"

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
import Grid from "@material-ui/core/Grid"

import { formatNumber } from "@/utils"
import { SessionWrapper, SplitWrapper } from "@components/atoms/Container"

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
const DailyStatsContainer = styled(Box)`
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

const PassengerDailyStatFigure = styled(Typography)`
  font-size: 20px;
  font-weight: 700;
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

const FullWidthButton = styled(Button)`
  width: 100%;
  padding: 6px 10px;
`

const FriendlyLinksContainer = styled(Box)`
  margin-bottom: 16px;
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
    <DailyStatsContainer>
      {dataArray.map((d, i) => (
        <DailyStat key={i}>
          <DailyStatFigureLabel>{d.label}</DailyStatFigureLabel>
          <DailyStatFigure>{formatNumber(d.today_stat)}</DailyStatFigure>
          <DailyChange
            badSign={d.label === t("dashboard.discharged") ? false : d.diff > 0}
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
  )
}

export default function IndexPage({ data }) {
  const { i18n, t } = useTranslation()
  const isSSR = typeof window === "undefined"
  const isMobile = useMediaQuery({ maxWidth: 960 })

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

  const latestCases = data.allWarsCase.edges
    .sort((a, b) => parseInt(b.node.case_no) - parseInt(a.node.case_no))
    .filter(
      c =>
        c.node.confirmation_date ===
        data.allWarsCase.edges[0].node.confirmation_date
    )
  return (
    <>
      <SEO title="Home" />
      <Layout>
        <SplitWrapper>
          <SessionWrapper>
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

            {isMobile && (
              <Typography variant="h2">{t("index.highlight")}</Typography>
            )}
            {isMobile && !isSSR && (
              <React.Suspense fallback={<div />}>
                <ConfirmedCaseVisual />
              </React.Suspense>
            )}

            <Typography variant="h2">{t("dashboard.passenger")}</Typography>

            <Paragraph>{t("dashboard.reference_only")}</Paragraph>
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

            {!isMobile && (
              <Typography variant="h2">{t("index.highlight")}</Typography>
            )}
            {!isMobile && !isSSR && (
              <React.Suspense fallback={<div />}>
                <ConfirmedCaseVisual />
              </React.Suspense>
            )}
          </SessionWrapper>
          <SessionWrapper>
            <FriendlyLinksContainer>
              <Grid container spacing={1}>
                {data.allFriendlyLink.edges.map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <FullWidthButton
                      index={index}
                      component={Link}
                      href={item.node.source_url}
                      target="_blank"
                      variant="outlined"
                    >
                      {item.node.title}
                    </FullWidthButton>
                  </Grid>
                ))}
              </Grid>
            </FriendlyLinksContainer>
            <Typography variant="h2">{t("index.latest_case")}</Typography>
            {latestCases.map((item, index) => (
              <WarsCaseCard key={index} node={item.node} i18n={i18n} t={t} />
            ))}
            <FullWidthButton
              component={InternalLink}
              to={getLocalizedPath(i18n, "/cases")}
              variant="outlined"
            >
              {t("index.see_more")}
            </FullWidthButton>
          </SessionWrapper>
        </SplitWrapper>
      </Layout>
    </>
  )
}

export const WarsCaseQuery = graphql`
  query($locale: String) {
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
      sort: { order: [DESC, DESC], fields: [confirmation_date, case_no] }
      limit: 5
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
          classification_zh
          classification_en
          source_url
        }
      }
    }
    allFriendlyLink(
      sort: { fields: sort_order, order: DESC }
      filter: { language: { eq: $locale } }
    ) {
      edges {
        node {
          language
          title
          source_url
          sort_order
        }
      }
    }
  }
`
