import React from "react"
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import { UnstyledLink } from "@/components/atoms/UnstyledLink"
import ContextStore from "@/contextStore"
import { DRAWER_OPEN } from "@/reducers/drawer"
import { useStaticQuery, graphql } from "gatsby"

function MobileAppBar(props) {
  const {
    drawer: { dispatch },
  } = React.useContext(ContextStore)

  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  return (
    <>
      <AppBar position="sticky">
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            component="span"
            aria-label="Search"
            onClick={() => {
              dispatch({ type: DRAWER_OPEN })
            }}
          >
            <MenuIcon />
          </IconButton>
          <UnstyledLink to={"/"}>
            <Typography variant="h1" align="center">
              <span role="img" aria-label={data.site.siteMetadata.title}>
                {data.site.siteMetadata.title}
              </span>
            </Typography>
          </UnstyledLink>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default MobileAppBar
