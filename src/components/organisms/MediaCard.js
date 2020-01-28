import React from "react"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import styled from "styled-components"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

const StyledMediaCard = styled(Card)`
  width: 100%;
`

const StyledCardMedia = styled(CardMedia)`
  height: 400px;
`

export function MediaCard(props) {
  const { title, text, imageUrl, sourceDescription, sourceUrl } = props

  return (
    <StyledMediaCard>
      <CardActionArea>
        <Link
          href={sourceUrl}
          onClick={() => {
            trackCustomEvent({
              category: "hygiene_tips",
              action: "click",
              label: sourceUrl,
            })
          }}
          target="_blank"
        >
          <StyledCardMedia image={imageUrl} title="Contemplative Reptile" />
        </Link>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          {text && (
            <Typography variant="body2" color="textSecondary" component="p">
              {text}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          href={sourceUrl}
          onClick={() => {
            trackCustomEvent({
              category: "hygiene_tips",
              action: "click_source",
              label: sourceUrl,
            })
          }}
        >
          {`資料來源：${sourceDescription}`}
        </Button>
      </CardActions>
    </StyledMediaCard>
  )
}
