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
          {node.date}
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
      <Typography variant="h4">{t("gov_news.title")}</Typography>
      <Typography variant="body2">
        <Link
          href="https://www.news.gov.hk/chi/index.html"
          target="_blank"
        >
          {t("gov_news.source")}
        </Link>
      </Typography>
      <Typography variant="body2">
        {t("waiting_time.last_updated")}
        {data.allGovNews.edges[0].node.date}
      </Typography>
      {data.allGovNews.edges.map((node, index) => (
        <a href="{node.link}" target="_blank" key={index} children={item(node)} />
      ))}
    </Layout>
  )
}

export default NewsPage

export const GovNewsQuery = graphql`
  query {
    allGovNews(sort: { order: DESC, fields: date }) {
      edges {
        node {
          title
          link
          date
        }
      }
    }
  }
`