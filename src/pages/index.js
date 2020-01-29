import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import styled from "styled-components"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import { BasicCard } from "@components/atoms/Card"
import { useTranslation } from "react-i18next"

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

const WarsCaseHeader = styled(Box)`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
`

const WarsCaseContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`

const Label = styled(Typography)`
  margin-bottom: 3px;
  font-size: 12px;
  color: ${props => props.theme.palette.primary.dark};
`

// Rmb to sort the query by DESC order of confirmation_date
const wars_Case = [
  {
    hospital_zh: "瑪麗醫院",
    hospital_en: "Princess Margaret Hospital",
    status_en: "Hospitalised",
    status_zh: "住院",
    case_no: 10,
    age: 72,
    confirmation_date: "2020-01-29",
    gender_en: "M",
  },
  {
    hospital_zh: "瑪麗醫院",
    hospital_en: "Princess Margaret Hospital",
    status_en: "Hospitalised",
    status_zh: "住院",
    case_no: 9,
    age: 73,
    confirmation_date: "2020-01-29",
    gender_en: "F",
  },
  {
    hospital_zh: "瑪嘉烈醫院",
    hospital_en: "Princess Margaret Hospital",
    status_en: "Hospitalised",
    status_zh: "住院",
    case_no: 8,
    age: 64,
    confirmation_date: "2020-01-26",
    gender_en: "M",
  },
  {
    hospital_zh: "瑪嘉烈醫院",
    hospital_en: "Princess Margaret Hospital",
    status_en: "Hospitalised",
    status_zh: "住院",
    case_no: 7,
    age: 68,
    confirmation_date: "2020-01-26",
    gender_en: "F",
  },
  {
    hospital_zh: "瑪嘉烈醫院",
    hospital_en: "Princess Margaret Hospital",
    status_en: "Hospitalised",
    status_zh: "住院",
    case_no: 6,
    age: 47,
    confirmation_date: "2020-01-26",
    gender_en: "M",
  },
  {
    hospital_zh: "瑪嘉烈醫院",
    hospital_en: "Princess Margaret Hospital",
    status_en: "Hospitalised",
    status_zh: "住院",
    case_no: 5,
    age: 63,
    confirmation_date: "2020-01-24",
    gender_en: "M",
  },
  {
    hospital_zh: "瑪嘉烈醫院",
    hospital_en: "Princess Margaret Hospital",
    status_en: "Hospitalised",
    status_zh: "住院",
    case_no: 3,
    age: 62,
    confirmation_date: "2020-01-24",
    gender_en: "F",
  },
  {
    hospital_zh: "瑪嘉烈醫院",
    hospital_en: "Princess Margaret Hospital",
    status_en: "Hospitalised",
    status_zh: "住院",
    case_no: 4,
    age: 62,
    confirmation_date: "2020-01-24",
    gender_en: "F",
  },
  {
    hospital_zh: "瑪嘉烈醫院",
    hospital_en: "Princess Margaret Hospital",
    status_en: "Hospitalised",
    status_zh: "住院",
    case_no: 1,
    age: 39,
    confirmation_date: "2020-01-23",
    gender_en: "M",
  },
  {
    hospital_zh: "瑪嘉烈醫院",
    hospital_en: "Princess Margaret Hospital",
    status_en: "Hospitalised",
    status_zh: "住院",
    case_no: 2,
    age: 56,
    confirmation_date: "2020-01-23",
    gender_en: "M",
  },
]

// Rmb to sort the query by DESC order of last_updated
const wars_DailyStats = [
  {
    confirmed_case: 10,
    fulfilling: 585,
    last_updated: "2020-01-29",
    ruled_out: 416,
    still_investigated: 159,
  },
  {
    confirmed_case: 8,
    fulfilling: 529,
    last_updated: "2020-01-28",
    ruled_out: 332,
    still_investigated: 189,
  },
  {
    confirmed_case: 8,
    fulfilling: 451,
    last_updated: "2020-01-27",
    ruled_out: 276,
    still_investigated: 167,
  },
]

function dailyStats(t, props) {
  const today = props[0]
  const ytd = props[1]

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

const confirmedCases = (t, item) => {
  return (
    <WarsCaseContainer key={`case-${item.case_no}`}>
      <WarsCaseHeader>
        <Box>{`${t("dashboard.patient_age_format", { age: item.age })}  ${
          item.gender_en === "F"
            ? t("dashboard.gender_female")
            : t("dashboard.gender_male")
        }`}</Box>
        <Box>{`#${item.case_no}`}</Box>
      </WarsCaseHeader>
      <Box>
        <WarsCaseContent>
          <Box>
            <Label>{t("dashboard.patient_confirm_date")}</Label>
            {item.confirmation_date}
          </Box>
          <Box>
            <Label>{t("dashboard.patient_hospital")}</Label>

            {item.hospital_zh}
          </Box>
          <Box>
            <Label>{t("dashboard.patient_status")}</Label>
            {item.status_zh}
          </Box>
        </WarsCaseContent>
      </Box>
    </WarsCaseContainer>
  )
}

const IndexPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <SEO title="Home" />
      <Layout>
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
          {`${t("dashboard.last_updated")}${wars_DailyStats[0].last_updated}`}
        </Typography>
        <BasicCard children={dailyStats(t, wars_DailyStats)} />
        <Typography variant="h4">{t("dashboard.confirmed_case")}</Typography>
        {wars_Case.map(item => confirmedCases(t, item))}
      </Layout>
    </>
  )
}

export default IndexPage
