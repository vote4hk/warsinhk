import React from "react"
import styled from "styled-components"
import Box from "@material-ui/core/Box"
import { bps } from "@/ui/theme"

const Container = styled(Box)`
  margin-top: 16px;
`

export function PageContent(props) {
  const { children, ...others } = props
  return <Container {...others}>{children}</Container>
}

const StyledSessionWrapper = styled(Box)`
  margin-bottom: 16px;
`

export function SessionWrapper(props) {
  const { children, ...others } = props
  return <StyledSessionWrapper {...others}>{children}</StyledSessionWrapper>
}

const StyledSplitWrapper = styled.div`
  ${bps.up("lg")} {
    display: flex;
    align-items: flex-start;

    ${StyledSessionWrapper} {
      flex: 1 0 calc(50% - 12px);

      &:nth-of-type(2) {
        max-width: 600px;
        flex: 0 0 calc(50% - 12px);
        margin-left: 24px;
      }
    }
  }
`

export function SplitWrapper(props) {
  const { children, ...others } = props
  return <StyledSplitWrapper {...others}>{children}</StyledSplitWrapper>
}
