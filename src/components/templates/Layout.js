/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Box from "@material-ui/core/Box"
import ResponsiveDrawer from "@components/organisms/ResponsiveDrawer"
import BottomNav from "@components/organisms/BottomNav"
// import AlertMessage from "@components/organisms/AlertMessage"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"
import { bps } from "@/ui/theme"

const Container = styled(Box)`
  background: ${props => props.theme.palette.background.default};
`

const StyledResponsiveDrawer = styled(ResponsiveDrawer)`
  && {
    /* bottom nav bar height */
    ${bps.down("md")} {
      padding-bottom: 60px;
    }
  }

  main {
    position: relative;
    min-height: calc(100vh - 60px);
  }
`

const Layout = props => {
  const { children, ...rest } = props // const { children, hideAlerts } = props

  const { configJson } = useStaticQuery(
    graphql`
      query {
        configJson {
          pages {
            title
            to
            icon
            sideMenu
            bottomNav
          }
        }
      }
    `
  )

  const pageList = configJson.pages.filter(p => p.sideMenu)

  const tabList = configJson.pages.filter(p => p.bottomNav)

  return (
    <>
      <StyledResponsiveDrawer
        pages={pageList}
        children={
          <Container {...rest}>
            {/* Alert is shown in index page only */}
            {/* {!hideAlerts && <AlertMessage />} */}
            {children}
          </Container>
        }
      />
      <footer>
        <BottomNav tabs={tabList} />
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
