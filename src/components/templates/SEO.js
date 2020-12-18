/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@reach/router"
import { useTranslation } from "react-i18next"
import _isEmpty from "lodash.isempty"
import { removePathTrailingSlash } from "@/utils/urlHelper"

const SEO = ({ meta, uri, titleOveride }) => {
  const { t, i18n } = useTranslation()
  const { pathname: fullPath } = useLocation()
  const path = removePathTrailingSlash(
    fullPath.replace(/^\/en(?!\w)/, "").replace(/cases\/.*$/, "cases") || "/"
  )
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
  let title = ""
  if (titleOveride) {
    title = titleOveride
  } else {
    title = _isEmpty(currentPage) ? t("index.title") : t(currentPage.title)
    if (_isEmpty(currentPage) && !uri) {
      console.error(
        `cannot look up page title. check the settings for path: ${path}`
      )
    }
  }

  const image = `${site.siteMetadata.siteUrl}/images/og_share${
    i18n.language === "zh" ? "" : `_${i18n.language}`
  }.png`

  const localePath = i18n.language === "zh" ? "" : `${i18n.language} /`

  const siteURL = uri
    ? `${site.siteMetadata.siteUrl}/${localePath}${uri}`
    : `${site.siteMetadata.siteUrl}${fullPath}`
  return (
    <Helmet
      htmlAttributes={{
        lang: i18n.language,
      }}
      title={title}
      titleTemplate={`%s | ${t("site.title")}`}
      meta={(meta || []).concat([
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
          content: `${title} | ${t("site.title")}`,
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
          content: siteURL,
        },
        {
          property: `og:image`,
          content: image,
        },
        {
          property: "og:image:type",
          content: "image/png",
        },
        {
          property: "og:image:width",
          content: "1200",
        },
        {
          property: "og:image:width",
          content: "630",
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:title`,
          content: `${t(title)} | ${t("site.title")}`,
        },
        {
          name: `twitter:description`,
          content: t("site.description"),
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "mobile-web-app-capable",
          content: "yes",
        },
      ])}
    >
      <script
        src="https://widget.rss.app/v1/list.js"
        type="text/javascript"
      ></script>
    </Helmet>
  )
}

export default SEO
