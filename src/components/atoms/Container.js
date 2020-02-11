import React from "react"
import styled from "styled-components"
import Box from "@material-ui/core/Box"

const Container = styled(Box)`
  margin-top: 16px;
`

export function PageContent(props) {
  const { children, ...others } = props
  return <Container {...others}>{children}</Container>
}
