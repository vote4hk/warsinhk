import React, { useState } from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@material-ui/core"
import { graphql } from "gatsby"
import styled from "styled-components"
import { withLanguage } from "@/utils/i18n"
import AsyncSelect from "react-select/async"
import HighRiskMap from "@components/highRiskMap"
import { makeStyles } from "@material-ui/core/styles"
import { CaseRow } from "./high-risk"
import {
  createSubDistrictOptionList,
  filterSearchOptions,
  filterValues,
  sortOptionsWithHistories,
} from "@/utils/search"

import { saveToLocalStorage, loadFromLocalStorage } from "@/utils"
import gropyBy from "lodash/groupBy"

const useStyle = makeStyles(theme => {
  return {
    fullPageContent: {
      position: "absolute",
      // compensate AppBar (56px)
      top: 56,
      left: 0,
      right: 0,
      bottom: 0,
    },
    floatingFilterBar: {
      position: "absolute",
      top: theme.spacing(3),
      left: theme.spacing(3),
      right: theme.spacing(3),
    },
    [`${theme.breakpoints.up("sm")}`]: {
      fullPageContent: {
        // compensate SideBar (240px)
        left: 240,
      },
    },
  }
})

const KEY_HISTORY_LOCAL_STORAGE = "high-risk-search-history"

const HighRiskCardTitle = styled(Box)``

const HighRiskCardContent = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const HighRiskMapPage = ({ data, pageContext }) => {
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
  const dataPoint = data.allWarsCaseLocation.edges.map(i => i.node)
  const realLocaitonByPoint = gropyBy(
    dataPoint.filter(i => i.sub_district_zh !== "-"),
    i => `${i.lat}${i.lng}`
  )
  dataPoint
    .filter(i => i.sub_district_zh === "-")
    .forEach(i => {
      if (realLocaitonByPoint[`${i.lat}${i.lng}`])
        realLocaitonByPoint[`${i.lat}${i.lng}`].push(i)
    })
  const groupedLocations = Object.values(realLocaitonByPoint).map(cases => ({
      node:{
        ...cases[0],
        cases,
      }
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
        })),
        histories
      ),
    },
  ]
  const { fullPageContent, floatingFilterBar } = useStyle()
  return (
    <Layout>
      <SEO title="HighRiskPage" />
      <div className={fullPageContent}>
        <HighRiskMap
          t={t}
          getTranslated={(node, key) => withLanguage(i18n, node, key)}
          filteredLocations={filteredLocations}
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
    </Layout>
  )
}

export default HighRiskMapPage

export const HighRiskMapQuery = graphql`
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
