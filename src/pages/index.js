import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import styled from "styled-components"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
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

  const dailyStat = d => {
    return (
      <DailyStat>
        <Typography component="span" variant="body2" color="textPrimary">
          {d.label}
        </Typography>
        <DailyStatFigure>{d.today_stat}</DailyStatFigure>
        {d.diff > 0 ? `+ ${d.diff}` : d.diff < 0 ? `- ${d.diff}` : `-`}
      </DailyStat>
    )
  }
  return (
    <DailyStatsContainer>
      {dataArray.map(d => dailyStat(d))}
    </DailyStatsContainer>
  )
}

const IndexPage = props => {
  return (
    <>
      <SEO title="Home" />
      <Layout>
        <BasicCard children={dailyStats(wars_DailyStats)} />
      </Layout>
    </>
  )
}

export default IndexPage
