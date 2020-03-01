import React from "react"
import { useTranslation } from "react-i18next"
import { useMediaQuery } from "react-responsive"
import { useStaticQuery, graphql } from "gatsby"
import Chart from "@components/atoms/Chart"

export default props => {
  const { t } = useTranslation()

  const {
    genderAge: { group: genderAge },
  } = useStaticQuery(
    graphql`
      query {
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
    genderAge,
    female: genderAge.find(age => age.fieldValue === "F"),
    male: genderAge.find(age => age.fieldValue === "M"),
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
    <>
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
    </>
  )

  return <>{genderPlot}</>
}
