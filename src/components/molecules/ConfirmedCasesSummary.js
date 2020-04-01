import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@material-ui/core"
import styled from "styled-components"
import { mapColorForStatus } from "@/utils/colorHelper"

const SummaryBox = styled(Box)`
  margin: 16px 0px;
  p {
    margin-right: 12px;
  }
`

const NumberTag = styled.span`
  display: inline-block;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  background-color: ${props => props.color};
  padding: 0px 6px;
  margin-left: 6px;
  border-radius: 6px;
`

const ConfirmedCasesSummary = props => {
  const {
    status: { group: status },
  } = useStaticQuery(
    graphql`
      query {
        status: allWarsCase {
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
    discharged: 10,
    pending_admission: 20,
    hospitalised: 30,
    serious: 40,
    critical: 50,
    deceased: 60,
    "": 70,
  }

  return (
    <SummaryBox>
      {status
        .sort(
          (a, b) => statusOrdering[a.fieldValue] - statusOrdering[b.fieldValue]
        )
        .map((v, i) => {
          const color = mapColorForStatus(v.fieldValue).main
          return (
            <Typography
              key={i}
              display="inline"
              variant="body2"
              style={{
                color,
                fontWeight: 600,
                marginRight: "0.6rem",
              }}
            >
              {t(`cases.status_${v.fieldValue}`)}
              <NumberTag color={color}>{v.totalCount}</NumberTag>
            </Typography>
          )
        })}
    </SummaryBox>
  )
}

export default ConfirmedCasesSummary
