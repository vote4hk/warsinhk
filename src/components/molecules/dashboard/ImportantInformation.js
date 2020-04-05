import React from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"
import { BasicCard } from "@components/atoms/Card"
import { withLanguage } from "@/utils/i18n"

const ImportantInformationContainer = styled(BasicCard)`
  font-size: 16px;

  a {
    color: ${props => props.theme.palette.primary.main};
  }
  p {
    margin-bottom: 8px;
  }

  ol {
    margin-right: 16px;
    list-style-type: decimal;
    list-style-position: inside;
  }
`
export default props => {
  const data = useStaticQuery(
    graphql`
      query {
        allImportantInformation(filter: { enabled: { eq: "Y" } }) {
          edges {
            node {
              order
              type
              text_zh
              text_en
            }
          }
        }
      }
    `
  )
  const { i18n, t } = useTranslation()

  const paragraphArray = data.allImportantInformation.edges
    .filter(e => e.node.type === "paragraph")
    .map(e => withLanguage(i18n, e.node, "text"))

  const listItemArray = data.allImportantInformation.edges
    .filter(e => e.node.type === "item")
    .map(e => withLanguage(i18n, e.node, "text"))

  return (
    <ImportantInformationContainer>
      <p
        dangerouslySetInnerHTML={{
          __html: t("importantInformation.chp_hotline"),
        }}
      />
      <p
        dangerouslySetInnerHTML={{
          __html: t("importantInformation.had_hotline"),
        }}
      />
      {paragraphArray.map((p, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
      ))}
      <ol type="i">
        {listItemArray.map((li, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: li }} />
        ))}
      </ol>
    </ImportantInformationContainer>
  )
}
