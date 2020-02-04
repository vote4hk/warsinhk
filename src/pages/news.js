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

// const GoogleNewsCard = ({ node }) => {
//   return (
//     <BasicCard>
//       {/* TODO: Using Link will render a wrong URL (en/zh)  */}
//       <a href={node.link} rel="noopener noreferrer" target="_blank">
//         <Typography variant="body2" color="textPrimary">
//           {`${node.date} ${node.time}`}
//         </Typography>
//         <Typography variant="body2" color="textPrimary">
//           {node.source}
//         </Typography>
//         <Typography variant="h6" color="textPrimary">
//           {node.title}
//         </Typography>
//       </a>
//     </BasicCard>
//   )
// }

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

  // const newsNode = _get(data, "allGoogleNews.edges[0].node", {})
  // const googleNews = withLanguage(i18n, newsNode, "gn")
  const govNews = data.allGovNews.edges.map(edge => edge.node)

  // const renderGoogleNews = () => {
  //   return (
  //     <>
  //       <Typography variant="h2">{t("news.title")}</Typography>
  //       <Typography variant="body2">
  //         <Link href={t("news.url")} target="_blank">
  //           {t("news.source_google")}
  //         </Link>
  //       </Typography>
  //       <Typography variant="body2">
  //         {t("waiting_time.last_updated")}
  //         {_get(googleNews, "[0].date", "")} {_get(googleNews, "[0].time", "")}
  //       </Typography>
  //       {googleNews.map((node, index) => (
  //         <GoogleNewsCard key={index} node={node} />
  //       ))}
  //     </>
  //   )
  // }

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
        {govNews.map((node, index) => (
          <GovNewsCard key={index} node={node} i18n={i18n} />
        ))}
      </>
    )
  }

  const tabs = [
    // {
    //   name: "google_news",
    //   title: t("news.title"),
    //   content: renderGoogleNews(),
    // },
    {
      name: "gov_news",
      title: t("gov_news.title"),
      content: renderGovNews(),
    },
  ]

  return (
    <Layout>
      <SEO title="NewsPage" />
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
  }
`
