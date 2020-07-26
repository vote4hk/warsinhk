import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Button from "@material-ui/core/Button"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import DistrictsChart from "@/components/charts/18Districts"
import capitalize from "lodash/capitalize"
import * as lbFilter from "my-loopback-filter"
import { calculatePastNdays } from "@/utils/search"

const MapCard = styled.div``
export default function ConfirmedCaseVisual(props) {
  const [filter14Days, setFilter14Days] = useState(true)
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
                case_no
                confirmation_date
                citizenship_district_zh
                citizenship_district_en
              }
            }
          }
        }
      }
    `
  )

  const citizenshipDistrictinPast14days = citizenshipDistrict.map(cd => {
    const casesIn14Days = cd.edges.filter(
      c =>
        !calculatePastNdays(
          {
            case_no: c.node.case_no,
            date: c.node.confirmation_date,
          },
          14
        )
    )

    return {
      totalCount: casesIn14Days.length,
      fieldValue: cd.fieldValue,
      edges: casesIn14Days,
    }
  })

  const data = lbFilter.applyLoopbackFilter(
    filter14Days ? citizenshipDistrictinPast14days : citizenshipDistrict,
    {
      where: { fieldValue: { nin: ["不明", "境外", "香港"] } },
      order: "totalCount DESC",
    }
  )

  const increment = Math.ceil(
    10 ** Math.floor(Math.log10(data[0].totalCount)) * 0.5
  )
  const citizenPlot = (
    <MapCard>
      <ButtonGroup aria-label="small button group">
        <Button
          size="small"
          variant={!filter14Days && "contained"}
          color={!filter14Days && "primary"}
          onClick={() => setFilter14Days(false)}
        >
          {t("dashboard.case_highlights_all")}
        </Button>
        <Button
          size="small"
          variant={filter14Days && "contained"}
          color={filter14Days && "primary"}
          onClick={() => setFilter14Days(true)}
        >
          {t("dashboard.case_highlights_past14days")}
        </Button>
      </ButtonGroup>
      <DistrictsChart
        scale={[0, Math.ceil(data[0].totalCount / increment) * increment]}
        getDescriptionByDistrictName={(tcName, enName) => {
          const node = data.find(i => tcName.indexOf(i.fieldValue) === 0)
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
          const node = data.find(i => tcName.indexOf(i.fieldValue) === 0)
          const value = node ? node.totalCount : 0
          return value
        }}
      />
    </MapCard>
  )

  return <>{citizenPlot}</>
}
