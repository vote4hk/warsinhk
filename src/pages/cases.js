import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import _get from "lodash.get"
import Typography from "@material-ui/core/Typography"
import { Button } from "@material-ui/core"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"

import { bps } from "@/ui/theme"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { graphql } from "gatsby"
import MultiPurposeSearch from "@/components/molecules/MultiPurposeSearch"
import { createDedupOptions, createDedupArrayOptions } from "@/utils/search"
import { PageContent } from "@/components/atoms/Container"
import {
  WarsCaseBoxContainer,
  WarsCaseBoxLegend,
} from "@/components/organisms/CaseBoxContainer"
import { WarsCaseCard } from "@components/organisms/CaseCard"
import InfiniteScroll from "@/components/molecules/InfiniteScroll"
import ConfirmedCasesSummary from "@/components/molecules/ConfirmedCasesSummary"
import { ResponsiveWrapper } from "@components/atoms/ResponsiveWrapper"
import ContextStore from "@/contextStore"
import { CASES_BOX_VIEW, CASES_CARD_VIEW } from "@/reducers/cases"
import Dialog from "@/components/atoms/Dialog"

const SelectedCardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: -60px;
  background: rgba(0, 0, 0, 0.15);
  padding: 0 24px;
  [class*="CaseCard"] {
    max-width: 800px;
  }

  ${bps.up("sm")} {
    padding-left: 260px;
  }
`

const SortedSelect = styled(Select)`
  width: 100%;
  background-color: white;
  font-size: 12px;
  padding: 4px 6px;
  margin: 8px 0;
  border: 1px solid hsl(0, 0%, 80%);

  &::before {
    content: none;
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
        related_cases: node.case_no,
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
      "related_cases",
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
  const [showLegend, setShowLegend] = useState(false)
  // 1: by date   : from latest to oldest
  // 2: by date   : from oldest to latest
  // 3: by area   : from greatest to least
  // 4: by area   : from least to greatest
  // 5: by group  : from more to less
  // 6: by group  : from less to more
  // 7: by status

  const [selectedGroupButton, setGroupButton] = useState(1)

  const handleClickOpen = () => {
    setShowLegend(true)
  }
  const handleClose = () => {
    setShowLegend(false)
  }

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
      patientTrack={data.patient_track.group.filter(
        t => t.fieldValue === node.case_no
      )}
      handleClose={
        view === CASES_BOX_VIEW ? e => setSelectedCase(null) : undefined
      }
    />
  )

  const LegendContent = i18n => {
    return (
      <>
        <WarsCaseBoxLegend
          caseGroup={data.allWarsCaseRelation.edges}
          i18n={i18n}
        />
      </>
    )
  }

  const toggleGroupingButtons = [
    "cases.toggle_date",
    "cases.toggle_date_reverse",
    "cases.toggle_area",
    "cases.toggle_area_reverse",
    "cases.toggle_group",
    "cases.toggle_group_reverse",
    "cases.toggle_status",
  ]

  const handleBoxClick = item => setSelectedCase(item)

  return (
    <Layout
      onClick={e =>
        typeof e.target.className === "string" &&
        !e.target.className.includes("wars_box") &&
        setSelectedCase(null)
      }
    >
      <SEO title="ConfirmedCasePage" />
      <Typography variant="h2">{t("cases.title")}</Typography>
      <PageContent>
        <ConfirmedCasesSummary />
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
        <Button
          style={{ marginBottom: 8 }}
          variant="outlined"
          color="primary"
          size="small"
          // startIcon={}
          onClick={handleClickOpen}
        >
          {t("cases.legend")}
        </Button>
        <MultiPurposeSearch
          list={data.allWarsCase.edges}
          placeholder={t("search.case_placeholder")}
          options={options}
          searchKey="case"
          onListFiltered={listFilteredHandler}
          filterWithOr={false}
        />
        <SortedSelect
          value={selectedGroupButton}
          onChange={event => setGroupButton(event.target.value)}
          displayEmpty
        >
          {toggleGroupingButtons.map((groupBy, index) => (
            <MenuItem value={index + 1}>{t(groupBy)}</MenuItem>
          ))}
        </SortedSelect>
      </PageContent>
      {view === CASES_BOX_VIEW ? (
        <>
          <WarsCaseBoxContainer
            filteredCases={filteredCases}
            handleBoxClick={handleBoxClick}
            selectedGroupButton={selectedGroupButton}
          />
          {selectedCase && (
            <SelectedCardContainer>
              {renderCaseCard(selectedCase)}
            </SelectedCardContainer>
          )}
          <Dialog
            open={showLegend}
            handleClose={handleClose}
            title={t("cases.legend")}
            content={<LegendContent i18n={i18n} />}
          />
        </>
      ) : (
        <ResponsiveWrapper>
          <InfiniteScroll
            list={filteredCases.map(c => c.node)}
            step={{ mobile: 5, preload: preloadedCases }}
            onItem={renderCaseCard}
          />
        </ResponsiveWrapper>
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
