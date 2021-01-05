import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@material-ui/core"
import styled from "styled-components"
import { mapColorForStatus } from "@/utils/colorHelper"

const SummaryBox = styled(Box)`
  margin: 16px 0px;
  line-height: 1.5rem;

  p {
    margin-right: 12px;
    display: inline-block;
  }
`

const NumberTag = styled.span`
  display: inline-block;
  color: ${props => props.tagcolor};
  font-size: 0.8rem;
  font-weight: 700;
  background-color: ${props => props.color};
  padding: 0px 6px;
  margin-left: 6px;
  border-radius: 6px;
`

const ConfirmedCasesSummary = props => {
  let {
    status: { group: status },
    asymptomatic: { group: asymptomatic },
  } = useStaticQuery(
    graphql`
      query {
        status: allWarsCase {
          group(field: status) {
            totalCount
            fieldValue
          }
        }
        asymptomatic: allWarsCase(
          filter: { onset_date: { in: ["asymptomatic", "none"] } }
        ) {
          group(field: onset_date) {
            fieldValue
            totalCount
          }
        }
      }
    `
  )

  // count the "none" also
  asymptomatic = [
    asymptomatic.reduce(
      (c, v) => ({
        fieldValue: "asymptomatic",
        totalCount: c.totalCount + v.totalCount,
      }),
      {
        fieldValue: "asymptomatic",
        totalCount: 0,
      }
    ),
  ]

  status = [...status, asymptomatic[0]]

  const { t } = useTranslation()

  const statusOrdering = {
    discharged: 10,
    pending_admission: 20,
    stable: 30,
    hospitalised_again: 35,
    serious: 40,
    critical: 50,
    deceased: 60,
    no_admission: 65,
    asymptomatic: 70,
    "": 80,
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
              key={`${i}-${v.fieldValue}`}
              display="inline"
              variant="body2"
              style={{
                color,
                fontWeight: 600,
                marginRight: "0.6rem",
              }}
            >
              {t(`cases.status_${v.fieldValue}`)}
              <NumberTag
                color={color}
                tagcolor={mapColorForStatus(v.fieldValue).contrastText}
              >
                {v.totalCount}
              </NumberTag>
            </Typography>
          )
        })}
    </SummaryBox>
  )
}

export default ConfirmedCasesSummary
