import React from "react"
import Fab from "@material-ui/core/Fab"
import { mapIcon } from "@components/icons"
import styled from "styled-components"
import Box from "@material-ui/core/Box"

const IconContainer = styled(Box)`
  margin-right: 4px;

  .MuiSvgIcon-root {
    font-size: 1rem;
  }
`

export function BasicFab(props) {
  const { title, color = "secondary", size = "medium", onClick, icon } = props
  return (
    <Fab
      variant="extended"
      size={size}
      color={color}
      aria-label={icon}
      onClick={onClick}
    >
      <IconContainer>{mapIcon(icon)}</IconContainer>
      {title}
    </Fab>
  )
}