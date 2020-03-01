import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@material-ui/core"
import styled from "styled-components"
import { mapColorForStatus } from "@/utils/colorHelper"

const SummaryBox = styled(Box)`
  margin: 10px 0px;
  p {
    margin-right: 8px;
  }
`

const ConfirmedCasesSummary = props => {
  const {
    status: { group: status },
  } = useStaticQuery(
    graphql`
      query {
        status: allWarsCase(filter: { type_en: { eq: "Confirmed" } }) {
          group(field: status) {
            totalCount
            fieldValue
          }
        }
      }
    `
  )

  const { t } = useTranslation()

  const statusOrdering = {
    deceased: 10,
    critical: 20,
    serious: 30,
    hospitalised: 40,
    discharged: 50,
  }

  return (
    <SummaryBox>
      {status
        .sort(
          (a, b) => statusOrdering[a.fieldValue] - statusOrdering[b.fieldValue]
        )
        .map((v, i) => (
          <Typography
            key={i}
            display="inline"
            variant="body2"
            style={{
              color: mapColorForStatus(v.fieldValue).main,
              fontWeight: 600,
              marginRight: "0.5rem",
            }}
          >
            {t(`cases.status_${v.fieldValue}`)}：{v.totalCount}
          </Typography>
        ))}
    </SummaryBox>
  )
}

export default ConfirmedCasesSummary
