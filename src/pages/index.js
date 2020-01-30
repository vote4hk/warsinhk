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
const WarsCaseContainer = styled(Box)`
  background: ${props => props.theme.palette.background.paper};
  padding: 8px 16px;
  margin: 16px 0;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`

const WarsCaseRow = styled(Box)`
  font-size: 14px;
  margin: 4px 0 4px;
  display: flex;
  justify-content: space-between;
`

const WarsCaseContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`
const WarsCaseDetail = styled(Typography)`
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.33rem;
`

const WarsSource = styled(Link)`
  margin-top: 8px;
`

const Label = styled(Typography)`
  margin-bottom: 3px;
  font-size: 12px;
  color: ${props => props.theme.palette.primary.dark};
`

function dailyStats(t, props) {
  const today = props[0].node
  const ytd = props[1].node

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

  const dailyStat = (d, i) => {
    return (
      <DailyStat key={i}>
        <Typography component="span" variant="body2" color="textPrimary">
          {d.label}
        </Typography>
        <DailyStatFigure>{d.today_stat}</DailyStatFigure>
        <DailyChange>
          {d.diff > 0 ? `▲ ${d.diff}` : d.diff < 0 ? `▼ ${d.diff}` : `-`}
        </DailyChange>
      </DailyStat>
    )
  }
  return (
    <DailyStatsContainer>
      {dataArray.map((d, i) => dailyStat(d, i))}
    </DailyStatsContainer>
  )
}

const confirmedCases = (i18n, item, t) => {
  const { node } = item
  return (
    <WarsCaseContainer key={`case-${node.case_no}`}>
      <WarsCaseRow>
        <Box>
          {`#${node.case_no}`} ({withLanguage(i18n, node, "type")})
        </Box>
        <Box>{withLanguage(i18n, node, "status")}</Box>
      </WarsCaseRow>
      <WarsCaseRow>
        <Box>{`${t("dashboard.patient_age_format", { age: node.age })}  ${
          node.gender === "F"
            ? t("dashboard.gender_female")
            : t("dashboard.gender_male")
        }`}</Box>
      </WarsCaseRow>
      <Box>
        <WarsCaseContent>
          <Box>
            <Label>{t("dashboard.patient_confirm_date")}</Label>
            {node.confirmation_date}
          </Box>
          <Box>
            <Label>{t("dashboard.patient_citizenship")}</Label>
            {withLanguage(i18n, node, "citizenship") || "-"}
          </Box>
          <Box>
            <Label>{t("dashboard.patient_hospital")}</Label>
            {withLanguage(i18n, node, "hospital") || "-"}
          </Box>
        </WarsCaseContent>
      </Box>
      <WarsCaseRow>
        <WarsCaseDetail>{withLanguage(i18n, node, "detail")}</WarsCaseDetail>
      </WarsCaseRow>
      <WarsCaseRow>
        <WarsSource href={node.source_url} target="_blank">
          {t("dashboard.source")}
        </WarsSource>
      </WarsCaseRow>
    </WarsCaseContainer>
  )
}

const IndexPage = ({ data }) => {
  const { i18n, t } = useTranslation()

  data.allWarsCases.edges.sort(
    (a, b) => parseInt(b.node.case_no) - parseInt(a.node.case_no)
  )

  const latestStat = data.allDailyStats.edges[0].node
  const remarksText = withLanguage(i18n, latestStat, "remarks")

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
          <BasicCard children={dailyStats(t, data.allDailyStats.edges)} />
          {remarksText && (
            <Typography variant="body2" color="textPrimary">
              {remarksText}
            </Typography>
          )}
        </SessiontWrapper>
        <SessiontWrapper>
          <Typography variant="h4">{t("dashboard.confirmed_case")}</Typography>
          {data.allWarsCases.edges.map(node => confirmedCases(i18n, node, t))}
        </SessiontWrapper>
      </Layout>
    </>
  )
}

export default IndexPage

export const WarsCasesQuery = graphql`
  query {
    allWarsCases(sort: { order: DESC, fields: case_no }) {
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
  }
`
