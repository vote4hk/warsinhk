import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMediaQuery } from "react-responsive"
import styled from "styled-components"
import _get from "lodash.get"
import Typography from "@material-ui/core/Typography"
import MenuItem from "@material-ui/core/MenuItem"

import { bps } from "@/ui/theme"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { graphql } from "gatsby"
import MultiPurposeSearch from "@/components/molecules/MultiPurposeSearch"
import {
  createCasesOptions,
  createDedupOptions,
  createDedupArrayOptions,
} from "@/utils/search"
import { mapColorForStatus } from "@/utils/colorHelper"
import { PageContent } from "@/components/atoms/Container"
import { WarsCaseBoxContainer } from "@/components/organisms/CaseBoxContainer"
import { WarsCaseCard } from "@components/organisms/CaseCard"
import InfiniteScroll from "@/components/molecules/InfiniteScroll"
import ConfirmedCasesSummary from "@/components/molecules/ConfirmedCasesSummary"
import { ResponsiveWrapper } from "@components/atoms/ResponsiveWrapper"
import ContextStore from "@/contextStore"
import { CASES_BOX_VIEW, CASES_CARD_VIEW } from "@/reducers/cases"
import { Accordion } from "@components/atoms/Accordion"
import { DefaultSelect } from "@components/atoms/Select"
import MaleIcon from "@/components/icons/male.svg"
import FemaleIcon from "@/components/icons/female.svg"
import ImportIcon from "@/components/icons/import.svg"
import QuestionIcon from "@/components/icons/question.svg"
import BoxViewIcon from "@/components/icons/box_view.svg"
import CardViewIcon from "@/components/icons/card_view.svg"
import SortIcon from "@/components/icons/sort.svg"

const TwoColumnsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${bps.up("lg")} {
    flex-direction: row;

    > * {
      flex: 0 0 calc(50% - 20px);
    }
  }

  > ${ResponsiveWrapper} {
    height: 100%;

    ${bps.up("lg")} {
      margin-top: -16px;
      margin-left: 40px;

      > [class*="Card"] {
        flex: 0 0 calc(50% - 16px);
      }
    }
  }
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-self: center;
    cursor: pointer;
  }

  svg:first-child {
    margin-right: 16px;
  }

  svg g {
    fill: #d5d5d5;
  }

  svg.active g {
    fill: ${props => props.theme.palette.primary.main};
  }
`

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
  z-index: 1000;
  [class*="CaseCard"] {
    max-width: 800px;
  }

  ${bps.up("sm")} {
    padding-left: 260px;
  }
`

const LegendTitle = styled.div`
  display: flex;

  svg {
    width: 14px;
    height: 14px;
    display: inline-flex;
    align-self: center;
    margin-right: 6px;
  }

  span {
    font-weight: 700;
  }
`
const LegendContent = styled.div`
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 64px;
    margin: 0 24px 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    span {
      margin-top: 8px;
      font-size: 14px;
      font-weight: 700;
      line-height: 0.75rem;
    }
  }
`

const Circle = styled.div`
  height: ${props => props.height || 25}px;
  width: ${props => props.width || 25}px;
  background-color: ${props => props.bgColor || "#000"};
  border-radius: 50%;
  display: inline-block;
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
  // 1: by date   : from latest to oldest
  // 2: by date   : from oldest to latest
  // 3: by area   : from greatest to least
  // 4: by area   : from least to greatest
  // 5: by group  : from more to less
  // 6: by group  : from less to more
  // 7: by status

  const [selectedGroupButton, setGroupButton] = useState(1)

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
    {
      label: t("search.case_no"),
      options: createCasesOptions(filteredCases, "case_no"),
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

  const Legend = () => {
    const items = [
      {
        icon: <MaleIcon />,
        text: t("dashboard.gender_M"),
      },
      {
        icon: <FemaleIcon />,
        text: t("dashboard.gender_F"),
      },
      {
        icon: <ImportIcon />,
        text: t("cases.imported"),
      },
      {
        icon: (
          <Circle
            width={48}
            height={48}
            bgColor={mapColorForStatus("discharged").main}
          />
        ),
        text: t("cases.status_discharged"),
      },
      {
        icon: (
          <Circle
            width={48}
            height={48}
            bgColor={mapColorForStatus("hospitalised").main}
          />
        ),
        text: t("cases.status_hospitalised"),
      },
      {
        icon: (
          <Circle
            width={48}
            height={48}
            bgColor={mapColorForStatus("serious").main}
          />
        ),
        text: t("cases.status_serious"),
      },
      {
        icon: (
          <Circle
            width={48}
            height={48}
            bgColor={mapColorForStatus("critical").main}
          />
        ),
        text: t("cases.status_critical"),
      },
      {
        icon: (
          <Circle
            width={48}
            height={48}
            bgColor={mapColorForStatus("deceased").main}
          />
        ),
        text: t("cases.status_deceased"),
      },
    ]

    return (
      <Accordion
        style={{ marginBottom: 16 }}
        title={
          <LegendTitle>
            <QuestionIcon />
            <span>{t("cases.legend")}</span>
          </LegendTitle>
        }
        content={
          <LegendContent>
            {items.map((item, index) => (
              <div className="item" key={index}>
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </LegendContent>
        }
      />
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

  const isMobile = useMediaQuery({ maxWidth: 960 })

  return (
    <Layout
      onClick={e =>
        typeof e.target.className === "string" &&
        !e.target.className.includes("wars_box") &&
        setSelectedCase(null)
      }
    >
      <SEO title="ConfirmedCasePage" />
      <TitleContainer>
        <Typography variant="h2">{t("cases.title")}</Typography>
        <span>
          <BoxViewIcon
            className={view === CASES_BOX_VIEW ? "active" : ""}
            onClick={() => {
              dispatch({
                type: CASES_BOX_VIEW,
              })
            }}
          />
          <CardViewIcon
            className={view === CASES_CARD_VIEW ? "active" : ""}
            onClick={() => {
              dispatch({
                type: CASES_CARD_VIEW,
              })
            }}
          />
        </span>
      </TitleContainer>
      <PageContent>
        <ConfirmedCasesSummary />
        <TwoColumnsWrapper>
          <div>
            {view === CASES_BOX_VIEW && <Legend />}
            <MultiPurposeSearch
              list={data.allWarsCase.edges}
              placeholder={t("search.case_placeholder")}
              options={options}
              searchKey="case"
              onListFiltered={listFilteredHandler}
              filterWithOr={false}
            />
            {view === CASES_BOX_VIEW && (
              <DefaultSelect
                value={selectedGroupButton}
                onChange={event => setGroupButton(event.target.value)}
                displayEmpty
                IconComponent={SortIcon}
              >
                {toggleGroupingButtons.map((groupBy, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {t(groupBy)}
                  </MenuItem>
                ))}
              </DefaultSelect>
            )}
            {(view === CASES_BOX_VIEW || !isMobile) && (
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
              </>
            )}
          </div>
          {/* Hide and allow toggle for CASES_BOX_VIEW at mobile view */}
          {(view === CASES_CARD_VIEW || !isMobile) && (
            <ResponsiveWrapper>
              <InfiniteScroll
                list={filteredCases.map(c => c.node)}
                step={{ preload: preloadedCases }}
                onItem={renderCaseCard}
              />
            </ResponsiveWrapper>
          )}
        </TwoColumnsWrapper>
      </PageContent>
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
