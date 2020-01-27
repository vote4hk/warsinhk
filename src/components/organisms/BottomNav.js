import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { mapIcon } from'@components/icons';
import Hidden from '@material-ui/core/Hidden';
import styled from "styled-components"

const StyledBottomNavigation = styled(BottomNavigation)`
  width: 100%;
  position: fixed;
  bottom: 0;

  .MuiBottomNavigationAction-root.Mui-selected {
    border-bottom: 3px ${props => props.theme.palette.secondary.main} solid;
  }

  span, .MuiBottomNavigationAction-label.Mui-selected {
    font-size: 12px;
  }
`

export default function SimpleBottomNavigation(props) {
  const { tabs } = props

  const [value, setValue] = React.useState(0);

  return (
    <Hidden smUp implementation="css">
    <StyledBottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
    >
      {tabs.map(tab => <BottomNavigationAction label={tab.title} icon={mapIcon(tab.icon)} />)}
    </StyledBottomNavigation>
        </Hidden>
  );
}