import React, { useState } from "react"
import styled from "styled-components"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Typography, Button } from "@material-ui/core"
import { graphql } from "gatsby"
import { MediaCard } from "@components/organisms/MediaCard"
import { Box } from "@material-ui/core"
import { bps } from "@/ui/theme"
import _flatten from "lodash.flatten"
import _uniq from "lodash.uniq"
import { getWarTipPath } from "@/utils/urlHelper"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import InfiniteScroll from "@/components/molecules/InfiniteScroll"
import { ResponsiveWrapper } from "@components/atoms/ResponsiveWrapper"

const CardContainer = styled(Box)`
  flex: 1 1 calc(25% - 1em);
  margin-bottom: 24px;
  margin-right: 16px;
  ${bps.down("md")} {
    margin-bottom: 16px;
  }

  @media screen and (max-width: 60em) {
    flex: 0 1 calc(100% - 1em);
  }
`

const WarTipsPage = ({ data, location }) => {
  const { t, i18n } = useTranslation()
  const [selectedTag, setSelectedTag] = useState(null)

  const filterByTags = ({ node }) => {
    if (!node.tags || !selectedTag) {
      return true
    }
    return !!node.tags.split(",").find(tag => tag === selectedTag)
  }

  const getAllTags = edges => {
    return _uniq(
      _flatten(
        edges.map(edge => (edge.node.tags ? edge.node.tags.split(",") : []))
      )
    )
  }

  const shorten = str => {
    return str ? `${str.substring(0, 50)}...` : ""
  }
  React.useEffect(() => {
    if (location.hash) {
      const tag = decodeURIComponent(location.hash.replace(/^#/, ""))
      setSelectedTag(tag)
    }
  }, [location.hash])

  return (
    <Layout>
      <SEO title="WarsTipsPage" />
      <Typography variant="h2">{t("wars_tips.title")}</Typography>
      {getAllTags(data.allWarsTip.edges).map(tag => (
        <Button
          key={tag}
          size="small"
          color={tag === selectedTag ? "secondary" : "primary"}
          onClick={evt => {
            const tagToSet = tag === selectedTag ? null : tag
            setSelectedTag(tagToSet)
            window.location.href = `#${tagToSet || ""}`
            trackCustomEvent({
              category: "wars_tips",
              action: "click_tag",
              label: tag,
            })
            evt.stopPropagation()
            evt.preventDefault()
          }}
        >
          {`#${tag}`}
        </Button>
      ))}
      <InfiniteScroll
        list={data.allWarsTip.edges.filter(filterByTags)}
        step={{ mobile: 5 }}
        Wrapper={ResponsiveWrapper}
        onItem={({ node }, index) => (
          <CardContainer key={index}>
            <MediaCard
              imageUrl={node.image_url}
              title={node.title}
              text={shorten(node.text)}
              tags={node.tags ? node.tags.split(",") : []}
              sourceDescription={node.source_description}
              sourceUrl={node.source_url}
              onTagClicked={tag => {
                setSelectedTag(tag === selectedTag ? null : tag)
              }}
              uri={getWarTipPath(i18n.language, node.title)}
            />
          </CardContainer>
        )}
      />
    </Layout>
  )
}

export default WarTipsPage

export const WarsTipsQuery = graphql`
  query getWarsTips($locale: String) {
    allWarsTip(
      sort: { fields: [sort_order, date], order: [DESC, DESC] }
      filter: { language: { eq: $locale } }
    ) {
      edges {
        node {
          title
          text
          date
          image_url
          source_description
          source_url
          tags
          language
        }
      }
    }
  }
`
