import React, { useState } from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Box, Button, Typography } from "@material-ui/core"
import { graphql } from "gatsby"
import styled from "styled-components"
import Link from "@material-ui/core/Link"
import { BasicCard } from "@components/atoms/Card"
import { withLanguage } from "@/utils/i18n"
import { Row } from "@components/atoms/Row"
import { components } from "react-select"
import AsyncSelect from "react-select/async"
import {
  createSubDistrictOptionList,
  filterSearchOptions,
  filterValues,
} from "@/utils"

const HighRiskCard = styled(Box)``

const HighRiskCardContent = styled(Box)`
  display: flex;
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
          <Box>
            <Typography component="span" variant="body2" color="textPrimary">
              {withLanguage(i18n, node, "sub_district")}
            </Typography>
          </Box>
          <Box>
            <Typography component="span" variant="h6" color="textPrimary">
              {withLanguage(i18n, node, "location")}
            </Typography>
          </Box>
        </Box>
        <Box></Box>
      </HighRiskCardContent>
      {node.cases
        .sort((a, b) => b.case_no - a.case_no)
        .map((c, i) => (
          <Row key={i}>
            <Box>
              {/* TODO: Redirect to the case cards */}
              <Link>{`#${c.case_no} `}</Link>
            </Box>
            <Box>{t(`cases.type_${c.type}`)}</Box>
            <Box>{withLanguage(i18n, c, "action")}</Box>
            <Box>
              {/* TODO: If start_time is the same as end_time, show one only */}
              {/* TODO: Include start_time_period and end_time_period */}
              {/* 
              Add logic to sort and group dates with cases:

              Current display:
              
              #13 患者 抵港 2020-01-23 - 2020-01-23 
              #13 患者 離港 2020-01-21 - 2020-01-21 
              #10 患者 抵港 2020-01-22 - 2020-01-22 
              #9 患者 抵港 2020-01-22 - 2020-01-22 
              #3 患者 抵港 2020-01-19 - 2020-01-19 
              #1 患者 抵港 2020-01-21 - 2020-01-21 
              #1 患者親友 抵港 2020-01-21 - 2020-01-21

              Expected display:
              #1, #9, #10     2020-01-21-2020-01-23 
              #3                         2020-01-19 
              
              */}
              {c.start_time} - {c.end_time}
            </Box>
          </Row>
        ))}
      <Typography component="span" variant="body2" color="textPrimary">
        {withLanguage(i18n, node, "action")}
      </Typography>
      {node.source_url && (
        <Box>
          <Link href={node.source_url} target="_blank">
            <Typography component="span" variant="body2" color="textPrimary">
              {t("high_risk.source", {
                source: withLanguage(i18n, node, "source"),
              })}
            </Typography>
          </Link>
        </Box>
      )}
      <Typography variant="body2">
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
      </Typography>
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

  const groupedLocations = data.allWarsCaseLocation.edges.reduce((a, c) => {
    const {
      case: { case_no },
      location_zh,
      location_en,
      sub_district_zh,
      sub_district_en,
      action_zh,
      action_en,
      remarks_zh,
      remarks_en,
      start_time,
      end_time,
      type,
      source_url_1,
      source_url_2,
    } = c.node

    const caseDetail = {
      case_no,
      action_zh,
      action_en,
      remarks_zh,
      remarks_en,
      start_time,
      end_time,
      type,
      source_url_1,
      source_url_2,
    }

    const locationPos = a.findIndex(
      item =>
        withLanguage(i18n, item.node, "location") ===
        withLanguage(i18n, c.node, "location")
    )
    if (locationPos === -1) {
      const newLocation = {
        node: {
          location_zh,
          location_en,
          sub_district_zh,
          sub_district_en,
          cases: [caseDetail],
        },
      }
      a.push(newLocation)
      return a
    }
    a[locationPos].node.cases.push(caseDetail)
    return a
  }, [])

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
        placeholder={t("dodgy_shops.filter_by_district_text")}
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
      sort: { order: DESC, fields: end_time }
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
          start_time(formatString: "YYYY-MM-DD")
          end_time(formatString: "YYYY-MM-DD")
          type
          case {
            case_no
          }
        }
      }
    }
  }
`
