import React from "react"
import styled from "styled-components"
import Select from "@material-ui/core/Select"

const StyledSelect = styled(Select)`
  width: 100%;
  background-color: white;
  font-size: 12px;
  padding: 6px 10px;
  margin: 8px 0;
  border-radius: 6px;
  border: 1px solid hsl(0, 0%, 80%);

  &::before {
    content: none;
  }

  svg {
    margin: 2px 12px 0 0;
    width: 16px;
    height: 18px;
  }
`

export const DefaultSelect = ({
  value,
  onChange,
  displayEmpty,
  IconComponent = null,
  children,
  ...props
}) => {
  return (
    <StyledSelect
      value={value}
      onChange={onChange}
      displayEmpty={displayEmpty}
      IconComponent={IconComponent}
    >
      {children}
    </StyledSelect>
  )
}
