import React, { useState, useRef, useEffect, useMemo } from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Box, Typography, Tooltip, ClickAwayListener } from "@material-ui/core"
import styled from "styled-components"
import MuiLink from "@material-ui/core/Link"
import { Link } from "gatsby"
import { withLanguage, getLocalizedPath } from "@/utils/i18n"
import { UnstyledRow } from "@components/atoms/Row"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import AutoSizer from "react-virtualized/dist/es/AutoSizer"
import * as d3 from "d3"
import _groupBy from "lodash/groupBy"
import _flatMap from "lodash/flatMap"
import _orderBy from "lodash/orderBy"
import DatePicker from "@/components/organisms/DatePicker"
import Theme from "@/ui/theme"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import {
  createDedupOptions,
  filterByDate,
  calculatePastNdays,
} from "@/utils/search"
import MultiPurposeSearch from "../components/molecules/MultiPurposeSearch"
import { grey } from "@material-ui/core/colors"
import { isSSR } from "@/utils"
import { useAllCasesData } from "@components/data/useAllCasesData"

const HighRiskMap = React.lazy(() =>
  import(/* webpackPrefetch: true */ "@components/highRiskMap")
)

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
  cursor: pointer;
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

const CaseText = styled(({ pass14days, children, ...props }) => (
  <Typography {...props}>{children}</Typography>
))`
  color: ${props => {
    return props.pass14days ? grey[500] : "black"
  }};
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

export const CaseRow = ({ c, i18n, t, pass14days }) => (
  <CaseRowContainer key={c.id}>
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <UnstyledRow>
          <CaseText component="div" variant="body2" pass14days={pass14days}>
            {c.end_date}
          </CaseText>
        </UnstyledRow>
      </Grid>
      <Grid item xs>
        <CaseActionRow>
          <CaseText component="div" variant="body2" pass14days={pass14days}>
            {withLanguage(i18n, c, "action")}
          </CaseText>
          <LabelRow>
            {withLanguage(i18n, c, "remarks") && (
              <InfoToolTip
                title={withLanguage(i18n, c, "remarks")}
                t={t}
                color={colors(0)}
              />
            )}
            {c.case_no && (
              <Link to={getLocalizedPath(i18n, `/cases/${c.case_no} `)}>
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

const Item = ({ node, i18n, t }) => {
  return (
    <HighRiskCardContent>
      <HighRiskCardTitle>
        <CaseText component="span" variant="h6" pass14days={node.allPass14days}>
          {t("cases_sub_district_location", {
            sub_district: withLanguage(i18n, node, "sub_district"),
            location: withLanguage(i18n, node, "location"),
          })}
        </CaseText>
      </HighRiskCardTitle>
      {node.cases.map(c => (
        <CaseRow
          key={c.id}
          c={c}
          i18n={i18n}
          t={t}
          pass14days={c.pass14days}
        ></CaseRow>
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
      bottom: 0,
      overflow: "hidden",
    },
    [`${theme.breakpoints.up("sm")}`]: {
      fullPageContent: {
        top: 64,
        left: 0,
        bottom: -60,
      },
    },
  }
})

const HighRiskPage = () => {
  const allCasesPageData = useAllCasesData()
  const data = useMemo(() => {
    const edges = _orderBy(
      _flatMap(allCasesPageData.patient_track.group, "edges"),
      "node.end_date"
    ).filter(i => i.node.action_zh !== "求醫")
    return { allWarsCaseLocation: { edges } }
  }, [allCasesPageData])
  const [searchStartDate, setSearchStartDate] = useState(null)
  const [searchEndDate, setSearchEndDate] = useState(null)
  const { i18n, t } = useTranslation()

  const withinBoderFilter = ({ node }) => node.sub_district_zh !== "境外"

  const mapPinType = item => {
    switch (item.type) {
      case "self":
      case "relatives":
        return "confirmed_case"
      default:
        return item.type
    }
  }

  const groupedLocations = Object.values(
    _groupBy(
      data.allWarsCaseLocation.edges.filter(withinBoderFilter).map(e => {
        const item = e.node
        const end_date = item.end_date === "Invalid date" ? "" : item.end_date
        return {
          ...item,
          end_date,
          pass14days: calculatePastNdays(
            {
              case_no: item.case_no,
              date: item.end_date,
            },
            14
          ),
          pinType: mapPinType(item),
        }
      }),
      node => `${node.sub_district_zh}${node.location_zh}`
    )
  ).map(cases => {
    const casesPass14daysArray = [...new Set(cases.map(c => c.pass14days))]
    return {
      node: {
        ...cases[0],
        cases: cases.filter(
          c =>
            withLanguage(i18n, c, "location") ===
            withLanguage(i18n, cases[0], "location")
        ), // Quick fix for filtering locations
        allPass14days:
          casesPass14daysArray.length === 1 &&
          casesPass14daysArray.pop() === true,
      },
    }
  })

  const [filteredLocations, setFilteredLocations] = useState(groupedLocations)
  const container = useRef(null)
  const [fullscreenEnabled, setFullPageState] = useState(false)
  const toggleFullScreen = async () => {
    if (!container.current || !document.fullscreenEnabled) return
    if (!document.fullscreenElement) {
      await container.current.requestFullscreen().catch()
    } else {
      await document.exitFullscreen().catch()
    }
    setFullPageState(Boolean(document.fullscreenElement))
  }

  useEffect(() => {
    const onfullscreenchange = () => {
      setFullPageState(Boolean(document.fullscreenElement))
    }
    document.addEventListener("fullscreenchange", onfullscreenchange)
    return () =>
      document.removeEventListener("fullscreenchange", onfullscreenchange)
  })
  const filteredOptionsWithDate = filteredLocations
    .filter(loc => filterByDate(loc.node, searchStartDate, searchEndDate))
    .sort((a, b) => {
      // Active cards on top
      if (a.node.allPass14days > b.node.allPass14days) return 1
      if (a.node.allPass14days < b.node.allPass14days) return -1

      if (a.node.end_date > b.node.end_date) return -1
      if (a.node.end_date < b.node.end_date) return 1

      return 0
    })
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
      <div ref={container} className={fullPageContent}>
        {/* SSR do not show the map */}
        {!isSSR() && (
          <AutoSizer defaultWidth={800} defaultHeight={600}>
            {({ width, height }) => (
              <React.Suspense fallback={<div />}>
                <HighRiskMap
                  t={t}
                  language={i18n.language}
                  getTranslated={(node, key) => withLanguage(i18n, node, key)}
                  filteredLocations={filteredOptionsWithDate.map(i => i.node)}
                  height={height}
                  width={width}
                  dateFilterEnabled={searchStartDate && searchEndDate}
                  fullscreenEnabled={fullscreenEnabled}
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
                  toggleFullScreen={toggleFullScreen}
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
              </React.Suspense>
            )}
          </AutoSizer>
        )}
      </div>
    </Layout>
  )
}

export default HighRiskPage
