import React from "react"
import PropTypes from "prop-types"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import styled from "styled-components"

const UnstyledTabPanel = styled(TabPanel)`
  padding: 16px 0 16px;
`

const UnstyledAppBar = styled(AppBar)`
  background: transparent;
  box-shadow: none;

  button {
    text-transform: inherit;
  }
`

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export function SimpleTabs(props) {
  const { tabs, onTabChange } = props
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <UnstyledAppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          {tabs.map((tab, i) => (
            <Tab
              onClick={e => onTabChange(tab.name)}
              key={i}
              label={tab.title}
              {...a11yProps(0)}
            />
          ))}
        </Tabs>
      </UnstyledAppBar>
      {tabs.map((tab, i) => (
        <UnstyledTabPanel key={i} value={value} index={i}>
          {tab.content}
        </UnstyledTabPanel>
      ))}
    </>
  )
}
