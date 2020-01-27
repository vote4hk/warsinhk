import React from "react"
import styled from "styled-components"
import List from '@material-ui/core/List'
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Typography from '@material-ui/core/Typography'

const StyledItem = styled(ListItem)`
  background: ${props => props.theme.palette.background.paper};
  margin-bottom: 16px;
`

export function BasicList(props) {
  const { items } = props
  return (
    <List aria-label="">
      {items.map(({ node }, index) => (
        <StyledItem alignItems="flex-start" key={index}>
          <ListItemText
            primary={
              <Typography component="span" variant="h6" color="textPrimary">
                {`${node.sub_district_zh} - ${node.name_zh}`}
              </Typography>
            }
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  {node.address_zh}
                </Typography>
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  {node.details}
                </Typography>
              </>
            }
          />
        </StyledItem>
      ))}
    </List>
  )
}
