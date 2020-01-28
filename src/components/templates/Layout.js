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
import styled from "styled-components"
import { bps } from "@/ui/theme"

const pages = [
  {
    title: "黑店名單",
    to: "/shops",
    icon: "add_shopping_cart",
  },
  {
    title: "高危地區",
    to: "/high-risk",
    icon: "warning",
  },
  {
    title: "急症等候",
    to: "/ae-waiting-time",
    icon: "timelapse",
  },
  {
    title: "自保貼士",
    to: "/hygiene-tips",
    icon: "info",
  },
]

const Container = styled(Box)`
  background: ${props => props.theme.palette.background.default};
`

const StyledResponsiveDrawer = styled(ResponsiveDrawer)`
  && {
    /* bottom nav bar height */
    ${bps.down("md")} {
      padding-bottom: 56px;
    }
  }
`

const Layout = props => {
  const { children } = props
  return (
    <>
      <StyledResponsiveDrawer
        pages={pages}
        children={<Container>{children}</Container>}
      />
      <footer>
        <BottomNav tabs={pages} />
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
