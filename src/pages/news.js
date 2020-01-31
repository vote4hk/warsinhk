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

  const newsNode = _.get(data, "allGoogleNews.edges[0].node", {})
  const news = withLanguage(i18n, newsNode, "gn")

  const item = ({ node }) => {
    return (
      <NewsCard>
        {/* TODO: Using Link will render a wrong URL (en/zh)  */}
        <a
          href={node.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Typography variant="body2" color="textPrimary">
            {`${node.date} ${node.time}`}
          </Typography>
          <Typography variant="body2" color="textPrimary">
            {node.source}
          </Typography>
          <Typography variant="h6" color="textPrimary">
            {node.title}
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
        {_.get(news, "[0].date", '')}{" "}
        {_.get(news, "[0].time", '')}
      </Typography>
      {news.map((node, index) => (
        <div key={index} children={item({node})} />
      ))}
    </Layout>
  )
}

export default NewsPage

export const GoogleNewsQuery = graphql`
  query {
    allGoogleNews {
      edges {
        node {
          gn_en {
            title
            link
            source
            isoDate
            date
            time
          }
          gn_zh {
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
  }
`
