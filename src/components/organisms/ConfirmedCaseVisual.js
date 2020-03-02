import React from "react"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import { useMediaQuery } from "react-responsive"
import { useStaticQuery, graphql } from "gatsby"
import Chart from "@components/atoms/Chart"
import styled from "styled-components"
import { BasicCard } from "@components/atoms/Card"
import { Row } from "@components/atoms/Row"
import Box from "@material-ui/core/Box"
import { Hidden } from "@material-ui/core"
import { bps } from "@/ui/theme"
import { median } from "@/utils"
import DistrictsChart from "@/components/charts/18Districts"
import capitalize from "lodash/capitalize"

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
  flex-direction: row;

  ${bps.between("md", "lg")} {
    flex-direction: column;
  }

  ${bps.up("lg")} {
    flex-direction: row;
  }
`

const AgeBox = styled(Box)`
  ${bps.up("md")} {
    text-align: center;
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
const MapCard = styled.div``
export default function ConfirmedCaseVisual(props) {
  const { i18n, t } = useTranslation()

  const {
    age: { nodes: ageArray },
    genderAge: { group: genderAge },
    citizenshipZh: { group: citizenship_zh },
    citizenshipEn: { group: citizenship_en },
    citizenshipDistrict: { group: citizenshipDistrict },
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
        citizenshipDistrict: allWarsCase(
          filter: { type_en: { eq: "Confirmed" } }
        ) {
          group(field: citizenship_district_zh) {
            totalCount
            fieldValue
            edges {
              node {
                citizenship_district_zh
                citizenship_district_en
              }
            }
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
    citizenshipDistrict,
  }

  const isMobile = useMediaQuery({ maxWidth: 960 })

  const GENDER_COLOR_LIST = ["#006266", "#ED4C67"]

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
                ["male", "female"].map(gender => [
                  t(`dashboard.gender_${WarsCaseData[gender].fieldValue}`),
                ]),
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

  const citizenPlot = (
    <MapCard>
      <Typography variant="h6">{t("cases_visual.distribution")}</Typography>
      <DistrictsChart
        scale={[
          0,
          Math.max.apply(
            null,
            citizenshipDistrict.map(i => i.totalCount)
          ),
        ]}
        values={citizenshipDistrict.map(i => i.totalCount)}
        getDescriptionByDistrictName={(tcName, enName) => {
          const node = citizenshipDistrict.find(
            i => tcName.indexOf(i.fieldValue) === 0
          )
          const value = node ? node.totalCount : 0
          const name =
            i18n.language !== "zh"
              ? enName.split` `.map(capitalize).join` `
              : tcName
          return `${name}: ${value}`
        }}
        legendTitle={
          <Typography variant="body2">
            {t("cases_visual.legendTitle")}
          </Typography>
        }
        getDataByDistrictName={tcName => {
          const node = citizenshipDistrict.find(
            i => tcName.indexOf(i.fieldValue) === 0
          )
          const value = node ? node.totalCount : 0
          return value
        }}
      />
    </MapCard>
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
        {citizenPlot}
        {genderPlot}
        {agePlot}
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
