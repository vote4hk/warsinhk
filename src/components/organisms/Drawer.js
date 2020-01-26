import React from 'react'
import styled from 'styled-components'
import { Box, IconButton, Drawer } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import ContextStore from '@/contextStore'
import { DRAWER_CLOSE } from '@/reducers/drawer'

const Container = styled(Box)`
  && {
    width: 100%;
  }
`

const MenuContainer = styled(Box)`
  && {
    margin-top: 48px;
    display: flex;
    width: 100%;
    flex-flow: column;
  }
`

const NavBarButton = styled(IconButton)`
  && {
    position: fixed;
    top: 0px;
    left: 0px;
    padding: 12px;
  }
`

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: '500px',
    maxWidth: '100%',
  },
}))

function AppDrawer(props) {
  const {
    drawer: { dispatch, state },
  } = React.useContext(ContextStore)
  const classes = useStyles()

  return (
    <Drawer
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
      open={state.open}
      variant="persistent"
    >
      <Container>
        <NavBarButton
          color="inherit"
          component="span"
          aria-label="Menu"
          onClick={() => {
            dispatch({ type: DRAWER_CLOSE })
          }}
        >
          <CloseIcon fontSize="small" />
        </NavBarButton>
        <MenuContainer>
        </MenuContainer>
      </Container>
    </Drawer>
  )
}

export default AppDrawer
