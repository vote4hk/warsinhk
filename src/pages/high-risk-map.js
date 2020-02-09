import React, { useState } from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { graphql } from "gatsby"
import { withLanguage } from "@/utils/i18n"
import AsyncSelect from "react-select/async"
import HighRiskMap from "@components/highRiskMap"
import { makeStyles } from "@material-ui/core/styles"
import { HighRiskCardItem } from "./high-risk"
import AutoSizer from "react-virtualized/dist/es/AutoSizer"
import {
  createSubDistrictOptionList,
  filterSearchOptions,
  filterValues,
  sortOptionsWithHistories,
} from "@/utils/search"

import { saveToLocalStorage, loadFromLocalStorage } from "@/utils"
import groupyBy from "lodash/groupBy"

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
    virtualizedRowContainer: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
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

const KEY_HISTORY_LOCAL_STORAGE = "high-risk-search-history"

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
  const realLocationByPoint = groupyBy(
    dataPoint.filter(i => i.sub_district_zh !== "-"),
    i => `${i.lat}${i.lng}`
  )
  dataPoint
    .filter(i => i.sub_district_zh === "-")
    .forEach(i => {
      if (realLocationByPoint[`${i.lat}${i.lng}`])
        realLocationByPoint[`${i.lat}${i.lng}`].push(i)
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
        })),
        histories
      ),
    },
  ]
  const {
    fullPageContent,
    floatingInfoPane,
    virtualizedRowContainer,
  } = useStyle()
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
              infoPaneClass={floatingInfoPane}
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
              renderInfoPane={node => (
                <div class={virtualizedRowContainer}>
                  <HighRiskCardItem
                    key={node.id}
                    node={{ node }}
                    i18n={i18n}
                    t={t}
                    style={{ margin: 0 }}
                  />
                </div>
              )}
            ></HighRiskMap>
          )}
        </AutoSizer>
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
