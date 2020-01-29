import React from "react"
import styled from "styled-components"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import { MediaCard } from "@components/organisms/MediaCard"
import Box from "@material-ui/core/Box"

const CardsContainer = styled(Box)`
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
`
const CardContainer = styled(Box)`
  flex: 0 1 calc(25% - 1em);
  margin-bottom: 8px;
  margin-right: 8px;

  @media screen and (max-width: 60em) {
    flex: 0 1 calc(100% - 1em);
  }
`

const HygieneTipsPage = ({ data, pageContext }) => {
  const { t } = useTranslation()
  return (
    <Layout>
      <SEO title="HygieneTipsPage" />
      <Typography variant="h4">{t("hygiene_tips.title")}</Typography>
      <CardsContainer>
        {data.allHygieneTips.edges.map((edge, index) => {
          const { node } = edge
          return (
            <CardContainer key={index}>
              <MediaCard
                imageUrl={node.image_url}
                title={node.title}
                text={node.text}
                sourceDescription={node.source_description}
                sourceUrl={node.source_url}
              />
            </CardContainer>
          )
        })}
      </CardsContainer>
    </Layout>
  )
}

export default HygieneTipsPage

export const HighRiskQuery = graphql`
  query {
    allHygieneTips {
      edges {
        node {
          title
          text
          image_url
          source_description
          source_url
          tags
        }
      }
    }
  }
`
