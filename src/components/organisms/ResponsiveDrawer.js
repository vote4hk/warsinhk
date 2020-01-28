import React from "react"
import PropTypes from "prop-types"
import AppBar from "@material-ui/core/AppBar"
import CssBaseline from "@material-ui/core/CssBaseline"
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import { mapIcon } from "@components/icons"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import ShareButton from "@/components/organisms/ShareButton"
import styled from "styled-components"
import Link from "@material-ui/core/Link"
import { UnstyledLink } from "@components/atoms/UnstyledLink"

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
  menuButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
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

const SupportUsButton = styled(Link)`
  position: absolute;
  bottom: 0;
`

function ResponsiveDrawer(props) {
  const { container, pages, children, className } = props
  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { t } = useTranslation()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = pages => {
    return (
      <div>
        <div className={classes.toolbar} />
        <UnstyledLink to={"/"}>
          <ListItem>
            <ListItemIcon>{mapIcon("home")}</ListItemIcon>
            <ListItemText primary={"首頁"} />
          </ListItem>
        </UnstyledLink>
        <Divider />
        <List>
          {pages.map((page, index) => (
            <UnstyledLink to={page.to} key={index}>
              <ListItem>
                <ListItemIcon>{mapIcon(page.icon)}</ListItemIcon>
                <ListItemText primary={page.title} />
              </ListItem>
            </UnstyledLink>
          ))}
        </List>
        <Divider />
        <Link target="_blank" href="https://forms.gle/1M96G6xHH2tku4mJ8">
          <ListItem>
            <ListItemIcon>{mapIcon("contact_support")}</ListItemIcon>
            <ListItemText primary={"俾意見／幫手"} />
          </ListItem>
        </Link>
        <SupportUsButton
          target="_blank"
          href="https://www.collaction.hk/s/g0vhk/fund"
        >
          <ListItem>
            <ListItemIcon>{mapIcon("thumb_up")}</ListItemIcon>
            <ListItemText primary={"支持我們"} />
          </ListItem>
        </SupportUsButton>
      </div>
    )
  }

  return (
    <div className={`${classes.root} ${className}`}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
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
          <AppTitle variant="h3" noWrap>
            {t("site.title")}
          </AppTitle>
          <ShareButton />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer(pages)}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer(pages)}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  )
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(
    typeof Element === "undefined" ? Object : Element
  ),
}

export default ResponsiveDrawer
