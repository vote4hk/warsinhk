import React, { useRef, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import { WarsCaseCard } from "@components/organisms/CaseCard"
import { isSSR } from "@/utils"
import { ResponsiveWrapper } from "@components/atoms/ResponsiveWrapper"
import InfiniteScroll from "@/components/modecules/InfiniteScroll"
import MultiPurposeSearch from "@/components/modecules/MultiPurposeSearch"
import { createDedupOptions } from "@/utils/search"
import { PageContent } from "../components/atoms/Container"

const ConfirmedCasePage = props => {
  const { data, location } = props
  const [filteredCases, setFilteredCases] = useState(data.allWarsCase.edges)
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

  const options = [
    {
      label: t("search.hospital"),
      options: createDedupOptions(i18n, data.allWarsCase.edges, "hospital"),
    },
    {
      label: t("search.citizenship"),
      options: createDedupOptions(i18n, data.allWarsCase.edges, "citizenship"),
    },
    {
      label: t("search.case_status"),
      options: createDedupOptions(i18n, data.allWarsCase.edges, "status"),
    },
  ]

  return (
    <Layout>
      <SEO title="ConfirmedCasePage" />
      <Typography variant="h2">{t("cases.title")}</Typography>
      <PageContent>
        <MultiPurposeSearch
          list={data.allWarsCase.edges}
          placeholder={t("search.case_placeholder")}
          options={options}
          searchKey="high_risk"
          onListFiltered={list => {
            setFilteredCases(list)
          }}
        />
      </PageContent>

      <ResponsiveWrapper>
        <InfiniteScroll
          list={filteredCases}
          step={{ mobile: 5, preload: 15 }}
          onItem={(item, index) => (
            <WarsCaseCard
              node={item.node}
              i18n={i18n}
              t={t}
              key={item.node.case_no}
              isSelected={selectedCase === item.node.case_no}
              ref={selectedCase === item.node.case_no ? selectedCard : null}
            />
          )}
        />
      </ResponsiveWrapper>
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
          source_url
        }
      }
    }
  }
`
