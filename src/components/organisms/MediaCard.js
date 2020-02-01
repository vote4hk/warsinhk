import React from "react"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { Link } from "gatsby"
import styled from "styled-components"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import { useTranslation } from "react-i18next"

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

const StyledCardContent = styled(CardContent)`
  flex-grow: 1;
`

export function MediaCard(props) {
  const {
    title,
    text,
    imageUrl,
    sourceDescription,
    sourceUrl,
    tags,
    onTagClicked,
    uri,
  } = props
  const { t } = useTranslation()
  return (
    <StyledMediaCard>
      <>
        <Link to={uri}>
          <StyledCardMedia image={imageUrl} title="Contemplative Reptile" />
        </Link>

        <StyledCardContent>
          {tags &&
            tags.map((tag, index) => (
              <Button
                key={index}
                size="small"
                color="primary"
                href={sourceUrl}
                onClick={evt => {
                  onTagClicked(tag)
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
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>

          {text && (
            <Typography variant="body2" color="textSecondary" component="p">
              {text}
            </Typography>
          )}
        </StyledCardContent>
      </>

      <CardActions>
        <Button
          size="small"
          color="primary"
          href={sourceUrl}
          onClick={() => {
            trackCustomEvent({
              category: "wars_tips",
              action: "click_source",
              label: sourceUrl,
            })
          }}
        >
          {`${t("wars_tips.source")}${sourceDescription}`}
        </Button>
      </CardActions>
    </StyledMediaCard>
  )
}
