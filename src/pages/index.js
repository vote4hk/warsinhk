import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import styled from "styled-components"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import { BasicCard } from "@components/atoms/Card"
import { useTranslation } from "react-i18next"
import { withLanguage } from "../utils/i18n"
import { graphql } from "gatsby"

// lazy-load the chart to avoid SSR
const ConfirmedCaseVisual = React.lazy(() =>
  import(
    /* webpackPrefetch: true */ "@/components/organisms/ConfirmedCaseVisual"
  )
)

const SessiontWrapper = styled(Box)`
  margin-bottom: 16px;
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

const DailyChange = styled(Typography)`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.palette.secondary.dark};
`

function DailyStats({ t, data: [{ node: today }, { node: ytd }] }) {
  const dataArray = [
    {
      label: t("dashboard.death_case"),
      today_stat: today.death_case || 0,
      diff: today.death_case - ytd.death_case,
    },
    {
      label: t("dashboard.confirmed_case"),
      today_stat: today.confirmed_case,
      diff: today.confirmed_case - ytd.confirmed_case,
    },
    {
      label: t("dashboard.investigation_case"),
      today_stat: today.still_investigated,
      diff: today.still_investigated - ytd.still_investigated,
    },
    {
      label: t("dashboard.fulfilling"),
      today_stat: today.fulfilling,
      diff: today.fulfilling - ytd.fulfilling,
    },
  ]

  return (
    <DailyStatsContainer>
      {dataArray.map((d, i) => (
        <DailyStat key={i}>
          <Typography component="span" variant="body2" color="textPrimary">
            {d.label}
          </Typography>
          <DailyStatFigure>{d.today_stat}</DailyStatFigure>
          <DailyChange>
            {d.diff > 0 ? `▲ ${d.diff}` : d.diff < 0 ? `▼ ${d.diff}` : `-`}
          </DailyChange>
        </DailyStat>
      ))}
    </DailyStatsContainer>
  )
}

export default function IndexPage({ data }) {
  const { i18n, t } = useTranslation()
  const isSSR = typeof window === "undefined"

  const latestStat = React.useMemo(() => data.allDailyStats.edges[0].node, [
    data,
  ])
  const remarksText = React.useMemo(
    () => withLanguage(i18n, latestStat, "remarks"),
    [i18n, latestStat]
  )

  return (
    <>
      <SEO title="Home" />
      <Layout>
        <SessiontWrapper>
          <Typography variant="h4">{t("index.title")}</Typography>
          <Typography variant="body2">
            <Link
              href="https://www.chp.gov.hk/tc/features/102465.html"
              target="_blank"
            >
              {t("dashboard.source_chpgovhk")}
            </Link>
          </Typography>
          <Typography variant="body2" color="textPrimary">
            {`${t("dashboard.last_updated")}${latestStat.last_updated}`}
          </Typography>
          <BasicCard>
            <DailyStats t={t} data={data.allDailyStats.edges} />
          </BasicCard>
          {remarksText && (
            <Typography variant="body2" color="textPrimary">
              {remarksText}
            </Typography>
          )}
          <Typography variant="h4">
            {t("index.highlight", { count: latestStat.confirmed_case })}
          </Typography>
          {!isSSR && (
            <React.Suspense fallback={<div />}>
              <ConfirmedCaseVisual />
            </React.Suspense>
          )}
        </SessiontWrapper>
      </Layout>
    </>
  )
}

export const WarsCaseQuery = graphql`
  query {
    allDailyStats(sort: { order: DESC, fields: last_updated }) {
      edges {
        node {
          last_updated
          death
          confirmed_case
          ruled_out
          still_investigated
          fulfilling
          remarks_zh
          remarks_en
        }
      }
    }
    allWarsCase(
      sort: { order: DESC, fields: case_no }
      filter: { enabled: { eq: "Y" } }
    ) {
      edges {
        node {
          case_no
          confirmation_date
          gender
          age
          hospital_zh
          hospital_en
          status_zh
          status_en
          type_zh
          type_en
          citizenship_zh
          citizenship_en
          detail_zh
          detail_en
          source_url
        }
      }
    }
  }
`
