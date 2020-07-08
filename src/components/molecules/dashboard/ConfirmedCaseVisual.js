import React from "react"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import DistrictsChart from "@/components/charts/18Districts"
import capitalize from "lodash/capitalize"

const MapCard = styled.div``
export default function ConfirmedCaseVisual(props) {
  const { i18n, t } = useTranslation()

  const {
    citizenshipDistrict: { group: citizenshipDistrict },
  } = useStaticQuery(
    graphql`
      query {
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
  const citizenPlot = (
    <MapCard>
      <DistrictsChart
        scale={[
          0,
          Math.max.apply(
            null,
            citizenshipDistrict
              .filter(
                i =>
                  !(
                    i.fieldValue === "不明" ||
                    i.fieldValue === "境外" ||
                    i.fieldValue === "香港"
                  )
              )
              .map(i => i.totalCount)
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

  return <>{citizenPlot}</>
}
