import React from "react"
import { InputAdornment, TextField } from "@material-ui/core"
import SearchIcon from "@material-ui/icons/Search"
import styled from "styled-components"

const StyledTextField = styled(TextField)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  && {
    width: 100%;
  }
`

export const ItemSearch = props => {
  const { onChange, placeholder } = props
  return (
    <StyledTextField
      placeholder={placeholder}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      size="small"
    />
  )
}
