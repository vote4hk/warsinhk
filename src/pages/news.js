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

const NewsCard = styled(BasicCard)`
  margin-top: 8px;
  margin-bottom: 8px;
`

const NewsPage = props => {
  const { data } = props
  const { t } = useTranslation()

  const item = ({ node }) => {
    return (
      <NewsCard>
        <Typography variant="body2" color="textPrimary">
          {node.source} {node.date} {node.time}
        </Typography>
        <Typography variant="h6" color="textPrimary">
          {node.title}
        </Typography>
      </NewsCard>
    )
  }

  return (
    <Layout>
      <SEO title="NewsPage" />
      <Typography variant="h4">{t("news.title")}</Typography>
      <Typography variant="body2">
        <Link
          href="https://news.google.com/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR1J4T1hBU0JYcG9MVWhMS0FBUAE?hl=zh"
          target="_blank"
        >
          {t("news.source_google")}
        </Link>
      </Typography>
      <Typography variant="body2">
        {t("waiting_time.last_updated")}
        {data.allGoogleNews.edges[0].node.date} {data.allGoogleNews.edges[0].node.time}
      </Typography>
      {data.allGoogleNews.edges.map((node, index) => (
        <a href="{node.link}" target="_blank" key={index} children={item(node)} />
      ))}
    </Layout>
  )
}

export default NewsPage

export const GoogleNewsQuery = graphql`
  query {
    allGoogleNews(sort: { order: DESC, fields: isoDate }) {
      edges {
        node {
          title
          link
          source
          isoDate
          date
          time
        }
      }
    }
  }
`