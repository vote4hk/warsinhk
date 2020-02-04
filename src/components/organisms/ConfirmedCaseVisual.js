import React from "react"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import Plot from "react-plotly.js"
import Grid from "@material-ui/core/Grid"
import { useMediaQuery } from "react-responsive"
import { useStaticQuery, graphql } from "gatsby"
import { withLanguage } from "../../utils/i18n"
import styled from "styled-components"
import { BasicCard } from "@components/atoms/Card"
import { Row } from "@components/atoms/Row"
import Box from "@material-ui/core/Box"
import { Hidden } from "@material-ui/core"
import { bps } from "@/ui/theme"

const PlotsWrapper = styled(Grid)`
  ${bps.up("lg")} {
    flex-direction: column;

    > * {
      max-width: 100%;
    }
  }
`

const AgeGrid = styled(Grid)`
  display: flex;

  > div {
    width: 100%;
  }
`

const AgeWrapper = styled(Row)`
  ${bps.up("md")} {
    flex-direction: column;
  }
`

const AgeBox = styled(Box)`
  ${bps.up("md")} {
    text-align: center;
    margin: 0 0 3em;
  }
`

const AgeTitle = styled.h4`
  display: inline;
  ${bps.up("md")} {
    display: block;
    font-size: 18px;
  }
`

const DataValue = styled.span`
  ${bps.up("md")} {
    font-size: 48px;
    line-height: 1.4;
  }
`

export default function ConfirmedCaseVisual(props) {
  const { i18n, t } = useTranslation()

  const {
    age: { nodes: ageArray },
    genderAge: { group: genderAge },
    citizenshipZh: { group: citizenship_zh },
    citizenshipEn: { group: citizenship_en },
  } = useStaticQuery(
    graphql`
      query {
        age: allWarsCase(
          sort: { fields: age, order: ASC }
          filter: { type_en: { eq: "Confirmed" }, age: { ne: "" } }
        ) {
          nodes {
            age
          }
        }
        genderAge: allWarsCase(filter: { type_en: { eq: "Confirmed" } }) {
          group(field: gender) {
            edges {
              node {
                age
              }
            }
            totalCount
            fieldValue
          }
        }
        citizenshipZh: allWarsCase(filter: { type_en: { eq: "Confirmed" } }) {
          group(field: citizenship_zh) {
            totalCount
            fieldValue
          }
        }
        citizenshipEn: allWarsCase(filter: { type_en: { eq: "Confirmed" } }) {
          group(field: citizenship_en) {
            totalCount
            fieldValue
          }
        }
      }
    `
  )
  const WarsCaseData = {
    ageArray,
    genderAge,
    citizenship_zh,
    citizenship_en,
    female: genderAge.find(age => age.fieldValue === "F"),
    male: genderAge.find(age => age.fieldValue === "M"),
  }

  const citizenshipData = withLanguage(i18n, WarsCaseData, "citizenship")

  const femaleAgeTotal = parseInt(
    WarsCaseData.female.edges.reduce((a, c) => a + parseInt(c.node.age), 0)
  )
  const maleAgeTotal = parseInt(
    WarsCaseData.male.edges.reduce((a, c) => a + parseInt(c.node.age), 0)
  )

  const maleAgeAverage = parseInt(
    maleAgeTotal / parseInt(WarsCaseData.male.totalCount)
  )
  const femaleAgeAverage = parseInt(
    femaleAgeTotal / parseInt(WarsCaseData.female.totalCount)
  )

  const isMobile = useMediaQuery({ maxWidth: 960 })
  const font = {
    size: isMobile ? 15 : 16,
    family: "Noto Sans TC, 微軟正黑體, 新細明體, sans-serif",
  }

  const GENDER_COLOR_LIST = ["#006266", "#ED4C67"]

  const genderPie = [
    {
      type: "pie",
      values: [WarsCaseData.female.totalCount, WarsCaseData.male.totalCount],
      labels: [
        t(`dashboard.gender_${WarsCaseData.female.fieldValue}`),
        t(`dashboard.gender_${WarsCaseData.male.fieldValue}`),
      ],
      marker: {
        colors: GENDER_COLOR_LIST,
      },
      hole: 0.5,
    },
  ]

  const genderBar = [WarsCaseData.male, WarsCaseData.female].map(
    (data, index) => {
      return {
        x: [data.totalCount],
        name: t(`dashboard.gender_${data.fieldValue}`),
        orientation: "h",
        type: "bar",
        text: `${t(`dashboard.gender_${data.fieldValue}`)} - ${
          data.totalCount
        } `,
        textposition: "auto",
        width: 0.5,
        marker: {
          color: GENDER_COLOR_LIST[index],
        },
      }
    }
  )

  const COLOR_LIST = [
    "#45CF8F",
    "#005ECD",
    "#FF5D55",
    "#424559",
    "#F49600",
    "#F3966F",
    "#06C7BA",
    "#004427",
    "#BEB4D3",
    "#FCC457",
  ]

  const citizenPie = [
    {
      type: "pie",
      values: citizenshipData.map(c => c.totalCount),
      labels: citizenshipData.map(c => c.fieldValue),
      marker: {
        colors: COLOR_LIST,
      },
      hole: 0.5,
    },
  ]

  const citizenBar = citizenshipData
    .sort((a, b) => parseInt(a.totalCount) - parseInt(b.totalCount))
    .map((data, index) => {
      return {
        x: [data.totalCount],
        y: [data.fieldValue],
        name: [data.fieldValue],
        orientation: "h",
        type: "bar",
        text: `${data.fieldValue} - ${data.totalCount} `,
        textposition: "auto",
        width: (0.8 / citizenshipData.length) * citizenshipData.length,
        marker: {
          color: COLOR_LIST[index],
        },
      }
    })

  const genderPlot = (
    <BasicCard>
      <Typography variant="h6">{t("cases_visual.gender")}</Typography>
      <Plot
        data={isMobile ? genderBar : genderPie}
        layout={{
          title: null,
          font,
          showlegend: isMobile ? false : true,
          margin: { t: 0, l: 0, r: 0, b: 0, pad: 0 },
          height: isMobile ? 50 : "auto",
          barmode: "stack",
          hovermode: false,
          xaxis: {
            showline: false,
            showgrid: false,
            zeroline: false,
            showticklabels: false,
          },
          yaxis: {
            showline: false,
            showgrid: false,
            zeroline: false,
            showticklabels: false,
          },
        }}
        style={{ width: "100%" }}
        config={{ displayModeBar: false, staticPlot: true }}
      />
    </BasicCard>
  )
  const citizenPlot = (
    <BasicCard>
      <Typography variant="h6">{t("cases_visual.citizen")}</Typography>
      <Plot
        data={isMobile ? citizenBar : citizenPie}
        layout={{
          title: null,
          font,
          showlegend: isMobile ? false : true,
          margin: { t: 0, l: 0, r: 0, b: 0, pad: 0 },
          height: isMobile ? 30 * citizenshipData.length : "auto",
          barmode: "stack",
          hovermode: false,
          xaxis: {
            showline: false,
            showgrid: false,
            zeroline: false,
            showticklabels: false,
          },
          yaxis: {
            showline: false,
            showgrid: false,
            zeroline: false,
            showticklabels: false,
          },
        }}
        style={{ width: "100%" }}
        config={{ displayModeBar: false, staticPlot: true }}
      />
    </BasicCard>
  )

  const agePlot = (
    <BasicCard>
      <Typography variant="h6">{t("cases_visual.age")}</Typography>
      <AgeWrapper>
        <AgeBox>
          <AgeTitle>{t(`cases_visual.age_range_title`)}</AgeTitle>
          <Hidden mdUp>:&nbsp;</Hidden>
          <DataValue>{`${t(`cases_visual.age_range`, {
            min: WarsCaseData.ageArray[0].age,
            max: WarsCaseData.ageArray[WarsCaseData.ageArray.length - 1].age,
          })}`}</DataValue>
          <Hidden smDown>{t("cases_visual.age_unit")}</Hidden>
        </AgeBox>
        <AgeBox>
          <AgeTitle>{`${t(`cases_visual.average_age`, {
            gender: t(`dashboard.gender_${WarsCaseData.male.fieldValue}`),
          })}`}</AgeTitle>
          <Hidden mdUp>:&nbsp;</Hidden>
          <DataValue>{maleAgeAverage}</DataValue>
          <Hidden smDown>{t("cases_visual.age_unit")}</Hidden>
        </AgeBox>
        <AgeBox>
          <AgeTitle>{`${t(`cases_visual.average_age`, {
            gender: t(`dashboard.gender_${WarsCaseData.female.fieldValue}`),
          })}`}</AgeTitle>
          <Hidden mdUp>:&nbsp;</Hidden>
          <DataValue>{femaleAgeAverage}</DataValue>
          <Hidden smDown>{t("cases_visual.age_unit")}</Hidden>
        </AgeBox>
      </AgeWrapper>
    </BasicCard>
  )

  if (isMobile) {
    return (
      <>
        {genderPlot}
        {agePlot}
        {citizenPlot}
      </>
    )
  }

  return (
    <div>
      <PlotsWrapper container spacing={2}>
        <Grid item xs={4}>
          {genderPlot}
        </Grid>
        <AgeGrid item xs={4}>
          {agePlot}
        </AgeGrid>
        <Grid item xs={4}>
          {citizenPlot}
        </Grid>
      </PlotsWrapper>
    </div>
  )
}
