import React from "react"
import { useTranslation } from "react-i18next"
import { useStaticQuery, graphql } from "gatsby"
import { WarsCaseCard } from "@components/organisms/CaseCard"

export default function ConfirmedCaseVisual(props) {
  const { i18n, t } = useTranslation()

  const data = useStaticQuery(
    graphql`
      query {
        allWarsCase(
          sort: { order: [DESC, DESC], fields: [confirmation_date, case_no] }
          limit: 5
        ) {
          edges {
            node {
              case_no
              onset_date
              confirmation_date
              gender
              age
              hospital_zh
              hospital_en
              status
              status_zh
              status_en
              type_zh
              type_en
              citizenship_zh
              citizenship_en
              detail_zh
              detail_en
              classification
              classification_zh
              classification_en
              source_url_1
              source_url_2
            }
          }
        }
      }
    `
  )

  const latestCases = data.allWarsCase.edges
    .sort((a, b) => parseInt(b.node.case_no) - parseInt(a.node.case_no))
    .filter(
      c =>
        c.node.confirmation_date ===
        data.allWarsCase.edges[0].node.confirmation_date
    )

  // since useStateQuery cannot pass variables, hence we do the filtering here
  return (
    <>
      {latestCases.map(item => (
        <WarsCaseCard
          key={item.node.case_no}
          node={item.node}
          showViewMore={true}
          i18n={i18n}
          t={t}
        />
      ))}
    </>
  )
}
