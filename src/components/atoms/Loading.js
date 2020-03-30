import React from "react"
import styled from "styled-components"
import CircularProgress from "@material-ui/core/CircularProgress"

const Loading = styled(props => (
  <div className={props.className}>
    <CircularProgress />
  </div>
))`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  padding: 40px 20px;
`

export default Loading
