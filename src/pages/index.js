import React from "react"
import SEO from "@/components/templates/SEO"
import App from "@components/App"
import Layout from "@components/templates/Layout"
import SimpleTabs from "@components/organisms/SimpleTabs"

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

const IndexPage = ({ data, pageContext }) => {
  return (
    <App locale={pageContext.locale}>
      <SEO title="Home" />
      <Layout>
        {/* <SimpleTabs
          tabs={[
            {
              title: "港島",
              content: "Buttons of subdistricts",
            },
            {
              title: "九龍",
              content: "Buttons of subdistricts",
            },
            {
              title: "新界",
              content: "Buttons of subdistricts",
            },
          ]}
        /> */}
        <Typography varient='h2'>黑店list</Typography>
        <List aria-label="">
          {data.allDodgyShops.edges.map(({ node }, index) => (
            <ListItem alignItems="flex-start">
              {/* <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar> */}
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    variant="body1"
                    color="textPrimary"
                  >
                    {node.name_zh}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {node.address_zh}
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