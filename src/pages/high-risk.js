import React, { useState } from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Box, Button, Typography, Tooltip } from "@material-ui/core"
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
import InfoIcon from "@material-ui/icons/InfoOutlined"
import HelpIcon from "@material-ui/icons/HelpOutline"
import AssignmentIcon from "@material-ui/icons/AssignmentIndOutlined"

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

function item(props, i18n, t) {
  const { node } = props

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
            <Grid item xs={4}>
              {withLanguage(i18n, c, "remarks") && (
                <Tooltip title="tsetset" placement="top-end">
                  <HelpIcon fontSize="small" />
                </Tooltip>
              )}
              {c.case_no && (
                <Link to={getLocalizedPath(i18n, `/cases/#${c.case_no}`)}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    <AssignmentIcon fontSize="small" />
                  </Typography>
                </Link>
              )}
              {c.source_url_1 && (
                <MuiLink target="_blank" href={c.source_url_1}>
                  <InfoIcon fontSize="small" />
                </MuiLink>
              )}
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

  const sortedLocations = filterValues(i18n, groupedLocations, filters)

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
        <Typography variant="h4">{t("high_risk.title")}</Typography>
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
          console.log(selectedArray)
          setFilters(selectedArray || "")
        }}
      />

      {/* Add Date-time picker for selecting ranges */}
      {mapMode ? (
        <>
          {/* Buy time component.. will get rid of this code once we have a nice map component */}
          <MapContainer
            dangerouslySetInnerHTML={{
              __html: `<iframe title="map" src="https://www.google.com/maps/d/embed?mid=1VdE10fojNRAVr1omckkgKbINL12oj5Bm" width="100%" height="100%"></iframe>`,
            }}
          />
        </>
      ) : (
        <>
          {sortedLocations.map((node, index) => (
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
