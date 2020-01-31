import styled from "styled-components"
import Box from "@material-ui/core/Box"

export const Row = styled(Box)`
  font-size: 14px;
  margin: 6px 0 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const FlexStartRow = styled(Row)`
  && {
    justify-content: flex-start;
    div {
      margin-right: 64px;
    }
  }
`
