import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"

import { BasicCard } from "@components/atoms/Card"

function item(props) {
  const { node } = props
  return (
    <>
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
          {node.last_appear}
        </Typography>
      </Box>
      <Box>
        <Typography component="span" variant="body2" color="textPrimary">
          {node.source}
        </Typography>
      </Box>
      <Box>
        <Typography component="span" variant="body2" color="textPrimary">
          {node.details}
        </Typography>
      </Box>
    </>
  )
}

const HighRiskPage = ({ data, pageContext }) => {
  const { t } = useTranslation()
  return (
    <Layout>
      <SEO title="HighRiskPage" />
      <Typography variant="h4">{t("high_risk.title")}</Typography>
      {data.allHighRisk.edges.map((node, index) => (
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
          source
          details
        }
      }
    }
  }
`
