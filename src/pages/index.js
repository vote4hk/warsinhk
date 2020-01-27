import React from "react"
import SEO from "@/components/templates/SEO"
import App from "@components/App"
import Layout from "@components/templates/Layout"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Typography from "@material-ui/core/Typography"
import { useTranslation } from "react-i18next"
import { withLanguage } from "@/utils/i18n"
import { graphql } from "gatsby"

const IndexPage = ({ data, pageContext }) => {
  const { i18n } = useTranslation()
  return (
    <App locale={pageContext.locale}>
      <SEO title="Home" />
      <Layout>
        <Typography varient="h2">黑店list</Typography>
        <List aria-label="">
          {data.allDodgyShops.edges.map(({ node }, index) => (
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography component="span" variant="h6" color="textPrimary">
                    {`${withLanguage(
                      i18n,
                      node,
                      "sub_district"
                    )} - ${withLanguage(i18n, node, "name")}`}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {withLanguage(i18n, node, "address")}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {node.details}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Layout>
    </App>
  )
}

export default IndexPage

export const IndexQuery = graphql`
  query {
    allDodgyShops {
      edges {
        node {
          address_zh
          area
          details
          name_zh
          sub_district_zh
        }
      }
    }
  }
`
