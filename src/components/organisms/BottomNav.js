import React from "react"
import BottomNavigation from "@material-ui/core/BottomNavigation"
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction"
import { mapIcon } from "@components/icons"
import Hidden from "@material-ui/core/Hidden"
import styled from "styled-components"
import { UnstyledLink } from "@components/atoms/UnstyledLink"
import ContextStore from "@/contextStore"
import { getLocalizedPath } from "@/utils/i18n"
import { useTranslation } from "react-i18next"
import { bps } from "@/ui/theme"

const StyledBottomNavigation = styled(BottomNavigation)`
  width: 100%;
  position: fixed;
  bottom: 0;
  text-align: center;
  height: 60px;

  .MuiBottomNavigationAction-root.Mui-selected {
    color: ${props => props.theme.palette.primary.text};
    background: ${props => props.theme.palette.primary.main};
    border-bottom: 3px ${props => props.theme.palette.secondary.main} solid;
  }

  span,
  .MuiBottomNavigationAction-label.Mui-selected {
    margin-top: 3px;
    font-size: ${props => props.theme.typography.xsmallFontSize}px;
    line-height: ${props => (props.theme.typography.xsmallFontSize * 5) / 6}px;
  }
  ${bps.down("md")} {
    .MuiBottomNavigationAction-root {
      min-width: 65px;
      padding-left: 0;
      padding-right: 0;
    }
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
  const { t, i18n } = useTranslation()

  return (
    <Hidden smUp implementation="css">
      <StyledBottomNavigation value={pageIndex} showLabels>
        {/* FIXME: the icon is not updated after navigating to other page */}
        {/* 
            wingkwong: Cannot use <UnstyledLink> to wrap <BottomNavigationAction> because it has to be a direct child of BottomNavigation
        */}
        {tabs.map((tab, index) => (
          <BottomNavigationAction
            label={t(tab.title)}
            key={index}
            component={UnstyledLink}
            icon={mapIcon(tab.icon)}
            to={getLocalizedPath(i18n, tab.to)}
            replace
          />
        ))}
      </StyledBottomNavigation>
    </Hidden>
  )
}
