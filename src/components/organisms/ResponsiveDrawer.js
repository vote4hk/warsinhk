import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Divider from "@material-ui/core/Divider"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import IconButton from "@material-ui/core/IconButton"
import { useMediaQuery } from "@material-ui/core"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import { mapIcon } from "@components/icons"
import ZoomInIcon from "@material-ui/icons/ZoomIn"
import ZoomOutIcon from "@material-ui/icons/ZoomOut"
import FormatSizeIcon from "@material-ui/icons/FormatSize"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import ShareButton from "@/components/organisms/ShareButton"
import styled from "styled-components"
import Link from "@material-ui/core/Link"
import { UnstyledLink } from "@components/atoms/UnstyledLink"
import { getLocalizedPath } from "@/utils/i18n"
import LanguageSwitcher from "@/components/organisms/LanguageSwitcher"
import { bps } from "@/ui/theme"
import ContextStore from "@/contextStore"
import { FONT_ZOOMOUT, FONT_ZOOMIN } from "@/reducers/pageOptions"

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  appTitleLink: {
    color: "inherit",
    textDecoration: "inherit",
    "&:hover": {
      textDecoration: "none",
    },
  },
  menuButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    justifyContent: "space-between",
    borderRight: "none",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

const AppTitle = styled(Typography)`
  && {
    flex-grow: 1;
    text-align: center;
  }
`
const LanguageSwitcherContainer = styled(ListItem)`
  min-height: 56px;
  ${bps.up("sm")} {
    min-height: 64px;
  }
`

const StyledIconButton = styled(IconButton)`
  padding: 0 16px 0 0;
  &:hover {
    background-color: transparent;
  }

  svg:hover {
    fill: ${props => props.theme.palette.primary.main};
  }
`

const AboutButton = styled(UnstyledLink)`
  margin: 10px 20px;
`

function ResponsiveDrawer(props) {
  const { container, pages, children, className } = props
  const classes = useStyles()
  const isDesktop = useMediaQuery(bps.up("sm"))
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { t, i18n } = useTranslation()
  const {
    pageOptions: { dispatch },
  } = React.useContext(ContextStore)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = pages => {
    return (
      <div>
        <div />
        <LanguageSwitcherContainer>
          <ListItemIcon>{mapIcon("translate")}</ListItemIcon>
          <LanguageSwitcher />
        </LanguageSwitcherContainer>
        <Divider />
        <List style={{ padding: "10px 20px" }}>
          <UnstyledLink
            to={getLocalizedPath(i18n, "/")}
            activeClassName={"active"}
          >
            <ListItem>
              <ListItemIcon>{mapIcon("home")}</ListItemIcon>
              <ListItemText primary={t("text.homepage")} />
            </ListItem>
          </UnstyledLink>
          {pages.map((page, index) => (
            <UnstyledLink
              to={getLocalizedPath(i18n, page.to)}
              key={index}
              activeClassName={"active"}
            >
              <ListItem>
                <ListItemIcon>{mapIcon(page.icon)}</ListItemIcon>
                <ListItemText primary={t(page.title)} />
              </ListItem>
            </UnstyledLink>
          ))}
        </List>
        <Divider />
        <LanguageSwitcherContainer>
          <ListItemIcon>
            <FormatSizeIcon />
          </ListItemIcon>
          <StyledIconButton
            onClick={() => {
              dispatch({ type: FONT_ZOOMOUT })
            }}
          >
            <ZoomOutIcon />
          </StyledIconButton>
          <StyledIconButton
            onClick={() => {
              dispatch({ type: FONT_ZOOMIN })
            }}
          >
            <ZoomInIcon />
          </StyledIconButton>
        </LanguageSwitcherContainer>
        {/* Only show the forms in chinese as we do not have english form.. */}

        {i18n.language === "zh" && (
          <Link target="_blank" href="https://forms.gle/1M96G6xHH2tku4mJ8">
            <ListItem>
              <ListItemIcon>{mapIcon("contact_support")}</ListItemIcon>
              <ListItemText primary={t("text.help_us")} />
            </ListItem>
          </Link>
        )}
      </div>
    )
  }

  const drawerFooter = () => (
    <div>
      <AboutButton
        to={getLocalizedPath(i18n, "/about-us")}
        activeClassName={"active"}
      >
        <ListItem>
          <ListItemIcon>
            {mapIcon("sentiment_satisfied", { color: "secondary" })}
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ color: "secondary" }}
            primary={t("about_us.title")}
          />
        </ListItem>
      </AboutButton>
    </div>
  )

  // don't render the drawer frequently
  const menu = React.useMemo(
    () =>
      isDesktop ? (
        <SwipeableDrawer
          onOpen={() => {}}
          onClose={() => {}}
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer(pages)}
          {drawerFooter()}
        </SwipeableDrawer>
      ) : (
        <SwipeableDrawer
          container={container}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onOpen={() => {}}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer(pages)}
          {drawerFooter()}
        </SwipeableDrawer>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDesktop, mobileOpen]
  )

  return (
    <div className={`${classes.root} ${className}`}>
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.appToolBar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            {mapIcon("menu")}
          </IconButton>
          <AppTitle variant="h1" noWrap>
            <Link
              className={classes.appTitleLink}
              href={getLocalizedPath(i18n, "/")}
            >
              {t("site.title")}
            </Link>
          </AppTitle>
          <ShareButton />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        {menu}
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  )
}

export default ResponsiveDrawer
