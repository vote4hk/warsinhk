import React from "react"
import Paper from "@material-ui/core/Paper"
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied"
import styled from "styled-components"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { useTranslation } from "react-i18next"

const StyledPaper = styled(Paper)`
  height: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const StyledSentimentVeryDissatisfiedIcon = styled(
  SentimentVeryDissatisfiedIcon
)`
  font-size: 5rem;
`
const StyledTypography = styled(Typography)`
  margin-left: 0.5rem;
`

export const ItemEmpty = props => {
  const { t } = useTranslation()
  return (
    <StyledPaper>
      <Box>
        <StyledSentimentVeryDissatisfiedIcon />
      </Box>
      <Box>
        <StyledTypography>{t("text.not_found")}</StyledTypography>
      </Box>
    </StyledPaper>
  )
}
