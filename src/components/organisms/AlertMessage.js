import React from "react"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import { withLanguage } from "@/utils/i18n"
import { useTranslation } from "react-i18next"

const AlertMessageContainer = styled.div`
  && {
    margin-bottom: 20px;
  }
`

const AlertMessage = props => {
  const config = useStaticQuery(
    graphql`
      query {
        allConfig {
          edges {
            node {
              title_en
              title_zh
              message_en
              message_zh
              severity
              variant
            }
          }
        }
      }
    `
  )

  const {
    allConfig: { edges },
  } = config

  const { i18n } = useTranslation()

  return (
    <>
      {edges.map((edge, index) => {
        var {
          node: { title, message, severity, variant },
        } = edge
        title = withLanguage(i18n, edge.node, "title")
        message = withLanguage(i18n, edge.node, "message")

        severity = severity ? severity : "info"
        variant = variant ? variant : "standard"

        return (
          <AlertMessageContainer key={index}>
            <Alert severity={severity} variant={variant}>
              {title && <AlertTitle>{title}</AlertTitle>}
              {message}
            </Alert>
          </AlertMessageContainer>
        )
      })}
    </>
  )
}

export default AlertMessage
