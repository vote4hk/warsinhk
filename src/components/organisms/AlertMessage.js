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

const AlertMessageContainer = styled.div`
  .MuiAlert-root {
    margin-bottom: 20px;
  }
`

const AlertChild = props => {
  const { edge } = props
  const { i18n } = useTranslation()

  var {
    node: { title, message, severity, variant, enabled },
  } = edge

  const [open, setOpen] = React.useState(true)

  if (enabled === "Y") {
    title = withLanguage(i18n, edge.node, "title")
    message = withLanguage(i18n, edge.node, "message")

    severity = severity ? severity : "info"
    variant = variant ? variant : "standard"

    return (
      <AlertMessageContainer>
        <Collapse in={open}>
          <Alert
            severity={severity}
            variant={variant}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false)
                }}
              >
                {mapIcon("close")}
              </IconButton>
            }
          >
            {title && <AlertTitle>{title}</AlertTitle>}
            {message}
          </Alert>
        </Collapse>
      </AlertMessageContainer>
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

  return (
    <>
      {edges.map((edge, index) => {
        return <AlertChild edge={edge} index={index} />
      })}
    </>
  )
}

export default AlertMessage
