/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import ResponsiveDrawer from "@components/organisms/ResponsiveDrawer"
import NavBar from "@components/organisms/NavBar"
import BottomNav from "@components/organisms/BottomNav"


const pages = [
  {
    title: '黑店名單',
    to: '/index',
    icon: 'add_shopping_cart'
  },
  {
    title: '高危地區',
    to: '/high-risk',
    icon: 'warning'
  },
  {
    title: '急症等候',
    to: '/ae-waiting-time',
    icon: 'timelapse'
  },
  {
    title: '抗炎資訊',
    to: '/hygiene-tips',
    icon: 'info'
  }
  
]
const Layout = (props) => {
  const { children } = props
  return (<>
    <ResponsiveDrawer 
      pages={pages}
      children={children}
    />
    <main>
      {/* <NavBar /> */}
      {/* {children} */}
    </main>

    {/* <main>{children}</main> */}
    <footer>
      <BottomNav tabs={pages} />
    </footer>
  </>)
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
