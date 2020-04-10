import React from "react"
import styled from "styled-components"
import Tooltip from "@material-ui/core/Tooltip"

export const DefaultTooltip = styled(props => (
  <Tooltip
    placement={props.placement || "bottom-start"}
    classes={{ popper: props.className, tooltip: "tooltip" }}
    {...props}
  />
))`
  & .tooltip {
    background-color: white;
    color: rgba(0, 0, 0, 0.87);
    font-size: 16px;
    border-radius: 14px;
    padding: 10px;
    box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
}
  }
`
