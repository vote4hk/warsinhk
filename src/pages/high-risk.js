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
              {withLanguage(i18n, node, "name")}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography component="span" variant="body2" color="textPrimary">
            {node.last_seen}
          </Typography>
        </Box>
      </HighRiskCardContent>
      <Typography component="span" variant="body2" color="textPrimary">
        {withLanguage(i18n, node, "details")}
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
  const sortedHighRisk = data.allHighRisk.edges.sort(
    (a, b) => Date.parse(b.node.last_seen) - Date.parse(a.node.last_seen)
  )
  const { i18n, t } = useTranslation()
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
          {sortedHighRisk.map((node, index) => (
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
    allHighRisk(filter: { enabled: { eq: "Y" } }) {
      edges {
        node {
          district_zh
          district_en
          sub_district_zh
          sub_district_en
          name_zh
          name_en
          source_zh
          source_en
          source_url
          details_zh
          details_en
          last_seen
        }
      }
    }
  }
`
