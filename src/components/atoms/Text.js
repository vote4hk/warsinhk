import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

export const Label = styled(Typography)`
  margin-bottom: 3px;
  font-size: 12px;
  color: ${props => props.theme.palette.primary.dark};
`
