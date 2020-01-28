import React from "react"
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import { UnstyledLink } from "@/components/atoms/UnstyledLink"
import ContextStore from "@/contextStore"
import { DRAWER_OPEN } from "@/reducers/drawer"
import { useTranslation } from "react-i18next"

function MobileAppBar(props) {
  const {
    drawer: { dispatch },
  } = React.useContext(ContextStore)
  const { t } = useTranslation()

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
              <span role="img" aria-label={t("site.title")}>
                {t("site.title")}
              </span>
            </Typography>
          </UnstyledLink>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default MobileAppBar
