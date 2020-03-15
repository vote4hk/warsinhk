import React from "react"
import Chip from "@material-ui/core/Chip"
import styled from "styled-components"

const StyledChip = styled(Chip)`
  font-size: ${props => `${props.fontSize}px`};
  background: ${props => props.backgroundcolor || "transparent"};
  color: ${props => props.textcolor};
  border: 1px ${props => props.bordercolor} solid;
  padding: 3px 5px;
`

export const DefaultChip = props => {
  return (
    <StyledChip
      backgroundcolor={props.backgroundcolor}
      textcolor={props.textcolor}
      bordercolor={props.bordercolor}
      size="small"
      fontSize={props.fontSize}
      label={props.label}
    />
  )
}
