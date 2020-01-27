import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AddShopingCartIcon from '@material-ui/icons/AddShoppingCart';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import Hidden from '@material-ui/core/Hidden';
import { UnstyledLink } from '@components/atoms/UnstyledLink';

const mapIcon = name => {
  switch (name) {
    case "add_shopping_cart":
      return <AddShopingCartIcon />
    case "warning":
      return <WarningRoundedIcon />
    case "timelapse":
      return <TimelapseIcon />
    case "info":
      return <InfoRoundedIcon />
  }
}

const useStyles = makeStyles({
  root: {
    width: 500,
  },
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
  label: {
    textTransform: 'uppercase',
    marginTop: 5,
  }
});

export default function SimpleBottomNavigation(props) {
  const { tabs } = props

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <Hidden smUp implementation="css">
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.stickToBottom}
      >
        {/* FIXME: the icon is not updated after navigating to other page */}
        {/* 
          wingkwong: Cannot use <UnstyledLink> to wrap <BottomNavigationAction> because it has to be a direct child of BottomNavigation
        */}
        {tabs.map(tab => <BottomNavigationAction component={UnstyledLink} label={tab.title} icon={mapIcon(tab.icon)} to={tab.to}/>)}
      </BottomNavigation>
    </Hidden>
  );
}