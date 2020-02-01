import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import {
  CardActions,
  CardContent,
  Button,
  Typography,
  Link,
} from "@material-ui/core/"
import styled from "styled-components"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import { useTranslation } from "react-i18next"

const Image = styled.img`
  width: 100%;
`

export default ({ pageContext }) => {
  const { node, uri } = pageContext
  const { t } = useTranslation()
  const { title, text, image_url, source_description, source_url } = node
  return (
    <Layout hideAlerts={true}>
      <SEO title="WarsTip" uri={uri} />
      <>
        <Link
          href={source_url}
          onClick={() => {
            trackCustomEvent({
              category: "wars_tip",
              action: "click",
              label: source_url,
            })
          }}
        >
          <Image src={image_url} alt="test" />
        </Link>
      </>
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
      <CardActions>
        <Button
          size="small"
          color="primary"
          href={source_url}
          onClick={() => {
            trackCustomEvent({
              category: "wars_tips",
              action: "click_source",
              label: source_url,
            })
          }}
        >
          {`${t("wars_tips.source")}${source_description}`}
        </Button>
      </CardActions>
    </Layout>
  )
}
