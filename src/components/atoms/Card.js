import React from "react"
import styled from "styled-components"
import Box from "@material-ui/core/Box"

const StyledBox = styled(Box)`
  background: ${props => props.theme.palette.background.paper};
  padding: 8px 16px;
  margin: 16px 0;
`

export function BasicCard(props) {
  const { children } = props
  return <StyledBox>{children}</StyledBox>
}
