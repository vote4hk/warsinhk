import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import styled from "styled-components"
import Layout from "@components/templates/Layout"
import { graphql } from "gatsby"
import MultiPurposeSearch from "@/components/modecules/MultiPurposeSearch"
import { createDedupOptions, createDedupArrayOptions } from "@/utils/search"
import { PageContent } from "../components/atoms/Container"
import { WarsCaseBoxContainer } from "@/components/organisms/CaseBoxContainer"
import { WarsCaseCard } from "@components/organisms/CaseCard"
import InfiniteScroll from "@/components/modecules/InfiniteScroll"
import ContextStore from "@/contextStore"
import { CASES_BOX_VIEW, CASES_CARD_VIEW } from "@/reducers/cases"
import { Button } from "@material-ui/core"
import _get from "lodash.get"

const SelectedCardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: -60px;
  background: rgba(0, 0, 0, 0.15);
  padding: 0 24px;

  [class*="CaseCard"] {
    max-width: 800px;
  }
`

const RelationPage = props => {
  const { data } = props
  const {
    cases: {
      dispatch,
      state: { view },
    },
  } = React.useContext(ContextStore)

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

  const groupArray = []
  data.allWarsCaseRelation.edges.forEach(({ node }, id) => {
    node.id = id + 1
    node.case_no.split(",").forEach(nodeCase => {
      groupArray.push({
        ...node,
        case_no: nodeCase,
      })
    })
  })

  cases.forEach(({ node }) => {
    const groupKeys = [
      "name_zh",
      "name_en",
      "description_zh",
      "description_en",
      "id",
    ]
    groupKeys.forEach(k => {
      node[`group_${k}`] = _get(
        groupArray.find(g => g.case_no === node.case_no),
        k,
        null
      )
    })
  })

  const [filteredCases, setFilteredCases] = useState(cases)
  const [selectedCase, setSelectedCase] = useState(null)
  const { i18n, t } = useTranslation()
  const options = [
    {
      label: t("search.group"),
      options: createDedupArrayOptions(i18n, filteredCases, "group_name"),
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

  // Calculate how much cards we should preload in order to scorll to that position
  let preloadedCases = cases.length - parseInt(selectedCase) + 1
  if (isNaN(preloadedCases)) {
    preloadedCases = 15
  }

  const listFilteredHandler = list => {
    setFilteredCases(list)
  }

  const renderCaseCard = node => (
    <WarsCaseCard
      node={node}
      i18n={i18n}
      t={t}
      key={node.case_no}
      // isSelected={selectedCase === item.node.case_no}
      // ref={selectedCase === item.node.case_no ? selectedCard : null}
      // patientTrack={data.patient_track.group.filter(
      //   t => t.fieldValue === node.case_no
      // )}
    />
  )

  const handleBoxClick = item => setSelectedCase(item)

  return (
    <Layout
      onClick={e =>
        e.target.className &&
        !e.target.className.includes("wars_box") &&
        setSelectedCase(null)
      }
    >
      <SEO />
      <PageContent>
        <Button
          style={{ marginBottom: 8 }}
          variant="outlined"
          color="primary"
          size="small"
          // startIcon={}
          onClick={() => {
            dispatch({
              type: view === CASES_CARD_VIEW ? CASES_BOX_VIEW : CASES_CARD_VIEW,
            })
            // trackCustomEvent({
            //   category: "about_us",
            //   action: "click",
            //   label: "https://www.facebook.com/vote4hongkong/",
            // })
          }}
        >
          {view === CASES_BOX_VIEW ? t("cases.card_view") : t("cases.box_view")}
        </Button>
        <MultiPurposeSearch
          list={data.allWarsCase.edges}
          placeholder={t("search.case_placeholder")}
          options={options}
          searchKey="case"
          onListFiltered={listFilteredHandler}
          filterWithOr={false}
        />
      </PageContent>
      {view === CASES_BOX_VIEW ? (
        <>
          <WarsCaseBoxContainer
            filteredCases={filteredCases}
            handleBoxClick={handleBoxClick}
          />
          {selectedCase && (
            <SelectedCardContainer>
              {renderCaseCard(selectedCase)}
            </SelectedCardContainer>
          )}
        </>
      ) : (
        <InfiniteScroll
          list={filteredCases.map(c => c.node)}
          step={{ mobile: 5, preload: preloadedCases }}
          onItem={renderCaseCard}
        />
      )}
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
          case_no
          name_zh
          name_en
          description_zh
          description_en
        }
      }
    }
    patient_track: allWarsCaseLocation(
      sort: { order: DESC, fields: end_date }
    ) {
      group(field: case___case_no) {
        fieldValue
        edges {
          node {
            case_no
            start_date
            end_date
            location_zh
            location_en
            action_zh
            action_en
            remarks_zh
            remarks_en
            source_url_1
            source_url_2
          }
        }
      }
    }
  }
`
