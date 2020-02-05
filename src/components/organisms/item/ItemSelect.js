import React, { forwardRef } from "react"
import Select from "react-select"
import makeAnimated from "react-select/animated/dist/react-select.esm"
import styled from "styled-components"

const animatedComponents = makeAnimated()

const StyledSelect = styled(Select)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const ReactSelect = (props, ref) => {
  const { options, onChange, placeholder } = props

  return (
    <StyledSelect
      ref={ref}
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      placeholder={placeholder}
      options={options}
      onChange={onChange}
    />
  )
}

export const ItemSelect = forwardRef(ReactSelect)
