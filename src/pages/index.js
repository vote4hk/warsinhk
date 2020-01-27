import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Box from "@material-ui/core/Box"
import styled from "styled-components"
import { useTranslation } from 'react-i18next';
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"

import { BasicFab } from "@components/atoms/Fab"
import { BasicList } from "@/components/organisms/BasicList"

const FabContainer = styled(Box)`
  && {
    bottom: 84px;
    right: 16px;
    position: fixed;
    z-index: 1200;
  }
`

const IndexPage = ({ data, pageContext }) => {
  const { t } = useTranslation()
  return (
    <>
      <SEO title="Home" />
      <Layout>
        <FabContainer>
          <BasicFab title="報料" icon="edit" />
        </FabContainer>
        <Typography varient="h2">
          {t("dodgy_shops.list_text")}（
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.google.com/spreadsheets/d/1x4gHNkS5cfKO8qi-MIp7EiNZP2m5zhK-yv9XSseZqmA/htmlview?fbclid=IwAR3o-FvljkFvrV2b6QGNjQ4_JK7oQletQVq3XTh-hr_o-IhpaTNoJw5_jYQ&sle=true#"
          >
            {t("dodgy_shops.source_from")}
          </a>
          ）
        </Typography>
        <BasicList items={data.allDodgyShops.edges} />
      </Layout>
    </>
  )
}

export default IndexPage

export const IndexQuery = graphql`
  query {
    allDodgyShops {
      edges {
        node {
          address_zh
          area
          details
          name_zh
          sub_district_zh
        }
      }
    }
  }
`