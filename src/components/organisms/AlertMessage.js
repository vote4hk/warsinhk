import React from "react"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"
import { useTranslation } from "react-i18next"
import { mapIcon } from "@components/icons"
import IconButton from "@material-ui/core/IconButton"
import Collapse from "@material-ui/core/Collapse"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import { withLanguage } from "@/utils/i18n"
import ContextStore from "@/contextStore"
import { ALERT_CLOSE } from "@/reducers/pageOptions"

const StyledAlert = styled(Alert)`
  && {
    margin-bottom: 20px;
  }
`

const AlertChild = props => {
  const { edge, dispatch } = props
  const { i18n } = useTranslation()

  var {
    node: { title, message, severity, variant, enabled, id },
  } = edge

  const [open, setOpen] = React.useState(true)

  if (enabled === "Y") {
    title = withLanguage(i18n, edge.node, "title")
    message = withLanguage(i18n, edge.node, "message")

    severity = severity ? severity : "info"
    variant = variant ? variant : "standard"

    return (
      <Collapse in={open}>
        <StyledAlert
          severity={severity}
          variant={variant}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false)
                dispatch({ type: ALERT_CLOSE, alert_id: id })
              }}
            >
              {mapIcon("close")}
            </IconButton>
          }
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </StyledAlert>
      </Collapse>
    )
  }

  return null
}

const AlertMessage = props => {
  const alert = useStaticQuery(
    graphql`
      query {
        allAlert {
          edges {
            node {
              id
              title_en
              title_zh
              message_en
              message_zh
              severity
              variant
              enabled
            }
          }
        }
      }
    `
  )

  const {
    allAlert: { edges },
  } = alert

  const {
    pageOptions: { dispatch, state },
  } = React.useContext(ContextStore)

  const [alerts, setAlerts] = React.useState([])

  // Run on mount
  React.useEffect(() => {
    setAlerts(
      edges.filter(e => {
        return state.closedAlerts.indexOf(e.node.id) === -1
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {alerts.map((edge, index) => {
        return <AlertChild edge={edge} key={index} dispatch={dispatch} />
      })}
    </>
  )
}

export default AlertMessage
