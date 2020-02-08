import React, { useState } from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import {
  Box,
  Button,
  Typography,
  Tooltip,
  ClickAwayListener,
} from "@material-ui/core"
import { graphql } from "gatsby"
import styled from "styled-components"
import MuiLink from "@material-ui/core/Link"
import { Link } from "gatsby"
import { BasicCard } from "@components/atoms/Card"
import { withLanguage, getLocalizedPath } from "@/utils/i18n"
import { Row, UnstyledRow } from "@components/atoms/Row"
import Grid from "@material-ui/core/Grid"
import AsyncSelect from "react-select/async"
import HighRiskMap from "@components/highRiskMap"
import * as d3 from "d3"
import InfiniteScroll from "@/components/modecules/InfiniteScroll"
import { makeStyles } from "@material-ui/core/styles"

import {
  createSubDistrictOptionList,
  filterSearchOptions,
  filterValues,
  sortOptionsWithHistories,
} from "@/utils/search"

import { saveToLocalStorage, loadFromLocalStorage } from "@/utils"

const useStyle = makeStyles(theme => ({
  fullWidthContent: {
    marginLeft: -theme.spacing(3),
    marginRight: -theme.spacing(3),
  },
  floatingFilterBar: {
    position: "absolute",
    top: theme.spacing(3),
    left: theme.spacing(3),
    right: theme.spacing(3),
  },
}))

const colors = d3.scaleOrdinal(d3.schemeDark2).domain([0, 1, 2, 3, 4])
const KEY_HISTORY_LOCAL_STORAGE = "high-risk-search-history"

const HighRiskCardContainer = styled(Box)``

const HighRiskCard = styled(BasicCard)``

const HighRiskCardTitle = styled(Box)``

const HighRiskCardContent = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledToolTip = styled(Tooltip)`
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
  justify-content: flex-start;
  margin: 0px;
  flex-wrap: wrap;
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
        <CaseLabel color={color} onClick={() => setOpen(true)}>
          {t("high_risk.detail")}
        </CaseLabel>
      </StyledToolTip>
    </ClickAwayListener>
  )
}

const CaseRow = ({ c, i18n, t }) => (
  <CaseRowContainer>
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <UnstyledRow>
          <Typography component="span" variant="body2" color="textPrimary">
            {c.start_date === c.end_date
              ? c.end_date
              : `${c.start_date} - ${c.end_date}`}
          </Typography>
        </UnstyledRow>
      </Grid>
      <Grid item xs>
        <UnstyledRow>
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
        </UnstyledRow>
      </Grid>
    </Grid>
  </CaseRowContainer>
)

const Item = ({ node, i18n, t }) => {
  return (
    <HighRiskCard>
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
    </HighRiskCard>
  )
}

const HighRiskPage = ({ data, pageContext }) => {
  const [mapMode, setMapMode] = useState(true)
  const [filters, setFilters] = useState([])
  const [histories, setHistories] = useState([])

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

  const groupedLocations = data.allWarsCaseLocation.edges.reduce(
    (a, { node }) => {
      const locationPos = a.findIndex(
        item =>
          withLanguage(i18n, item.node, "location") ===
          withLanguage(i18n, node, "location")
      )
      if (locationPos === -1) {
        const newLocation = {
          node: {
            id: node.id,
            location_zh: node.location_zh,
            location_en: node.location_en,
            sub_district_zh: node.sub_district_zh,
            sub_district_en: node.sub_district_en,
            lat: node.lat,
            lng: node.lng,
            cases: [{ ...node }],
          },
        }
        a.push(newLocation)
        return a
      }
      a[locationPos].node.cases.push({ ...node })
      return a
    },
    []
  )

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
        })),
        histories
      ),
    },
  ]
  const { fullWidthContent, floatingFilterBar } = useStyle()
  return (
    <Layout>
      <SEO title="HighRiskPage" />
      <Row>
        <Typography variant="h2">{t("high_risk.title")}</Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setMapMode(!mapMode)
          }}
        >
          {mapMode ? t("high_risk.list_mode") : t("high_risk.map_mode")}
        </Button>
      </Row>
      {/* Add Date-time picker for selecting ranges */}
      {mapMode ? (
        <div className={fullWidthContent}>
          <HighRiskMap
            t={t}
            getTranslated={(node, key) => withLanguage(i18n, node, key)}
            filteredLocations={filteredLocations.flatMap(i => i.node.cases)}
            height={480}
            renderTooltip={node => (
              <HighRiskCardContent style={{ width: 300 }}>
                <HighRiskCardTitle>
                  <Typography component="span" variant="h6" color="textPrimary">
                    {withLanguage(i18n, node, "location")}
                  </Typography>
                </HighRiskCardTitle>
                <CaseRow c={node} i18n={i18n} t={t}></CaseRow>
                <br />
                <a
                  href={`https://maps.google.com/?ll=${node.lat},${node.lng},15z`}
                >
                  Google Map
                </a>
              </HighRiskCardContent>
            )}
          >
            <div className={floatingFilterBar}>
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
                  if (selectedArray && selectedArray.length > filters.length) {
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
            </div>
          </HighRiskMap>
        </div>
      ) : (
        <>
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
              if (selectedArray && selectedArray.length > filters.length) {
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
          <InfiniteScroll
            list={filteredLocations}
            step={{ mobile: 20 }}
            onItem={(node, index) => (
              <HighRiskCardContainer alignItems="flex-start" key={index}>
                <Item node={node.node} i18n={i18n} t={t} />
              </HighRiskCardContainer>
            )}
          />
        </>
      )}
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
          start_date(formatString: "DD/M")
          end_date(formatString: "DD/M")
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
