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
      <BoldLabel display="inline">
        {t("confirmed_case_summary.status_summary")}：
      </BoldLabel>
      <Label display="inline">
        {status
          .sort((a, b) => b.totalCount - a.totalCount)
          .map(v => t(`cases.status_${v.fieldValue}`) + "：" + v.totalCount)
          .join("　")}
      </Label>
    </React.Fragment>
  )
}

export default ConfirmedCasesSummary
