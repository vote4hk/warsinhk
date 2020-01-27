import React from "react"
import BottomNavigation from "@material-ui/core/BottomNavigation"
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction"
import { mapIcon } from "@components/icons"
import Hidden from "@material-ui/core/Hidden"
import styled from "styled-components"
import { UnstyledLink } from "@components/atoms/UnstyledLink"
import ContextStore from "@/contextStore"

const StyledBottomNavigation = styled(BottomNavigation)`
  width: 100%;
  position: fixed;
  bottom: 0;

  .MuiBottomNavigationAction-root.Mui-selected {
    border-bottom: 3px ${props => props.theme.palette.secondary.main} solid;
  }

  span,
  .MuiBottomNavigationAction-label.Mui-selected {
    font-size: 12px;
  }
`

export default function SimpleBottomNavigation(props) {
  const { tabs } = props
  const {
    route: {
      state: { path },
    },
  } = React.useContext(ContextStore)

  const pageIndex = tabs.findIndex(o => o.to === path)

  const [value, setValue] = React.useState(pageIndex)

  return (
    <Hidden smUp implementation="css">
      <StyledBottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
        showLabels
      >
        {/* FIXME: the icon is not updated after navigating to other page */}
        {/* 
            wingkwong: Cannot use <UnstyledLink> to wrap <BottomNavigationAction> because it has to be a direct child of BottomNavigation
        */}
        {tabs.map((tab, index) => (
          <BottomNavigationAction
            label={tab.title}
            key={index}
            component={UnstyledLink}
            icon={mapIcon(tab.icon)}
            to={tab.to}
          />
        ))}
      </StyledBottomNavigation>
    </Hidden>
  )
}
