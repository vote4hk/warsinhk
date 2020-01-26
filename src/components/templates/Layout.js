/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Drawer from "@components/organisms/Drawer"
import NavBar from "@components/organisms/NavBar"

const Layout = (props) => {
  const { children } = props
  return (<>
    <Drawer />
    <main>
      <NavBar></NavBar>
      {children}
    </main>

    {/* <main>{children}</main> */}
    <footer>
      © {new Date().getFullYear()}, Built with
  {` `}
      <a href="https://www.gatsbyjs.org">Gatsby</a>
    </footer>
  </>)
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
