import styled from "styled-components"
import Box from "@material-ui/core/Box"

export const UnstyledRow = styled(Box)`
  font-size: ${props => props.theme.typography.smallFontSize};
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Row = styled(UnstyledRow)`
  margin: 6px 0 6px;
`

export const FlexStartRow = styled(Row)`
  && {
    justify-content: flex-start;
    div {
      margin-right: 64px;
    }
  }
`
