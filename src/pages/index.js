import React from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import { BasicCard } from "@components/atoms/Card"
import { BasicFab } from "@components/atoms/Fab"
import { withLanguage } from "../utils/i18n"

const FabContainer = styled(Box)`
  && {
    bottom: 84px;
    right: 16px;
    position: fixed;
    z-index: 1200;
  }
`
function item(props, i18n) {
  const { node } = props
  return (
    <>
      <Box>
        <Typography component="span" variant="body2" color="textPrimary">
          {withLanguage(i18n, node, "district")}
        </Typography>
      </Box>
      <Box>
        <Typography component="span" variant="h6" color="textPrimary">
          {withLanguage(i18n, node, "name")}
        </Typography>
      </Box>
      <Box>
        <Typography component="span" variant="body2" color="textPrimary">
          {withLanguage(i18n, node, "address")}
        </Typography>
      </Box>
      <Typography component="span" variant="body2" color="textPrimary">
        {node.details}
      </Typography>
    </>
  )
}

const IndexPage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()
  return (
    <>
      <SEO title="Home" />
      <Layout>
        <FabContainer>
          <Link href="https://forms.gle/gK477bmq8cG57ELv8" target="_blank">
            <BasicFab title="報料" icon="edit" />
          </Link>
        </FabContainer>
        <Typography variant="h4">{t("dodgy_shops.list_text")}</Typography>
        <Typography variant="body2">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.google.com/spreadsheets/d/1x4gHNkS5cfKO8qi-MIp7EiNZP2m5zhK-yv9XSseZqmA/htmlview?fbclid=IwAR3o-FvljkFvrV2b6QGNjQ4_JK7oQletQVq3XTh-hr_o-IhpaTNoJw5_jYQ&sle=true#"
          >
            {t("dodgy_shops.source_from")}
          </a>
        </Typography>
        {data.allDodgyShop.edges.map((node, index) => (
          <BasicCard
            alignItems="flex-start"
            key={index}
            children={item(node, i18n)}
          />
        ))}
      </Layout>
    </>
  )
}

export default IndexPage

export const IndexQuery = graphql`
  query {
    allDodgyShop {
      edges {
        node {
          area
          address_zh
          details
          name_zh
          district_zh
          sub_district_zh
        }
      }
    }
  }
`
