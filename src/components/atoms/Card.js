import React from "react"
import styled from "styled-components"
import Box from "@material-ui/core/Box"

const StyledBox = styled(Box)`
  background: ${props => props.theme.palette.background.paper};
  padding: 8px 16px;
  margin: 16px 0;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`

export function BasicCard(props) {
  const { children, ...others } = props
  return <StyledBox {...others}>{children}</StyledBox>
}
