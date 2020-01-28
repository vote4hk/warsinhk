import React from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import Box from "@material-ui/core/Box"
import { BasicCard } from "@components/atoms/Card"
import styled from "styled-components"

const AECard = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

function item(props) {
  const { node } = props
  return (
    <AECard>
      <Box>
        <Typography variant="body2" color="textPrimary">
          {node.district_zh}
        </Typography>
        <Typography variant="body2" color="textPrimary">
          {node.hospName}
        </Typography>
      </Box>
      <Typography variant="h6" color="textPrimary">
        {node.topWait}
      </Typography>
    </AECard>
  )
}

const AEWaitingTimePage = props => {
  const { data } = props
  const { t } = useTranslation()
  return (
    <Layout>
      <SEO title="AEWaitingTimePage" />
      <Typography variant="h4">{t("waiting_time.title")}</Typography>
      <a href="https://data.gov.hk/tc-data/dataset/hospital-hadata-ae-waiting-time/resource/77e069db-4bfe-41cc-95f8-8be973477b09">
        {t("waiting_time.source_datagovhk")}
      </a>
      {data.allAeWaitingTime.edges.map((node, index) => (
        <BasicCard alignItems="flex-start" key={index} children={item(node)} />
      ))}
    </Layout>
  )
}

export default AEWaitingTimePage

export const AEWaitingTimeQuery = graphql`
  query {
    allAeWaitingTime {
      edges {
        node {
          hospName
          topWait
          district_zh
        }
      }
    }
  }
`
