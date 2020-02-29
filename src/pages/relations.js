import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import { ResponsiveWrapper } from "@components/atoms/ResponsiveWrapper"
import MultiPurposeSearch from "@/components/modecules/MultiPurposeSearch"
import { createDedupOptions, createDedupArrayOptions } from "@/utils/search"
import { PageContent } from "../components/atoms/Container"
import { WarsCaseBoxContainer } from "@/components/organisms/CaseBoxContainer"
import _uniqby from "lodash.uniqby"
import _get from "lodash.get"

const RelationPage = props => {
  const { data } = props
  // Do the sorting here since case_no is string instead of int
  const cases = data.allWarsCase.edges.sort((edge1, edge2) => {
    const res = edge2.node.confirmation_date.localeCompare(
      edge1.node.confirmation_date
    )
    if (res === 0) {
      return parseInt(edge2.node.case_no) - parseInt(edge1.node.case_no)
    }
    return res
  })
  const groupMap = {}
  data.allWarsCaseRelation.edges.forEach(({ node }) => {
    groupMap[node.from_case_no] = {
      zh: _uniqby(
        [node.group_zh, ..._get(groupMap, `[${node.from_case_no}].zh`, [])],
        n => n.group_zh
      ),
      en: _uniqby(
        [node.group_en, ..._get(groupMap, `[${node.from_case_no}].en`, [])],
        n => n.group_en
      ),
    }
    groupMap[node.to_case_no] = {
      zh: _uniqby(
        [node.group_zh, ..._get(groupMap, `[${node.to_case_no}].zh`, [])],
        n => n.group_zh
      ),
      en: _uniqby(
        [node.group_en, ..._get(groupMap, `[${node.to_case_no}].en`, [])],
        n => n.group_en
      ),
    }
  })
  cases.forEach(({ node }) => {
    node.group_zh = _get(groupMap, `[${node.case_no}].zh`, [])
    node.group_en = _get(groupMap, `[${node.case_no}].en`, [])
  })
  const [filteredCases, setFilteredCases] = useState(cases)
  const { i18n, t } = useTranslation()
  const options = [
    {
      label: t("search.group"),
      options: createDedupArrayOptions(i18n, filteredCases, "group"),
    },
    {
      label: t("search.classification"),
      options: createDedupOptions(i18n, filteredCases, "classification"),
    },
    {
      label: t("search.citizenship"),
      options: createDedupOptions(i18n, filteredCases, "citizenship"),
    },
    {
      label: t("search.case_status"),
      options: createDedupOptions(i18n, filteredCases, "status"),
    },
    {
      label: t("search.hospital"),
      options: createDedupOptions(i18n, filteredCases, "hospital"),
    },
  ]

  const listFilteredHandler = list => {
    setFilteredCases(list)
  }

  return (
    <Layout>
      <SEO />
      <Typography variant="h2">{t("cases.title")}</Typography>
      <PageContent>
        <MultiPurposeSearch
          list={data.allWarsCase.edges}
          placeholder={t("search.case_placeholder")}
          options={options}
          searchKey="case"
          onListFiltered={listFilteredHandler}
          filterWithOr={false}
        />
      </PageContent>

      <ResponsiveWrapper>
        <WarsCaseBoxContainer filteredCases={filteredCases} />
      </ResponsiveWrapper>
    </Layout>
  )
}

export default RelationPage

export const RelationPageQuery = graphql`
  query {
    allWarsCase {
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
          source_url
        }
      }
    }
    allWarsCaseRelation {
      edges {
        node {
          from_case_no
          to_case_no
          relationship_zh
          relationship_en
          group_zh
          group_en
        }
      }
    }
  }
`
