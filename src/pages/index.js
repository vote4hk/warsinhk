import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import styled from "styled-components"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import { BasicCard } from "@components/atoms/Card"

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
  margin-bottom: 6px;
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

function dailyStats(props, i18n) {
  const today = props[0]
  const ytd = props[1]

  const dataArray = [
    {
      label: "死亡個案",
      today_stat: today.death_case || 0,
      diff: today.death_case - ytd.death_case,
    },
    {
      label: "確診個案",
      today_stat: today.confirmed_case,
      diff: today.confirmed_case - ytd.confirmed_case,
    },
    {
      label: "住院個案",
      today_stat: today.still_investigated,
      diff: today.still_investigated - ytd.still_investigated,
    },
    {
      label: "累積懷疑個案",
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

const confirmedCases = item => {
  return (
    <WarsCaseContainer>
      <WarsCaseHeader>
        {`#${item.case_no} ${item.age}歲  ${
          item.gender_en === "F" ? "女" : "男"
        }`}
      </WarsCaseHeader>
      <Box>
        <WarsCaseContent>
          <Box>
            <Label>確診日期</Label>
            {item.confirmation_date}
          </Box>
          <Box>
            <Label>入住醫院</Label>

            {item.hospital_zh}
          </Box>
          <Box>
            <Label>患者狀況</Label>
            {item.status_zh}
          </Box>
        </WarsCaseContent>
      </Box>
    </WarsCaseContainer>
  )
}

const IndexPage = props => {
  return (
    <>
      <SEO title="Home" />
      <Layout>
        <Typography variant="h4">疫情追蹤</Typography>
        <Typography variant="body2">
          <Link
            href="https://www.chp.gov.hk/tc/features/102465.html"
            target="_blank"
          >
            資料來源：衛生防護中心
          </Link>
        </Typography>
        <Typography variant="body2" color="textPrimary">
          {`最後更新：${wars_DailyStats[0].last_updated}`}
        </Typography>
        <BasicCard children={dailyStats(wars_DailyStats)} />
        <Typography variant="h4">確診個案</Typography>
        {wars_Case.map(item => confirmedCases(item))}
      </Layout>
    </>
  )
}

export default IndexPage
