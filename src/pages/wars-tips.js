import React, { useState } from "react"
import styled from "styled-components"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import { Typography, Button } from "@material-ui/core"
import { graphql } from "gatsby"
import { MediaCard } from "@components/organisms/MediaCard"
import Box from "@material-ui/core/Box"
import { bps } from "@/ui/theme"
import _ from "lodash"
import { getWarTipPath } from "@/utils/urlHelper"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

const CardsContainer = styled(Box)`
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
`
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

const WarTipsPage = ({ data, pageContext }) => {
  console.log(pageContext)
  const { t, i18n } = useTranslation()
  const [selectedTag, setSelectedTag] = useState(null)

  const filterByTags = ({ node }) => {
    if (!node.tags || !selectedTag) {
      return true
    }
    return !!node.tags.split(",").find(tag => tag === selectedTag)
  }

  const getAllTags = edges => {
    return _.uniq(
      _.flatten(
        edges.map(edge => (edge.node.tags ? edge.node.tags.split(",") : []))
      )
    )
  }

  return (
    <Layout>
      <SEO title="WarsTipsPage" />
      <Typography variant="h4">{t("wars_tips.title")}</Typography>
      {getAllTags(data.allWarsTip.edges).map(tag => (
        <Button
          key={tag}
          size="small"
          color={tag === selectedTag ? "secondary" : "primary"}
          onClick={evt => {
            setSelectedTag(tag === selectedTag ? null : tag)
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
      <CardsContainer>
        {data.allWarsTip.edges.filter(filterByTags).map((edge, index) => {
          const { node } = edge
          return (
            <CardContainer key={index}>
              <MediaCard
                imageUrl={node.image_url}
                title={node.title}
                text={node.text}
                tags={node.tags ? node.tags.split(",") : []}
                sourceDescription={node.source_description}
                sourceUrl={node.source_url}
                onTagClicked={tag => {
                  setSelectedTag(tag === selectedTag ? null : tag)
                }}
                uri={getWarTipPath(i18n.language, node.title)}
              />
            </CardContainer>
          )
        })}
      </CardsContainer>
    </Layout>
  )
}

export default WarTipsPage

export const WarsTipsQuery = graphql`
  query {
    allWarsTip(sort: { fields: [sort_order, date], order: [DESC, DESC] }) {
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
