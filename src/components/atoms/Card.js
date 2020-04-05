import React from "react"
import styled from "styled-components"
import Box from "@material-ui/core/Box"

const StyledBox = styled(Box)`
  background: ${props => props.theme.palette.background.paper};
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: none;
`

export function BasicCard(props) {
  const { children, ...others } = props
  return <StyledBox {...others}>{children}</StyledBox>
}
