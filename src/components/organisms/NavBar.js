import React from "react"
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import { UnstyledLink } from "@/components/atoms/UnstyledLink"
import styled from "styled-components"
import ContextStore from "@/contextStore"
import { DRAWER_OPEN } from "@/reducers/drawer"
import { useStaticQuery, Link, graphql } from "gatsby"

const StyledAppBar = styled(AppBar)`
  && {

  }
`

const AppBarTitle = styled(UnstyledLink)`
  && {
  }
`

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
      <StyledAppBar position="sticky">
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            component="span"
            aria-label="Search"
            onClick={() => {
              dispatch({ type: DRAWER_OPEN })
              // fireEvent({
              //   ca: 'general',
              //   ac: 'click',
              //   lb: 'menu_drawer',
              // })
            }}
          >
            <MenuIcon />
          </IconButton>
          <AppBarTitle to={"/"}>
            <Typography variant="h1" align="center">
              <span role="img" aria-label={data.site.siteMetadata.title}>
                {data.site.siteMetadata.title}
              </span>
            </Typography>
          </AppBarTitle>
          {/* <LanguageSwitcher
            onClick={() =>
              fireEvent({
                ca: 'general',
                ac: 'click',
                lb: 'lang_switcher_button', //TODO: do we need that?
              })
            }
          /> */}
        </Toolbar>
      </StyledAppBar>
    </>
  )
}

export default MobileAppBar
