import React, { useState } from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Box, Typography, Tooltip, ClickAwayListener } from "@material-ui/core"
import { graphql } from "gatsby"
import styled from "styled-components"
import MuiLink from "@material-ui/core/Link"
import { Link } from "gatsby"
import { withLanguage, getLocalizedPath } from "@/utils/i18n"
import { UnstyledRow } from "@components/atoms/Row"
import HighRiskMap from "@components/highRiskMap"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import AsyncSelect from "react-select/async"
import AutoSizer from "react-virtualized/dist/es/AutoSizer"
import * as d3 from "d3"
import groupyBy from "lodash/groupBy"
import DatePicker from "@/components/organisms/DatePicker"
import Theme from "@/ui/theme"

import {
  createSubDistrictOptionList,
  filterSearchOptions,
  filterValues,
  sortOptionsWithHistories,
} from "@/utils/search"

import { saveToLocalStorage, loadFromLocalStorage } from "@/utils"

const colors = d3.scaleOrdinal(d3.schemeDark2).domain([0, 1, 2, 3, 4])
const KEY_HISTORY_LOCAL_STORAGE = "high-risk-search-history"

const HighRiskCardContainer = styled("div")`
  box-sizing: border-box;
  background: ${props => props.theme.palette.background.paper};
  padding: 8px 16px;
  border: 2px solid ${props => props.theme.palette.background.paper};
`

const HighRiskCardTitle = styled(Box)``

const HighRiskCardContent = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledToolTip = styled(Tooltip)`
  cursor: pointer;
  .tooltip {
    background-color: papayawhip;
    color: #000;
    margin: 0px;
  }
`

const CaseRowContainer = styled(Box)`
  :nth-child(1n + 2) {
    margin-top: 2px;
  }
`

const CaseLabel = styled(Box)`
  color: ${props => props.color};
  border: ${props => props.color} 1px solid;
  padding: 2px 5px 2px;
  margin-right: 4px;
  border-radius: 2px;
`

const LabelRow = styled(UnstyledRow)`
  justify-content: flex-end;
  margin: 0px;
  flex-wrap: wrap;
`

const CaseActionRow = styled(UnstyledRow)`
  align-items: flex-start;

  .case_action {
    margin-right: 5px;
  }
`

const InfoToolTip = ({ t, title, className, color }) => {
  const [open, setOpen] = useState(false)
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <StyledToolTip
        PopperProps={{
          disablePortal: true,
        }}
        classes={{ popper: className, tooltip: "tooltip" }}
        onClose={() => setOpen(false)}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        placement="top"
        title={title}
      >
        <CaseLabel
          color={color}
          onClick={e => {
            e.stopPropagation()
            setOpen(true)
          }}
        >
          {t("high_risk.detail")}
        </CaseLabel>
      </StyledToolTip>
    </ClickAwayListener>
  )
}

export const HighRiskCardItem = ({ node, i18n, t, style, isActive }) => (
  <HighRiskCardContainer
    style={{
      ...style,
      borderColor: isActive ? Theme.palette.secondary.main : undefined,
    }}
  >
    <Item node={node.node} i18n={i18n} t={t} />
  </HighRiskCardContainer>
)

export const CaseRow = ({ c, i18n, t }) => (
  <CaseRowContainer key={c.id}>
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <UnstyledRow>
          <Typography component="span" variant="body2" color="textPrimary">
            {c.start_date === c.end_date
              ? c.end_date
              : `${formatDate(c.start_date)} - ${formatDate(c.end_date)}`}
          </Typography>
        </UnstyledRow>
      </Grid>
      <Grid item xs>
        <CaseActionRow>
          <Typography component="div" variant="body2" color="textPrimary">
            {withLanguage(i18n, c, "action")}
          </Typography>
          <LabelRow>
            {withLanguage(i18n, c, "remarks") && (
              <InfoToolTip
                title={withLanguage(i18n, c, "remarks")}
                t={t}
                color={colors(0)}
              />
            )}
            {c.case && (
              <Link to={getLocalizedPath(i18n, `/cases/#${c.case_no} `)}>
                <CaseLabel color={colors(1)}>{`#${c.case_no}`}</CaseLabel>
              </Link>
            )}
            {c.source_url_1 && (
              <MuiLink target="_blank" href={c.source_url_1}>
                <CaseLabel color={colors(2)}>
                  {t("high_risk.source_1")}
                </CaseLabel>
              </MuiLink>
            )}
            {c.source_url_2 && (
              <MuiLink target="_blank" href={c.source_url_2}>
                <CaseLabel color={colors(4)}>
                  {t("high_risk.source_2")}
                </CaseLabel>
              </MuiLink>
            )}
          </LabelRow>
        </CaseActionRow>
      </Grid>
    </Grid>
  </CaseRowContainer>
)
const formatDate = d => {
  // Orignal formatString: "DD/M" cannot be parsed in DatePicker
  // formatString: "YYYY-MM-DD" for DatePicker
  // Reformat for UI here
  if (d) {
    d = d.replace(/(\d{4})-(\d\d)-(\d\d)/, function(_, y, m, d) {
      return [d, m].join("/")
    })
  }
  return d
}

const Item = ({ node, i18n, t, style }) => {
  return (
    <HighRiskCardContent style={style}>
      <HighRiskCardTitle>
        <Typography component="span" variant="h6" color="textPrimary">
          {withLanguage(i18n, node, "location")}
        </Typography>
      </HighRiskCardTitle>
      {node.cases.map(c => (
        <CaseRow key={c.id} c={c} i18n={i18n} t={t}></CaseRow>
      ))}
    </HighRiskCardContent>
  )
}
const useStyle = makeStyles(theme => {
  return {
    fullPageContent: {
      position: "absolute",
      // compensate AppBar (56px)
      top: 56,
      left: 0,
      right: 0,
      bottom: 60,
      overflow: "hidden",
    },
    [`${theme.breakpoints.up("sm")}`]: {
      fullPageContent: {
        top: 64,
        left: 240,
        bottom: 0,
      },
    },
  }
})

const HighRiskPage = ({ data, pageContext }) => {
  const [filters, setFilters] = useState([])
  const [histories, setHistories] = useState([])
  const [searchStartDate, setSearchStartDate] = useState(null)
  const [searchEndDate, setSearchEndDate] = useState(null)

  const { i18n, t } = useTranslation()
  const subDistrictOptionList = createSubDistrictOptionList(
    i18n,
    data.allWarsCaseLocation.edges
  )

  React.useEffect(() => {
    const v = loadFromLocalStorage(KEY_HISTORY_LOCAL_STORAGE)
    if (v) {
      setHistories(JSON.parse(v))
    }
  }, [])
  const dataPoint = data.allWarsCaseLocation.edges.map(i => i.node)
  const realLocationByPoint = groupyBy(
    dataPoint.filter(i => i.sub_district_zh !== "-"),
    i => `${i.lat}${i.lng}`
  )
  dataPoint
    .filter(i => i.sub_district_zh === "-")
    .forEach(i => {
      if (realLocationByPoint[`${i.lat}${i.lng}`])
        return realLocationByPoint[`${i.lat}${i.lng}`].push(i)
      realLocationByPoint[`${i.lat}${i.lng}`] = [i]
    })
  const groupedLocations = Object.values(realLocationByPoint).map(cases => ({
    node: {
      ...cases[0],
      cases,
    },
  }))
  const filteredLocations = filterValues(i18n, groupedLocations, filters)

  const allOptions = [
    {
      label: t("search.sub_district"),
      options: sortOptionsWithHistories(subDistrictOptionList, histories),
    },
    {
      // For 班次 / 航班: Only ferry no, flight no, and train no are searchable, ignore building
      label: t("search.location"),
      options: sortOptionsWithHistories(
        data.allWarsCaseLocation.edges.map(({ node }) => ({
          label: withLanguage(i18n, node, "location"),
          value: withLanguage(i18n, node, "location"),
          field: "location",
          start_date: node.start_date,
          end_date: node.end_date,
          search_start_date: searchStartDate,
          search_end_date: searchEndDate,
        })),
        histories
      ),
    },
  ]
  const { fullPageContent } = useStyle()
  return (
    <Layout>
      <SEO title="HighRiskPage" />
      <div className={fullPageContent}>
        <AutoSizer>
          {({ width, height }) => (
            <HighRiskMap
              t={t}
              getTranslated={(node, key) => withLanguage(i18n, node, key)}
              filteredLocations={filteredLocations.map(i => i.node)}
              height={height}
              width={width}
              dateFilterEnabled={searchStartDate && searchEndDate}
              datePicker={
                <DatePicker
                  setSearchStartDate={setSearchStartDate}
                  setSearchEndDate={setSearchEndDate}
                  setFilters={setFilters}
                  filters={filters}
                />
              }
              selectBar={
                <AsyncSelect
                  closeMenuOnSelect={false}
                  loadOptions={(input, callback) =>
                    callback(filterSearchOptions(allOptions, input, 5))
                  }
                  isMulti
                  placeholder={t("search.placeholder")}
                  noOptionsMessage={() => t("text.not_found")}
                  defaultOptions={filterSearchOptions(allOptions, null, 10)}
                  value={filters}
                  onChange={selectedArray => {
                    // only append the history
                    if (
                      selectedArray &&
                      selectedArray.length > filters.length
                    ) {
                      const historiesToSave = [
                        ...histories,
                        selectedArray[selectedArray.length - 1],
                      ].filter((_, i) => i < 10)
                      setHistories(historiesToSave)
                      saveToLocalStorage(
                        KEY_HISTORY_LOCAL_STORAGE,
                        JSON.stringify(historiesToSave)
                      )
                    }
                    setFilters(selectedArray || [])
                  }}
                />
              }
              renderCard={({ node, isActive }) => {
                return (
                  <HighRiskCardItem
                    key={node.id}
                    node={{ node }}
                    i18n={i18n}
                    t={t}
                    style={{ margin: 0 }}
                    isActive={isActive}
                  />
                )
              }}
            ></HighRiskMap>
          )}
        </AutoSizer>
      </div>
    </Layout>
  )
}

export default HighRiskPage

export const HighRiskQuery = graphql`
  query {
    allWarsCaseLocation(
      filter: { enabled: { eq: "Y" } }
      sort: { order: DESC, fields: end_date }
    ) {
      edges {
        node {
          id
          sub_district_zh
          sub_district_en
          action_zh
          action_en
          location_en
          location_zh
          remarks_en
          remarks_zh
          source_url_1
          source_url_2
          start_date(formatString: "YYYY-MM-DD")
          end_date(formatString: "YYYY-MM-DD")
          lat
          lng
          type
          case_no
          case {
            case_no
          }
        }
      }
    }
  }
`
