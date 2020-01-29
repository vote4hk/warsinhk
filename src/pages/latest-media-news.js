import React from "react"
import styled from "styled-components"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import { MediaCard } from "@components/organisms/MediaCard"
import Box from "@material-ui/core/Box"

const LatestMediaNewsPage = ({ data, pageContext }) => {
  const { t } = useTranslation()
  return (
    <Layout>
      <SEO title="LatestMediaNewsPage" />
      <Typography variant="h4">{t("latest_media_news.title")}</Typography>
      <rssapp-list id="4rfSeuaLAKEOtTc7"></rssapp-list>
    </Layout>
  )
}

export default LatestMediaNewsPage
