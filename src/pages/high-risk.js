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
import { Row } from "@components/atoms/Row"
import Grid from "@material-ui/core/Grid"
import { components } from "react-select"
import AsyncSelect from "react-select/async"
import * as d3 from "d3"

import {
  createSubDistrictOptionList,
  filterSearchOptions,
  filterValues,
} from "@/utils"

const HighRiskCard = styled(Box)``

const HighRiskCardContent = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const MapContainer = styled.div`
  width: 100%;
  height: 70vh;
`

const StyledToolTip = styled(Tooltip)`
  .tooltip {
    background-color: papayawhip;
    color: #000;
    margin: 0px;
  }
`

const CaseLabel = styled(Box)`
  background: ${props => props.color};
  color: white;
  padding: 4px 6px 4px;
  margin-right: 4px;
  border-radius: 2px;
`

const LabelRow = styled(Row)`
  justify-content: flex-start;
  margin: 0px;
  margin-bottom: 4px;
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

function item(props, i18n, t) {
  const { node } = props
  const colors = d3.scaleOrdinal(d3.schemeAccent).domain([0, 1, 2, 3])
  return (
    <HighRiskCard>
      <HighRiskCardContent>
        <Box>
          <Typography component="span" variant="h6" color="textPrimary">
            {withLanguage(i18n, node, "location")}
          </Typography>
        </Box>
        {node.cases.map((c, index) => (
          <Grid key={index} container spacing={3}>
            <Grid item xs={4}>
              <Typography component="span" variant="body2" color="textPrimary">
                {c.start_date}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography component="span" variant="body2" color="textPrimary">
                {withLanguage(i18n, c, "action")}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <LabelRow>
                {withLanguage(i18n, c, "remarks") && (
                  <InfoToolTip
                    title={withLanguage(i18n, c, "remarks")}
                    t={t}
                    color={colors(0)}
                  />
                )}
                {c.case_no && (
                  <Link to={getLocalizedPath(i18n, `/cases/#${c.case_no} `)}>
                    <CaseLabel color={colors(1)}>
                      {t("high_risk.confirmed_case")}
                    </CaseLabel>
                  </Link>
                )}
                {c.source_url_1 && (
                  <MuiLink target="_blank" href={c.source_url_1}>
                    <CaseLabel color={colors(2)}>
                      {t("high_risk.source_1")}
                    </CaseLabel>
                  </MuiLink>
                )}
              </LabelRow>
            </Grid>
          </Grid>
        ))}
      </HighRiskCardContent>
      {/* TODO: The Whole card should be clickable and redirect to map */}
      {/* <Typography variant="body2">
        <Link
          href={`https://maps.google.com/?q=${withLanguage(
i18n,
  node,
  "name"
          )}`}
          target="_blank"
        >
          {t("text.map")}
        </Link>
      </Typography> */}
    </HighRiskCard>
  )
}

const HighRiskPage = ({ data, pageContext }) => {
  const [mapMode, setMapMode] = useState(false)
  const [filters, setFilters] = useState([])
  const { i18n, t } = useTranslation()
  const subDistrictOptionList = createSubDistrictOptionList(
    i18n,
    data.allWarsCaseLocation.edges
  )

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
            location_zh: node.location_zh,
            location_en: node.location_en,
            sub_district_zh: node.sub_district_zh,
            sub_district_en: node.sub_district_en,
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
      options: subDistrictOptionList,
    },
    {
      // For 班次 / 航班: Only ferry no, flight no, and train no are searchable, ignore building
      label: t("search.location"),
      options: data.allWarsCaseLocation.edges.map(({ node }) => ({
        label: withLanguage(i18n, node, "location"),
        value: withLanguage(i18n, node, "location"),
        field: "location",
      })),
    },
  ]

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
      <AsyncSelect
        closeMenuOnSelect={false}
        components={{
          Option: props =>
            props.field === "sub_district" ? (
              <components.Option {...props} />
            ) : (
              <components.Option {...props} />
            ),
        }}
        loadOptions={(input, callback) =>
          callback(filterSearchOptions(allOptions, input, 5))
        }
        isMulti
        placeholder={t("search.placeholder")}
        defaultOptions={filterSearchOptions(allOptions, null, 5)}
        // formatGroupLabel={SelectGroupLabel}
        onChange={selectedArray => {
          setFilters(selectedArray || "")
        }}
      />

      {/* Add Date-time picker for selecting ranges */}
      {mapMode ? (
        <>
          {/* Buy time component.. will get rid of this code once we have a nice map component */}
          <MapContainer
            dangerouslySetInnerHTML={{
              __html: `< iframe title = "map" src = "https://www.google.com/maps/d/embed?mid=1VdE10fojNRAVr1omckkgKbINL12oj5Bm" width = "100%" height = "100%" ></iframe > `,
            }}
          />
        </>
      ) : (
        <>
          {filteredLocations.map((node, index) => (
            <BasicCard
              alignItems="flex-start"
              key={index}
              children={item(node, i18n, t)}
            />
          ))}
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
          start_date(formatString: "YYYY-MM-DD")
          end_date(formatString: "YYYY-MM-DD")
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
