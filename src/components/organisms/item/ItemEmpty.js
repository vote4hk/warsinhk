import React from "react"
import Paper from "@material-ui/core/Paper"
import HelpOutlineIcon from "@material-ui/icons/HelpOutline"
import styled from "styled-components"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { useTranslation } from "react-i18next"

const StyledPaper = styled(Paper)`
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledBox = styled(Box)`
  display: flex;
  flex-direction: row;
`
const StyledTypography = styled(Typography)`
  margin-left: 0.5rem;
`

export const ItemEmpty = props => {
  const { t } = useTranslation()
  return (
    <StyledPaper>
      <StyledBox>
        <HelpOutlineIcon fontSize="small" />
        <StyledTypography>{t("text.not_found")}</StyledTypography>
      </StyledBox>
    </StyledPaper>
  )
}
