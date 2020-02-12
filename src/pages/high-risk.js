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
import AutoSizer from "react-virtualized/dist/es/AutoSizer"
import * as d3 from "d3"
import _groupBy from "lodash/groupBy"
import DatePicker from "@/components/organisms/DatePicker"
import Theme from "@/ui/theme"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import { createDedupOptions, filterByDate } from "@/utils/search"
import MultiPurposeSearch from "../components/modecules/MultiPurposeSearch"

const colors = d3.scaleOrdinal(d3.schemeDark2).domain([0, 1, 2, 3, 4])

const HighRiskCardContainer = styled("div")`
  box-sizing: border-box;
  padding: 8px 16px;

  border-left: 4px
    ${props =>
      props.isActive
        ? Theme.palette.secondary.main
        : props.theme.palette.background.paper}
    solid;
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
  background: white;
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

export const HighRiskCardItem = ({ node, i18n, t, isActive }) => (
  <HighRiskCardContainer
    isActive={isActive}
    onClick={() =>
      trackCustomEvent({
        category: "high_risk_list",
        action: "click_item",
        label: `${node.node.sub_district_zh} | ${node.node.location_zh}`,
      })
    }
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

const Item = ({ node, i18n, t }) => {
  return (
    <HighRiskCardContent>
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

const HighRiskPage = ({ data }) => {
  const [searchStartDate, setSearchStartDate] = useState(null)
  const [searchEndDate, setSearchEndDate] = useState(null)
  const { i18n, t } = useTranslation()

  const withinBoderFilter = ({ node }) => node.sub_district_zh !== "境外"

  const groupedLocations = Object.values(
    _groupBy(
      data.allWarsCaseLocation.edges.filter(withinBoderFilter).map(e => e.node),
      node => node.location_zh
    )
  ).map(cases => ({
    node: {
      ...cases[0],
      cases: cases.filter(
        c =>
          withLanguage(i18n, c, "location") ===
          withLanguage(i18n, cases[0], "location")
      ), // Quick fix for filtering locations
    },
  }))

  const [filteredLocations, setFilteredLocations] = useState(groupedLocations)

  const filteredOptionsWithDate = filteredLocations.filter(loc =>
    filterByDate(loc.node, searchStartDate, searchEndDate)
  )
  const options = [
    {
      label: t("search.sub_district"),
      options: createDedupOptions(
        i18n,
        data.allWarsCaseLocation.edges.filter(withinBoderFilter),
        "sub_district"
      ),
      defaultSize: 100,
    },
    {
      // For 班次 / 航班: Only ferry no, flight no, and train no are searchable, ignore building
      label: t("search.location"),
      options: createDedupOptions(
        i18n,
        data.allWarsCaseLocation.edges.filter(withinBoderFilter),
        "location"
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
              filteredLocations={filteredOptionsWithDate.map(i => i.node)}
              height={height}
              width={width}
              dateFilterEnabled={searchStartDate && searchEndDate}
              datePicker={
                <DatePicker
                  startDate={searchStartDate}
                  endDate={searchEndDate}
                  setSearchStartDate={setSearchStartDate}
                  setSearchEndDate={setSearchEndDate}
                />
              }
              selectBar={
                <MultiPurposeSearch
                  list={groupedLocations}
                  placeholder={t("search.placeholder")}
                  options={options}
                  searchKey="high_risk"
                  onListFiltered={list => {
                    setFilteredLocations(list)
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
