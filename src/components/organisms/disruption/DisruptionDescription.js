import React from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@material-ui/core"
import { withLanguage } from "@/utils/i18n"

const DisruptionDescriptionContainer = styled(Box)`
  margin-bottom: 8px;
`
export const DisruptionDescription = props => {
  const { node } = props
  const { i18n } = useTranslation()

  return (
    <DisruptionDescriptionContainer>
      <Typography variant="h6">
        {withLanguage(i18n, node, "description_title")}
      </Typography>
      <Typography variant="body2">
        {withLanguage(i18n, node, "description_content")}
      </Typography>
    </DisruptionDescriptionContainer>
  )
}
