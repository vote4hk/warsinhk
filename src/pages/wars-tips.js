import React from "react"
import styled from "styled-components"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import { MediaCard } from "@components/organisms/MediaCard"
import Box from "@material-ui/core/Box"
import { bps } from "@/ui/theme"

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
  const { t } = useTranslation()
  return (
    <Layout>
      <SEO title="WarsTipsPage" />
      <Typography variant="h4">{t("wars_tips.title")}</Typography>
      <CardsContainer>
        {data.allWarsTip.edges.map((edge, index) => {
          const { node } = edge
          return (
            <CardContainer key={index}>
              <MediaCard
                type="wars_tips"
                imageUrl={node.image_url}
                title={node.title}
                text={node.text}
                tags={node.tags}
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
