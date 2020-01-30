import React from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import Link from "@material-ui/core/Link"
import { BasicCard } from "@components/atoms/Card"
import styled from "styled-components"
import { withLanguage } from "../utils/i18n"
import _ from "lodash"

const NewsCard = styled(BasicCard)`
  margin-top: 8px;
  margin-bottom: 8px;
`

const NewsPage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()

  const item = ({ node }) => {
    return (
      <NewsCard>
        {/* TODO: Using Link will render a wrong URL (en/zh)  */}
        <a
          href={withLanguage(i18n, node, "link")}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Typography variant="body2" color="textPrimary">
            {`${node.date} ${node.time}`}
          </Typography>
          <Typography variant="body2" color="textPrimary">
            {withLanguage(i18n, node, "source")}
          </Typography>
          <Typography variant="h6" color="textPrimary">
            {withLanguage(i18n, node, "title")}
          </Typography>
        </a>
      </NewsCard>
    )
  }

  return (
    <Layout>
      <SEO title="NewsPage" />
      <Typography variant="h4">{t("news.title")}</Typography>
      <Typography variant="body2">
        <Link href={t("news.url")} target="_blank">
          {t("news.source_google")}
        </Link>
      </Typography>
      <Typography variant="body2">
        {t("waiting_time.last_updated")}
        {_.get(data.allGoogleNews, "edges[0].node.date", "")}{" "}
        {_.get(data.allGoogleNews, "edges[0].node.time", "")}
      </Typography>
      {data.allGoogleNews.edges.map((node, index) => (
        <div key={index} children={item(node)} />
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
          title_en
          title_zh
          link_en
          link_zh
          source_en
          source_zh
          isoDate
          date
          time
        }
      }
    }
  }
`
