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
        <Box>
          <Typography component="span" variant="body2" color="textPrimary">
            {node.start_time} - {node.end_time}
          </Typography>
        </Box>
      </HighRiskCardContent>
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
  const sortedLocations = filterValues(
    i18n,
    data.allWarsCaseLocation.edges.sort(
      (a, b) => Date.parse(b.node.end_time) - Date.parse(a.node.end_time)
    ),
    filters
  )
  const allOptions = [
    {
      label: t("search.sub_district"),
      options: subDistrictOptionList,
    },
    {
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
    allWarsCaseLocation {
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
          start_time
          end_time
          type
          case {
            case_no
          }
        }
      }
    }
  }
`
