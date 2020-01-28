/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import ContextStore from "@/contextStore"
import { useTranslation } from "react-i18next"

const SEO = ({ meta }) => {
  const { t, i18n } = useTranslation()

  const {
    route: {
      state: { path },
    },
  } = React.useContext(ContextStore)
  const { configJson } = useStaticQuery(
    graphql`
      query {
        configJson {
          siteMetaData {
            url
          }
          languages
          pages {
            title
            to
            icon
          }
        }
      }
    `
  )

  const currentPage = configJson.pages.find(p => p.to === path) || {}
  const image = `${configJson.siteMetaData.url}/images/og_share.png`
  const metaDescription = t("site.description")

  return (
    <Helmet
      htmlAttributes={{
        lang: i18n.language,
      }}
      title={t(currentPage.title)}
      titleTemplate={`%s | ${t("site.description")}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: "image",
          content: image,
        },
        {
          property: `og:title`,
          content: t("site.description"),
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:title`,
          content: t("site.description"),
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta || [])}
    />
  )
}

export default SEO
