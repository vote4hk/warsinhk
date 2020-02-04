import React from "react"
import styled from "styled-components"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Button from "@material-ui/core/Button"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import { graphql } from "gatsby"
import { PosterCard } from "@components/organisms/PosterCard"
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

const Container = styled.div`
  text-align: center;
  margin-top: 24px;
`

const PosterGalleryPage = ({ data, pageContext }) => {
  const { t } = useTranslation()
  return (
    <Layout>
      <SEO title="PosterGalleryPage" />
      <Typography variant="h2">{t("poster_gallery.title")}</Typography>
      <Typography variant="body2">
        <Link
          href="https://www.collaction.hk/lab/extradition_gallery?tag=武漢肺炎"
          target="_blank"
        >
          {t("poster_gallery.source")}
        </Link>
      </Typography>
      <Typography variant="body2">
        {t("poster_gallery.last_updated")}
      </Typography>
      <CardsContainer>
        {data.allPosterGallery.edges.map((edge, index) => {
          const { node } = edge
          return (
            <CardContainer key={index}>
              <PosterCard
                imageUrl={node.cover_image_url}
                sourceUrl={node.url}
                text={node.source}
              />
            </CardContainer>
          )
        })}
      </CardsContainer>

      <Container>
        <div>
          <Button
            style={{ justifyContent: "center" }}
            variant="contained"
            color="primary"
            target="_blank"
            href="https://www.collaction.hk/lab/extradition_gallery?tag=武漢肺炎"
          >
            {t("poster_gallery.more")}
          </Button>
        </div>
      </Container>
    </Layout>
  )
}

export default PosterGalleryPage

export const PosterGalleryQuery = graphql`
  query {
    allPosterGallery {
      edges {
        node {
          source
          cover_image_url
          image_count
          url
        }
      }
    }
  }
`
