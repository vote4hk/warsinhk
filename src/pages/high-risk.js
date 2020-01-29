import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import styled from "styled-components"
import Link from "@material-ui/core/Link"

import { BasicCard } from "@components/atoms/Card"

const HighRiskCard = styled(Box)``

const HighRiskCardContent = styled(Box)`
  display: flex;
  justify-content: space-between;
`

function item(props) {
  const { node } = props
  return (
    <HighRiskCard>
      <HighRiskCardContent>
        <Box>
          <Box>
            <Typography component="span" variant="body2" color="textPrimary">
              {node.district_zh}
            </Typography>
          </Box>
          <Box>
            <Typography component="span" variant="h6" color="textPrimary">
              {node.name_zh}
            </Typography>
          </Box>
          <Box>
            <Typography component="span" variant="body2" color="textPrimary">
              {node.source_zh}
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
        {node.details_zh}
      </Typography>
    </HighRiskCard>
  )
}

const HighRiskPage = ({ data, pageContext }) => {
  const sortedHighRisk = data.allHighRisk.edges.sort(
    (a, b) => Date.parse(b.node.last_seen) - Date.parse(a.node.last_seen)
  )
  const { t } = useTranslation()
  return (
    <Layout>
      <SEO title="HighRiskPage" />
      <Typography variant="h4">{t("high_risk.title")}</Typography>
      <Typography variant="body2">
        <Link
          href="https://www.chp.gov.hk/files/pdf/building_list_chi.pdf"
          target="_blank"
        >
          {t("high_risk.source")}
        </Link>
      </Typography>
      {sortedHighRisk.map((node, index) => (
        <BasicCard alignItems="flex-start" key={index} children={item(node)} />
      ))}
    </Layout>
  )
}

export default HighRiskPage

export const HighRiskQuery = graphql`
  query {
    allHighRisk {
      edges {
        node {
          district_zh
          name_zh
          sub_district_zh
          source_zh
          details_zh
          last_seen
        }
      }
    }
  }
`
