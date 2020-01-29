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

const HourLabel = styled(Typography)`
  color: ${props => props.theme.palette.trafficLight[props.color]};
`

function WaitingTime(props) {
  const { t } = useTranslation()
  const [sign, timeInt] = props.time.split(" ")

  let color
  if (parseInt(timeInt) === 1 || (sign === "<" && parseInt(timeInt) <= 2)) {
    color = "green"
  } else if (
    (sign === ">" && parseInt(timeInt) === 2) ||
    parseInt(timeInt) === 3 ||
    (sign === "<" && parseInt(timeInt) <= 4)
  ) {
    color = "orange"
  } else {
    color = "red"
  }

  return (
    <HourLabel variant="h6" color={color}>
      {props.time}
      {t("waiting_time.hour")}
    </HourLabel>
  )
}

const AEWaitingTimePage = props => {
  const { data } = props
  const { t } = useTranslation()

  const item = ({ node }) => {
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
        <WaitingTime time={node.topWait} />
      </AECard>
    )
  }

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
      <Typography variant="body2">
        {t("waiting_time.last_updated")}
        {data.allAeWaitingTime.edges[0].node.hospTimeEn}
      </Typography>
      {data.allAeWaitingTime.edges.map((node, index) => (
        <BasicCard alignItems="flex-start" key={index} children={item(node)} />
      ))}
    </Layout>
  )
}

export default AEWaitingTimePage

export const AEWaitingTimeQuery = graphql`
  query {
    allAeWaitingTime(sort: { order: ASC, fields: topWait }) {
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
