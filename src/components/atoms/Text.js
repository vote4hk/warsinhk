import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

export const Label = styled(Typography)`
  margin-bottom: 3px;
  font-size: 12px;
  color: ${props => props.theme.palette.primary.dark};
`

export const Paragraph = styled(Typography)`
  margin-top: 8px;
  font-size: 14px;

  && b {
    font-weight: 800;
  }
`
