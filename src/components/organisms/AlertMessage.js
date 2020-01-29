import React from "react"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import ContextStore from "@/contextStore"

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

  const {
    route: {
      state: { fullPath },
    },
  } = React.useContext(ContextStore)

  return (
    <>
      {edges.map((edge, index) => {
        var {
          node: {
            title_en,
            title_zh,
            message_en,
            message_zh,
            severity,
            variant,
          },
        } = edge
        var title = fullPath.includes("/en") ? title_en : title_zh
        var message = fullPath.includes("/en") ? message_en : message_zh

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
