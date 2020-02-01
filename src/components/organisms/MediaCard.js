import React from "react"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { Link, Chip } from "@material-ui/core"
import styled from "styled-components"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

const StyledMediaCard = styled(Card)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledCardMedia = styled(CardMedia)`
  height: 400px;
`

export function MediaCard(props) {
  const {
    title,
    text,
    imageUrl,
    sourceDescription,
    sourceUrl,
    type,
    tags,
  } = props
  return (
    <StyledMediaCard>
      <Link
        href={sourceUrl}
        onClick={() => {
          trackCustomEvent({
            category: type,
            action: "click",
            label: sourceUrl,
          })
        }}
        target="_blank"
      >
        <StyledCardMedia image={imageUrl} title="Contemplative Reptile" />
      </Link>
      <CardContent>
        {tags &&
          tags.split(",").map((tag, index) => (
            <Chip
              key={index}
              variant="outlined"
              size="small"
              label={tag}
              onClick={evt => {
                console.log(evt)
                evt.stopPropagation()
                evt.preventDefault()
              }}
            ></Chip>
          ))}
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>

        {text && (
          <Typography variant="body2" color="textSecondary" component="p">
            {text}
          </Typography>
        )}
      </CardContent>
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
