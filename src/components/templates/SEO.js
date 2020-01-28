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
  const { site, configJson } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteUrl
          }
        }
        configJson {
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
  const image = `${site.siteMetadata.siteUrl}/images/og_share.png`

  return (
    <Helmet
      htmlAttributes={{
        lang: i18n.language,
      }}
      title={t(currentPage.title)}
      titleTemplate={`%s | ${t("site.title")}`}
      meta={[
        {
          name: `description`,
          content: t("site.description"),
        },
        {
          name: `keywords`,
          content: t("site.keywords"),
        },
        {
          name: "image",
          content: image,
        },
        {
          property: `og:title`,
          content: `${t(currentPage.title)} | ${t("site.title")}`,
        },
        {
          property: `og:description`,
          content: t("site.description"),
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:url`,
          content: site.siteMetadata.siteUrl,
        },
        {
          property: `og:image`,
          content: image,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:title`,
          content: `${t(currentPage.title)} | ${t("site.title")}`,
        },
        {
          name: `twitter:description`,
          content: t("site.description"),
        },
      ].concat(meta || [])}
    />
  )
}

export default SEO
