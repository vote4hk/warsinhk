import React from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import { BasicCard } from "@components/atoms/Card"
import styled from "styled-components"

const AECard = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

function item(props) {
  const { node } = props
  const { t } = useTranslation()
  return (
    <AECard>
      <Box>
        <Typography variant="body2" color="textPrimary">
          {node.district_zh}
        </Typography>
        <Typography variant="body2" color="textPrimary">
          {node.hospNameB5}
        </Typography>
      </Box>
      <Typography variant="h6" color="textPrimary">
        {node.topWait} {t("waiting_time.hour")}
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
      <Typography variant="body2">
        <Link
          href="https://www.ha.org.hk/visitor/ha_visitor_index.asp?Content_ID=235504&Lang=CHIB5"
          target="_blank"
        >
          {t("waiting_time.source_datagovhk")}
        </Link>
      </Typography>
      <Typography variant="body2">{t("waiting_time.last_updated")}{data.allAeWaitingTime.edges[0].node.hospTimeEn}</Typography>
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
          hospNameB5
          hospNameEn
          hospCode
          hospTimeEn
          topWait
          district_zh
        }
      }
    }
  }
`

