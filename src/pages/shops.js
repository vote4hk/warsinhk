import React, { useState } from "react"
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
import { TextField, InputAdornment } from "@material-ui/core/"
import SearchIcon from "@material-ui/icons/Search"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

import { withLanguage } from "../utils/i18n"
import { bps } from "../ui/theme"
const FabContainer = styled(Box)`
  && {
    bottom: 84px;
    right: 16px;
    position: fixed;
    z-index: 1200;

    ${bps.up("md")} {
      bottom: 16px;
    }
  }
`

const SearchBox = styled(TextField)`
  && {
    ${bps.down("md")} {
      margin-top: 8px;
      margin-bottom: 8px;
      width: 100%;
    }
  }
`

function item(props, i18n, t) {
  const { node } = props
  return (
    <>
      <Box>
        <Typography component="span" variant="body2" color="textPrimary">
          {withLanguage(i18n, node, "sub_district")}
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
        {withLanguage(i18n, node, "details")}
      </Typography>
      <Typography variant="body2">
        <Link
          href={`https://maps.google.com/?q=${node.address_zh}`} // Chinese Address easier to be lookuped in Hong Kong
          target="_blank"
        >
          {t("text.map")}
        </Link>
      </Typography>
    </>
  )
}

function containsText(i18n, node, text) {
  return (
    withLanguage(i18n, node, "district").indexOf(text) >= 0 ||
    withLanguage(i18n, node, "sub_district").indexOf(text) >= 0 ||
    withLanguage(i18n, node, "name").indexOf(text) >= 0 ||
    withLanguage(i18n, node, "address").indexOf(text) >= 0
  )
}

const ShopsPage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()
  const [filter, setFilter] = useState("")
  return (
    <>
      <SEO title="Home" />
      <Layout>
        <FabContainer>
          <Link href="https://forms.gle/gK477bmq8cG57ELv8" target="_blank">
            <BasicFab title={t("dodgy_shops.report_incident")} icon="edit" />
          </Link>
        </FabContainer>
        <Typography variant="h4">{t("dodgy_shops.list_text")}</Typography>
        <Typography variant="body2">
          <Link
            href="https://docs.google.com/spreadsheets/d/1x4gHNkS5cfKO8qi-MIp7EiNZP2m5zhK-yv9XSseZqmA/htmlview?fbclid=IwAR3o-FvljkFvrV2b6QGNjQ4_JK7oQletQVq3XTh-hr_o-IhpaTNoJw5_jYQ&sle=true#"
            target="_blank"
          >
            {t("dodgy_shops.source_from")}
          </Link>
        </Typography>
        <>
          <SearchBox
            id="input-with-icon-textfield"
            placeholder={t("dodgy_shops.filter_text")}
            onChange={e => {
              trackCustomEvent({
                category: "dodgy_shop",
                action: "filter_input",
                label: e.target.value,
              })
              setFilter(e.target.value)
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </>
        {data.allDodgyShop.edges
          .filter(e => filter === "" || containsText(i18n, e.node, filter))
          .map((node, index) => (
            <BasicCard
              alignItems="flex-start"
              key={index}
              children={item(node, i18n, t)}
            />
          ))}
      </Layout>
    </>
  )
}

export default ShopsPage

export const ShopsQuery = graphql`
  query {
    allDodgyShop {
      edges {
        node {
          area
          area_zh
          area_en
          address_zh
          address_en
          details
          details_zh
          details_en
          name_zh
          name_en
          district_zh
          district_en
          sub_district_zh
          sub_district_en
        }
      }
    }
  }
`
