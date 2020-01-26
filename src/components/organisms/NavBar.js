import React from 'react'
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { UnstyledLink } from '@/components/atoms/UnstyledLink'
import styled from 'styled-components'
import ContextStore from '@/contextStore'
import { DRAWER_OPEN } from '@/reducers/drawer'
import { COLORS } from '@/ui/theme';

const StyledAppBar = styled(AppBar)`
  && {
    width: 100%;
    box-shadow: none;
    background: ${COLORS.main.background}
  }
`

const AppBarTitle = styled(UnstyledLink)`
  && {
    left: auto;
    right: auto;
    width: 100%;
    position: absolute;
  }
`


function MobileAppBar(props) {
  const {
    drawer: { dispatch },
  } = React.useContext(ContextStore)

  return (
    <>
      <StyledAppBar position="sticky">
        <Toolbar disableGutters>

          <AppBarTitle to={'/'}>
            <Typography variant="h1" align="center">
              <span role="img" aria-label="Vote4.hk ✋🏻💜⚡">
                Vote4.hk ✋🏻💜⚡
              </span>
            </Typography>
          </AppBarTitle>
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
