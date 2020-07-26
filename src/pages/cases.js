import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import _get from "lodash.get"
import _groupBy from "lodash/groupBy"
import Typography from "@material-ui/core/Typography"
import MenuItem from "@material-ui/core/MenuItem"

import { bps } from "@/ui/theme"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { graphql } from "gatsby"
import TagStyleFilter from "@/components/molecules/TagStyleFilter"
import { createDedupOptions, createDedupArrayOptions } from "@/utils/search"
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
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import MaleIcon from "@/components/icons/male.svg"
import FemaleIcon from "@/components/icons/female.svg"
import ImportIcon from "@/components/icons/import.svg"
import UnknownIcon from "@/components/icons/unknown.svg"
import QuestionIcon from "@/components/icons/question.svg"
import BoxViewIcon from "@/components/icons/box_view.svg"
import CardViewIcon from "@/components/icons/card_view.svg"
import SortIcon from "@/components/icons/sort.svg"
import moment from "moment"

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
  bottom: -56px;
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

const CasesPage = props => {
  const { data } = props
  const {
    cases: {
      dispatch,
      state: { view },
    },
  } = React.useContext(ContextStore)
  const { i18n, t } = useTranslation()

  // Do the sorting here since case_no is string instead of int
  const [cases, groupArrayColumnOptions] = useMemo(() => {
    const groupArray = data.allWarsCaseRelation.edges.flatMap(
      ({ node }, index) =>
        node.case_no.split`,`.map(nodeCase => ({
          ...node,
          id: index + 1,
          related_cases: node.case_no,
          case_no: +nodeCase,
        }))
    )
    const groupArrayByCaseNo = _groupBy(groupArray, "case_no")
    const groupArrayColumnOptions = data.allWarsCaseRelation.edges.map(
      ({ node }, index) => ({
        value: index + 1,
        label: node[`name_${i18n.language}`],
      })
    )
    const cases = data.allWarsCase.edges
      .map(i => ({
        node: {
          ...i.node,
          case_no_num: +i.node.case_no,
          age_num: +i.node.age,
          groups: groupArrayByCaseNo[i.node.case_no] || [],
          group_ids: (groupArrayByCaseNo[i.node.case_no] || []).map(i => i.id),
        },
      }))
      .sort((edge1, edge2) => {
        const res = edge2.node.confirmation_date.localeCompare(
          edge1.node.confirmation_date
        )
        if (res === 0) {
          return parseInt(edge2.node.case_no) - parseInt(edge1.node.case_no)
        }
        return res
      })
    return [cases, groupArrayColumnOptions]
  }, [data, i18n.language])

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

  const toFilterEntry = ([key, value]) => [`node.${key}`, value]
  const parseToFilter = str => {
    if (/^[-A-Z0-9]+\.\.+[-A-Z0-9]+$/i.test(str))
      return { between: str.split(/\.\.+/).sort() }
    if (/^[><]=[-A-Z0-9]+$/i.test(str))
      return { [str[0] === ">" ? "gte" : "lte"]: str.slice(2, str.length) }
    if (/^[><][-A-Z0-9]+$/i.test(str))
      return { [str[0] === ">" ? "gt" : "lt"]: str.slice(1, str.length) }
    if (/^[-A-Z0-9]+$/i.test(str)) return str
    return
  }
  const stringOrFilterEntry = ([key, value]) => {
    const filterPhrases = value
      .split(/,|\s+/g)
      .filter(phase => phase && /\w$/.test(phase))
      .map(parseToFilter)
      .reduce(
        (acc, curr) => {
          if (curr) {
            curr.constructor === String ? acc.inq.push(curr) : acc.or.push(curr)
          }
          return acc
        },
        { or: [], inq: [] }
      )

    return [
      filterPhrases.inq.length
        ? { [`node.${key}`]: { inq: filterPhrases.inq } }
        : undefined,
      ...filterPhrases.or.map(phrase => ({ [`node.${key}`]: phrase })),
    ].filter(Boolean)
  }
  const dateRangeOptionPresets = [
    {
      label: t("cases.filters_last_n_days", { n: 7 }),
      value: `${moment()
        .subtract(6, "day")
        .format("YYYY-MM-DD")}..${moment().format(`YYYY-MM-DD`)}`,
    },
    {
      label: t("cases.filters_previous_n_days", { n: 7 }),
      value: `${moment()
        .subtract(13, "day")
        .format("YYYY-MM-DD")}..${moment()
        .subtract(7, "day")
        .format(`YYYY-MM-DD`)}`,
    },
    {
      label: t("cases.filters_last_n_days", { n: 14 }),
      value: `${moment()
        .subtract(13, "day")
        .format("YYYY-MM-DD")}..${moment().format(`YYYY-MM-DD`)}`,
    },
    {
      label: t("cases.filters_previous_n_days", { n: 14 }),
      value: `${moment()
        .subtract(27, "day")
        .format("YYYY-MM-DD")}..${moment()
        .subtract(14, "day")
        .format(`YYYY-MM-DD`)}`,
    },
    {
      label: t("cases.filters_this_month"),
      value: `${moment().format(`[>]YYYY-MM`)}`,
    },
    {
      label: t("cases.filters_previous_month"),
      value: `${moment()
        .subtract(1, "month")
        .format("YYYY-MM")}..${moment().format(`YYYY-MM`)}`,
    },
  ]
  const options = [
    {
      label: t("search.group"),
      options: groupArrayColumnOptions,
      orderOptionsByFilterCount: true,
      realFieldName: "group_ids",
      toFilterEntry,
    },
    {
      label: t("search.classification"),
      options: createDedupOptions(i18n, cases, "classification"),
      orderOptionsByFilterCount: true,
      realFieldName: "classification_" + i18n.language,
      toFilterEntry,
    },
    {
      label: t("search.citizenship"),
      options: createDedupOptions(i18n, cases, "citizenship"),
      orderOptionsByFilterCount: true,
      realFieldName: "citizenship_" + i18n.language,
      toFilterEntry,
    },
    {
      label: t("search.case_status"),
      options: createDedupOptions(i18n, cases, "status"),
      orderOptionsByFilterCount: true,
      realFieldName: "status_" + i18n.language,
      toFilterEntry,
    },
    {
      label: t("search.hospital"),
      options: createDedupOptions(i18n, cases, "hospital"),
      orderOptionsByFilterCount: true,
      realFieldName: "hospital_" + i18n.language,
      toFilterEntry,
    },
    {
      label: t("search.case_no"),
      realFieldName: "case_no_num",
      filterType: "string",
      options: [],
      toFilterEntry: stringOrFilterEntry,
      isOrFilter: true,
      filterPlaceholder: "e.g. 1,3,10..20",
    },
    {
      label: t("dashboard.patient_confirm_date"),
      realFieldName: "confirmation_date",
      filterType: "string",
      options: dateRangeOptionPresets,
      toFilterEntry: stringOrFilterEntry,
      isOrFilter: true,
      filterPlaceholder: "e.g. 2020-06..2020-07-21",
    },
    {
      label: t("dashboard.patient_onset_date"),
      realFieldName: "onset_date",
      options: [
        { label: t("cases.status_asymptomatic"), value: "asymptomatic,none" },
        ...dateRangeOptionPresets,
      ],
      filterType: "string",
      toFilterEntry: stringOrFilterEntry,
      isOrFilter: true,
      filterPlaceholder: "e.g. 2020-06..2020-07-21",
    },
    {
      label: t("cases_visual.age"),
      realFieldName: "age_num",
      filterType: "string",
      options: [],
      toFilterEntry: stringOrFilterEntry,
      isOrFilter: true,
      filterPlaceholder: "e.g. 10..20,>60,>=50",
    },
    {
      label: t("cases_visual.gender"),
      realFieldName: "gender",
      options: [
        {
          value: "M",
          label: t("dashboard.gender_M"),
        },
        {
          value: "F",
          label: t("dashboard.gender_F"),
        },
      ],
      toFilterEntry,
    },
  ]

  // Calculate how much cards we should preload in order to scorll to that position
  let preloadedCases = cases.length - parseInt(selectedCase) + 1
  if (isNaN(preloadedCases)) {
    preloadedCases = 15
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
            bgColor={mapColorForStatus("pending_admission").main}
          />
        ),
        text: t("cases.status_pending_admission"),
      },
      {
        icon: (
          <Circle
            width={48}
            height={48}
            bgColor={mapColorForStatus("stable").main}
          />
        ),
        text: t("cases.status_stable"),
      },
      {
        icon: (
          <Circle
            width={48}
            height={48}
            bgColor={mapColorForStatus("hospitalised_again").main}
          />
        ),
        text: t("cases.status_hospitalised_again"),
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
      {
        icon: <ImportIcon />,
        text: t("cases.imported"),
      },
      {
        icon: <UnknownIcon />,
        text: t("cases.unknown"),
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
            {items.map((item, i) => (
              <div key={i} className="item">
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

  const handleBoxClick = item => {
    setSelectedCase(item)

    trackCustomEvent({
      category: "cases",
      action: "click_avatar",
      label: item.case_no,
    })
  }

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
            className={view === CASES_BOX_VIEW && "active"}
            onClick={() => {
              dispatch({
                type: CASES_BOX_VIEW,
              })
              trackCustomEvent({
                category: "cases",
                action: "toggle_view",
                label: "BOX_VIEW",
              })
            }}
          />
          <CardViewIcon
            className={view === CASES_CARD_VIEW && "active"}
            onClick={() => {
              dispatch({
                type: CASES_CARD_VIEW,
              })
              trackCustomEvent({
                category: "cases",
                action: "toggle_view",
                label: "CARD_VIEW",
              })
            }}
          />
        </span>
      </TitleContainer>
      <PageContent>
        <ConfirmedCasesSummary />
        {view === CASES_BOX_VIEW && <Legend />}
        <Typography variant="h5" style={{ marginTop: 16 }}>
          {t("cases.filters")}
        </Typography>
        <TagStyleFilter
          list={cases}
          placeholder={t("search.case_placeholder")}
          options={options}
          searchKey="case"
          onListFiltered={setFilteredCases}
          filterWithOr={false}
        />
        {view === CASES_BOX_VIEW && (
          <DefaultSelect
            value={selectedGroupButton}
            onChange={event => {
              setGroupButton(event.target.value)
              trackCustomEvent({
                category: "cases",
                action: "set_grouping",
                label: toggleGroupingButtons[event.target.value - 1],
              })
            }}
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

        <Typography variant="h6" style={{ marginTop: 16 }}>
          {filteredCases.length > 1
            ? t("cases.filter_results_plural", { count: filteredCases.length })
            : t("cases.filter_results", { count: filteredCases.length })}
        </Typography>
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

export default CasesPage

export const CasesPageQuery = graphql`
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
