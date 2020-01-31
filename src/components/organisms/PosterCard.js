import React from "react"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardMedia from "@material-ui/core/CardMedia"
import Link from "@material-ui/core/Link"
import styled from "styled-components"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

const StyledPosterCard = styled(Card)`
  width: 100%;
`

const StyledCardMedia = styled(CardMedia)``

export function PosterCard(props) {
  const { imageUrl, sourceUrl } = props

  return (
    <StyledPosterCard>
      <CardActionArea>
        <Link
          href={sourceUrl}
          onClick={() => {
            trackCustomEvent({
              category: "poster_gallery",
              action: "click",
              label: sourceUrl,
            })
          }}
          target="_blank"
        >
          <StyledCardMedia component="img" src={imageUrl} />
        </Link>
      </CardActionArea>
    </StyledPosterCard>
  )
}
