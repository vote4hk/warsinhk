import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useTranslation } from "react-i18next"
import { Label } from "../atoms/Text"
import styled from "styled-components"

const BoldLabel = styled(Label)`
   {
    font-weight: 700;
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

  return (
    <React.Fragment>
      <BoldLabel display="inline">患者狀態摘要：</BoldLabel>
      <Label display="inline">
        {status
          .map(v => t(`cases.status_${v.fieldValue}`) + "：" + v.totalCount)
          .join("　")}
      </Label>
    </React.Fragment>
  )
}

export default ConfirmedCasesSummary
