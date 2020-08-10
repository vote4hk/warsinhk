import React from "react"
import { useTranslation } from "react-i18next"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import { Row } from "@components/atoms/Row"
import Box from "@material-ui/core/Box"
import { Hidden } from "@material-ui/core"
import { bps } from "@/ui/theme"
import { median } from "@/utils"
import { BasicCard } from "@components/atoms/Card"

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

export default function ConfirmedCaseVisual(props) {
  const { t } = useTranslation()

  const {
    age: { nodes: ageArray },
    genderAge: { group: genderAge },
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
      }
    `
  )
  const WarsCaseData = {
    ageArray,
    genderAge,

    female: genderAge.find(age => age.fieldValue === "F"),
    male: genderAge.find(age => age.fieldValue === "M"),
  }

  const ageNumberArray = WarsCaseData.ageArray.map(a => +a.age)

  const agePlot = (
    <>
      <BasicCard>
        <AgeWrapper>
          <AgeBox>
            <AgeTitle>{t(`cases_visual.age_range_title`)}</AgeTitle>
            <Hidden mdUp>:&nbsp;</Hidden>
            <DataValue>{`${t(`cases_visual.age_range`, {
              min: ageNumberArray[0],
              max: ageNumberArray[WarsCaseData.ageArray.length - 1],
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
    </>
  )

  return <>{agePlot}</>
}
