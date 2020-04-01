import React from "react"
import styled from "styled-components"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const Container = styled.div`
  .MuiPaper-elevation1 {
    box-shadow: none;
  }
`

const StyledExpansionPanel = styled(ExpansionPanel)`
  border-radius: 6px;
  .MuiExpansionPanelSummary-root.Mui-expanded {
    min-height: 0px;
  }
`

const StyledExpansionPanelSummary = styled(ExpansionPanelSummary)`
  padding: 0 16px 0;
  .MuiExpansionPanelSummary-content {
    margin: 4px 0;
  }

  .MuiExpansionPanel-root.Mui-expanded {
    margin: 0;
  }
`

const StyledExpansionPanelDetails = styled(ExpansionPanelDetails)`
  padding: 8px;
`

export const Accordion = ({
  defaultExpanded = false,
  title,
  content,
  ...props
}) => {
  return (
    <Container style={props.style}>
      <StyledExpansionPanel defaultExpanded={defaultExpanded}>
        <StyledExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="content"
          id="header"
        >
          {title}
        </StyledExpansionPanelSummary>
        <StyledExpansionPanelDetails>{content}</StyledExpansionPanelDetails>
      </StyledExpansionPanel>
    </Container>
  )
}
