import React from "react"
import { useTranslation } from "react-i18next"
import Button from "@material-ui/core/Button"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import Grid from "@material-ui/core/Grid"
import Link from "@material-ui/core/Link"

const FriendlyLinksContainer = styled.div`
  margin-bottom: 16px;
`

const FullWidthButton = styled(Button)`
  width: 100%;
  padding: 6px 10px;
`

export default function ConfirmedCaseVisual(props) {
  const { i18n } = useTranslation()

  const data = useStaticQuery(
    graphql`
      query {
        allFriendlyLink(sort: { fields: sort_order, order: DESC }) {
          edges {
            node {
              language
              title
              source_url
              sort_order
            }
          }
        }
      }
    `
  )

  // since useStateQuery cannot pass variables, hence we do the filtering here
  return (
    <FriendlyLinksContainer>
      <Grid container spacing={1}>
        {data.allFriendlyLink.edges
          .filter(({ node }) => node.language === i18n.language)
          .map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FullWidthButton
                index={index}
                component={Link}
                href={item.node.source_url}
                target="_blank"
                variant="outlined"
              >
                {item.node.title}
              </FullWidthButton>
            </Grid>
          ))}
      </Grid>
    </FriendlyLinksContainer>
  )
}
