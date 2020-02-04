import React from "react"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import { useMediaQuery } from "react-responsive"
import { useStaticQuery, graphql } from "gatsby"
import { withLanguage } from "../../utils/i18n"
import Chart from "@components/atoms/Chart"
import styled from "styled-components"
import { BasicCard } from "@components/atoms/Card"
import { Row } from "@components/atoms/Row"
import Box from "@material-ui/core/Box"

const DataValue = styled(Typography)`
  font-size: 48px;
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

  const GENDER_COLOR_LIST = ["#006266", "#ED4C67"]

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

  const axis = isMobile
    ? {
        rotated: true,
        x: {
          show: false,
        },
        y: {
          show: false,
        },
      }
    : undefined
  const bar = isMobile
    ? {
        width: 30,
      }
    : undefined

  const genderPlot = (
    <BasicCard>
      <Typography variant="h6">{t("cases_visual.gender")}</Typography>
      <Chart
        data={{
          columns: ["female", "male"].map(gender => [
            t(`dashboard.gender_${WarsCaseData[gender].fieldValue}`),
            WarsCaseData[gender].totalCount,
          ]),
          labels: isMobile,
          type: isMobile ? "dount" : "bar",
        }}
        color={{ pattern: GENDER_COLOR_LIST }}
        bar={bar}
        size={isMobile ? { height: 100 } : undefined}
        tooltip={{
          grouped: false,
        }}
        axis={axis}
      />
    </BasicCard>
  )
  const citizenPlot = (
    <BasicCard>
      <Typography variant="h6">{t("cases_visual.citizen")}</Typography>
      <Chart
        data={{
          columns: citizenshipData.map(c => [c.fieldValue, c.totalCount]),
          type: isMobile ? "bar" : "donut",
          labels: isMobile,
        }}
        color={{ pattern: COLOR_LIST }}
        tooltip={{
          grouped: false,
        }}
        bar={bar}
        size={
          isMobile ? { height: 40 + 30 * citizenshipData.length } : undefined
        }
        axis={axis}
      />
    </BasicCard>
  )

  const agePlot = (
    <>
      {isMobile ? (
        <BasicCard>
          <Typography variant="h6">{t("cases_visual.age")}</Typography>
          <Row>
            <Box>
              {`${t(`cases_visual.age_range_mobile`, {
                min: WarsCaseData.ageArray[0].age,
                max:
                  WarsCaseData.ageArray[WarsCaseData.ageArray.length - 1].age,
              })}`}
            </Box>
            <Box>
              {`${t(`cases_visual.average_age_mobile`, {
                gender: t(`dashboard.gender_${WarsCaseData.male.fieldValue}`),
              })}`}
              {maleAgeAverage}
            </Box>
            <Box>
              {`${t(`cases_visual.average_age_mobile`, {
                gender: t(`dashboard.gender_${WarsCaseData.female.fieldValue}`),
              })}`}
              {femaleAgeAverage}
            </Box>
          </Row>
        </BasicCard>
      ) : (
        <BasicCard>
          <Typography variant="h6">{t("cases_visual.age")}</Typography>
          <Grid container align="center">
            <Grid item lg={6} md={12}>
              <Typography variant="h4" align="center">
                {t(`cases_visual.age_range_title`)}
              </Typography>
              <DataValue component="span">
                {`${t(`cases_visual.age_range`, {
                  min: WarsCaseData.ageArray[0].age,
                  max:
                    WarsCaseData.ageArray[WarsCaseData.ageArray.length - 1].age,
                })}`}
              </DataValue>
              <span>{t("cases_visual.age_unit")}</span>
            </Grid>
            <Grid item lg={3} md={6}>
              <Typography variant="h4" align="center">
                {`${t(`cases_visual.average_age`, {
                  gender: t(`dashboard.gender_${WarsCaseData.male.fieldValue}`),
                })}`}
              </Typography>
              <DataValue component="span">{maleAgeAverage}</DataValue>
              <span>{t("cases_visual.age_unit")}</span>
            </Grid>
            <Grid item lg={3} md={6}>
              <Typography variant="h4" align="center">
                {`${t(`cases_visual.average_age`, {
                  gender: t(
                    `dashboard.gender_${WarsCaseData.female.fieldValue}`
                  ),
                })}`}
              </Typography>
              <DataValue component="span">{femaleAgeAverage}</DataValue>
              <span>{t("cases_visual.age_unit")}</span>
            </Grid>
          </Grid>
        </BasicCard>
      )}
    </>
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
    <div container>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {genderPlot}
        </Grid>
        <Grid item xs={4}>
          {agePlot}
        </Grid>
        <Grid item xs={4}>
          {citizenPlot}
        </Grid>
      </Grid>
    </div>
  )
}
