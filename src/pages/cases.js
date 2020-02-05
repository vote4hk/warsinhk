import React, { useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import { WarsCaseCard } from "@components/organisms/CaseCard"
import { isSSR } from "@/utils"

const ConfirmedCasePage = props => {
  const { data, location } = props
  const { i18n, t } = useTranslation()
  const selectedCard = useRef(null)
  const scrollToCard = () => {
    if (isSSR()) return
    setTimeout(() => {
      window.scrollTo(
        0,
        selectedCard.current.offsetTop - selectedCard.current.clientHeight / 2
      )
    }, 300)
  }

  data.allWarsCase.edges.sort(
    (a, b) => parseInt(b.node.case_no) - parseInt(a.node.case_no)
  )

  let selectedCase = ""
  if (location.hash) {
    selectedCase = location.hash.replace(/^#/, "")
  }

  useEffect(() => {
    if (selectedCase) {
      scrollToCard()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <SEO title="ConfirmedCasePage" />
      <Typography variant="h2">{t("cases.title")}</Typography>
      {data.allWarsCase.edges.map(item => (
        <WarsCaseCard
          node={item.node}
          i18n={i18n}
          t={t}
          key={item.node.case_no}
          isSelected={selectedCase === item.node.case_no}
          ref={selectedCase === item.node.case_no ? selectedCard : null}
        />
      ))}
    </Layout>
  )
}

export default ConfirmedCasePage

export const ConfirmedCaseQuery = graphql`
  query {
    allWarsCase(
      sort: { order: DESC, fields: case_no }
      filter: { enabled: { eq: "Y" } }
    ) {
      edges {
        node {
          case_no
          confirmation_date
          gender
          age
          hospital_zh
          hospital_en
          status_zh
          status_en
          type_zh
          type_en
          citizenship_zh
          citizenship_en
          detail_zh
          detail_en
          source_url
        }
      }
    }
  }
`
