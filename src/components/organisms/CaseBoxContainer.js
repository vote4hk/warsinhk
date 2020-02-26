import React from "react"
import Box from "@material-ui/core/Box"
import styled from "styled-components"
import {
  mapColorForClassification,
  mapColorForStatus,
} from "@/utils/colorHelper"

const StyledContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`

const StyledBox = styled(Box)`
  position: relative;
  width: 32px;
  height: 32px;
  font-size: 12px;
  font-weight: 900;
  margin: 0 16px 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: ${props => props.classificationcolor || "transparent"};

  border: 3px ${props => props.statuscolor} solid;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);

  &:before,
  &:after {
    content: "";
    position: absolute;
    bottom: 0px;
    right: 0px;
    border-color: transparent;
    border-style: solid;
  }

  &:before {
    border-right-color: #f5f5f6;
    border-bottom-color: #f5f5f6;
  }

  &:after {
    border-radius: 100px;
    border-right-color: #f5f5f6;
    border-bottom-color: #f5f5f6;
  }
`

export const WarsCaseBox = React.forwardRef((props, ref) => {
  const {
    cases: { node },
  } = props
  return (
    <StyledBox
      classificationcolor={mapColorForClassification(node.classification).main}
      statuscolor={mapColorForStatus(node.status).main}
    >
      {node.case_no}
    </StyledBox>
  )
})

export const WarsCaseBoxContainer = React.forwardRef((props, ref) => {
  const { filteredCases } = props
  return (
    <StyledContainer>
      {filteredCases.map(filteredCase => (
        <WarsCaseBox cases={filteredCase} />
      ))}
    </StyledContainer>
  )
})
