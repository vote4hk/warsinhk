import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

export const Label = styled(Typography)`
  margin-bottom: 3px;
  font-size: ${props => props.theme.typography.xsmallFontSize};
  color: ${props => props.theme.palette.primary.dark};
`

export const Paragraph = styled(Typography)`
  margin-bottom: 8px;
  font-size: ${props => props.theme.typography.smallFontSize};

  && b {
    font-weight: 800;
  }
`
