import React from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import Link from "@material-ui/core/Link"
import { BasicCard } from "@components/atoms/Card"
import { withLanguage } from "../utils/i18n"
import _get from "lodash.get"
import { SimpleTabs } from "@/components/organisms/SimpleTabs"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import { ResponsiveWrapper } from "@components/atoms/ResponsiveWrapper"
import styled from "styled-components"

const UpdatesContainer = styled(BasicCard)`
  font-size: 16px;

  a {
    color: ${props => props.theme.palette.primary.main};
  }
  p {
    margin-bottom: 8px;
  }

  ol {
    margin-right: 16px;
    list-style-type: decimal;
    list-style-position: inside;
  }
`

const GovNewsCard = ({ node, i18n }) => {
  return (
    <BasicCard>
      {/* TODO: Using Link will render a wrong URL (en/zh)  */}
      <a
        href={withLanguage(i18n, node, "link")}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Typography variant="body2" color="textPrimary">
          {node.date}
        </Typography>
        <Typography variant="h6" color="textPrimary">
          {withLanguage(i18n, node, "title")}
        </Typography>
      </a>
    </BasicCard>
  )
}

const NewsPage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()

  const paragraphArray = data.allUpdates.edges
    .filter(e => e.node.type === "paragraph")
    .map(e => withLanguage(i18n, e.node, "text"))

  const listItemArray = data.allUpdates.edges
    .filter(e => e.node.type === "item")
    .map(e => withLanguage(i18n, e.node, "text"))

  const govNews = data.allGovNews.edges.map(edge => edge.node)

  const renderNotes = () => {
    return (
      <>
        <Typography variant="h2">{t("updates.title")}</Typography>
        <UpdatesContainer>
          <p
            dangerouslySetInnerHTML={{
              __html: t("importantInformation.chp_hotline"),
            }}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: t("importantInformation.had_hotline"),
            }}
          />
          {paragraphArray.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
          <ol type="i">
            {listItemArray.map((li, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: li }} />
            ))}
          </ol>
        </UpdatesContainer>
      </>
    )
  }

  const renderGovNews = () => {
    return (
      <>
        <Typography variant="h2">{t("gov_news.title")}</Typography>
        <Typography variant="body2">
          <Link href={t("gov_news.url")} target="_blank">
            {t("gov_news.source")}
          </Link>
        </Typography>
        <Typography variant="body2">
          {t("waiting_time.last_updated")}
          {_get(govNews, "[0].date", "")}
        </Typography>
        <ResponsiveWrapper>
          {govNews.map((node, index) => (
            <GovNewsCard key={index} node={node} i18n={i18n} />
          ))}
        </ResponsiveWrapper>
      </>
    )
  }

  const tabs = [
    {
      name: "updates",
      title: t("updates.title"),
      content: renderNotes(),
    },
    {
      name: "gov_news",
      title: t("gov_news.title"),
      content: renderGovNews(),
    },
  ]

  return (
    <Layout>
      <SEO title="UpdatesPage" />
      <SimpleTabs
        tabs={tabs}
        onTabChange={name => {
          trackCustomEvent({
            category: "news",
            action: "tab_select",
            label: name,
          })
        }}
      />
    </Layout>
  )
}

export default NewsPage

export const NotesQuery = graphql`
  query {
    allGovNews(sort: { order: DESC, fields: date }) {
      edges {
        node {
          title_en
          title_zh
          link_en
          link_zh
          date
        }
      }
    }
    allUpdates(filter: { enabled: { eq: "Y" } }) {
      edges {
        node {
          order
          type
          text_zh
          text_en
        }
      }
    }
  }
`
