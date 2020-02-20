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
import { Hidden } from "@material-ui/core"
import { bps } from "@/ui/theme"
import { median } from "@/utils"

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

const DistrictGridsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, auto);
  gap: 6px;
`

const DistrictGrid = styled.div`
  position: relative;
  background-color: white;
  font-weight: bold;
  text-align: center;
  padding: 0.6em 0.3em;
  margin-top: 0.25em;
  border-top: 3px solid ${props => props.color};
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
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
          columns: ["male", "female"].map(gender => [
            t(`dashboard.gender_${WarsCaseData[gender].fieldValue}`),
            WarsCaseData[gender].totalCount,
          ]),
          labels: isMobile,
          type: isMobile ? "bar" : "donut",
          groups: isMobile
            ? [
                ["male", "female"].map(gender =>
                  t(`dashboard.gender_${WarsCaseData[gender].fieldValue}`)
                ),
              ]
            : undefined,
        }}
        color={{ pattern: GENDER_COLOR_LIST }}
        bar={bar}
        size={isMobile ? { height: 100 } : undefined}
        tooltip={{
          grouped: false,
          format: {
            title: () => t("cases_visual.gender"),
          },
        }}
        axis={axis}
      />
    </BasicCard>
  )

  const sortedCitizenshipData = citizenshipData.sort(
    (a, b) => b.totalCount - a.totalCount
  )

  function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * COLOR_LIST.length)
    return COLOR_LIST[randomIndex]
  }

  const citizenPlot = isMobile ? (
    <DistrictGridsWrapper>
      {sortedCitizenshipData.map(c => (
        <DistrictGrid color={getRandomColor()}>
          <Typography variant="h4">{c.totalCount}</Typography>
          <p>{c.fieldValue}</p>
        </DistrictGrid>
      ))}
    </DistrictGridsWrapper>
  ) : (
    <BasicCard>
      <Typography variant="h6">{t("cases_visual.citizen")}</Typography>
      <Chart
        data={{
          columns: sortedCitizenshipData.map(c => [c.fieldValue, c.totalCount]),
          type: "donut",
          labels: true,
        }}
        color={{ pattern: COLOR_LIST }}
        tooltip={{
          grouped: false,
          format: {
            title: () => t("cases_visual.citizen"),
          },
        }}
        bar={bar}
        axis={axis}
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
          <AgeTitle>{`${t(`cases_visual.median_age`, {
            gender: t(`dashboard.gender_${WarsCaseData.male.fieldValue}`),
          })}`}</AgeTitle>
          <Hidden mdUp>:&nbsp;</Hidden>
          <DataValue>
            {median(
              WarsCaseData.male.edges
                .filter(e => e.node.age)
                .map(e => parseInt(e.node.age))
            )}
          </DataValue>
          <Hidden smDown>{t("cases_visual.age_unit")}</Hidden>
        </AgeBox>
        <AgeBox>
          <AgeTitle>{`${t(`cases_visual.median_age`, {
            gender: t(`dashboard.gender_${WarsCaseData.female.fieldValue}`),
          })}`}</AgeTitle>
          <Hidden mdUp>:&nbsp;</Hidden>
          <DataValue>
            {median(
              WarsCaseData.female.edges
                .filter(e => e.node.age)
                .map(e => parseInt(e.node.age))
            )}
          </DataValue>
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
