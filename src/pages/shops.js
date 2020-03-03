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

import { Row, FlexStartRow } from "@components/atoms/Row"
import { Label } from "@components/atoms/Text"
import MobileStepper from "@material-ui/core/MobileStepper"
import Button from "@material-ui/core/Button"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import { createDedupOptions } from "@/utils/search"

import { withLanguage } from "@/utils/i18n"
import { bps } from "@/ui/theme"
// import { BasicFab } from "@components/atoms/Fab"
import { ResponsiveWrapper } from "@components/atoms/ResponsiveWrapper"
import MultiPurposeSearch from "../components/modecules/MultiPurposeSearch"
import { PageContent } from "../components/atoms/Container"
import { Paragraph } from "@components/atoms/Text"

// const FabContainer = styled(Box)`
//   && {
//     bottom: 84px;
//     right: 16px;
//     position: fixed;
//     z-index: 1200;
//   }
// `

const ShopDetail = styled(Typography)`
  margin-top: 8px;
  font-size: 14px;
  color: ${props => props.theme.palette.secondary.main};
  line-height: 1.33rem;
`

const DubiousShopLabel = styled(Box)`
  background: black;
  color: white;
  padding: 4px 6px 4px;
`

const PageSize = 10

let pageSize = 10
if (typeof window !== "undefined") {
  if (window.innerWidth > bps.values.lg) {
    pageSize = 21
  } else if (window.innerWidth > bps.values.md) {
    pageSize = 20
  }
}

function item(props, i18n, t) {
  const { node } = props

  const sourceUrl = node.source_url

  return (
    <>
      <Row>
        <Box>{withLanguage(i18n, node, "type")}</Box>
        <DubiousShopLabel>
          {t(`dodgy_shops.category_${node.category}`)}
        </DubiousShopLabel>
      </Row>
      <Row>
        <Link
          onClick={() =>
            window.open(
              `https://maps.google.com/?q=${withLanguage(
                i18n,
                node,
                "address"
              )}`,
              "_blank"
            )
          }
        >
          {withLanguage(i18n, node, "address")}
        </Link>
      </Row>
      <Row>
        <Typography variant="h6">{withLanguage(i18n, node, "name")}</Typography>
      </Row>
      <FlexStartRow>
        <Box>
          <Label>{t("dodgy_shops.price")}</Label>
          {node.mask_price_per_box || "-"}
        </Box>
        <Box>
          <Label>{t("dodgy_shops.level")}</Label>
          {withLanguage(i18n, node, "mask_level") || "-"}
        </Box>
      </FlexStartRow>

      <Row>
        <ShopDetail
          component="p"
          dangerouslySetInnerHTML={{
            __html: withLanguage(i18n, node, "details"),
          }}
        />
      </Row>
      <FlexStartRow>
        {sourceUrl && (
          <Typography component="div" variant="body2">
            <Link component={Link} href={sourceUrl} target="_blank">
              {t("dodgy_shops.source")}
            </Link>
          </Typography>
        )}
      </FlexStartRow>
      <Row>
        <Box>{t("dodgy_shops.last_updated", { date: node.last_update })}</Box>
      </Row>
    </>
  )
}

function paginate(array, page_size, page_number) {
  return array.slice(page_number * page_size, (page_number + 1) * page_size)
}

const ShopsPage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()
  const [filteredData, setFilteredData] = useState(data.allDodgyShop.edges)
  const [activeStep, setActiveStep] = useState(0)

  // added for paging
  const handleNext = () => {
    const maxSteps = Math.ceil(filteredData.length / pageSize)
    setActiveStep(prevActiveStep =>
      prevActiveStep + 1 >= maxSteps ? 0 : prevActiveStep + 1
    )
  }

  // added for paging
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const maxSteps = Math.ceil(filteredData.length / PageSize)

  //Use to reset the activeStep after change filter
  if (maxSteps > 0 && activeStep >= maxSteps) {
    setActiveStep(0)
  }

  const mobileStepper =
    maxSteps < 2 ? (
      <div />
    ) : (
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
          </Button>
        }
      />
    )

  const searchResult =
    filteredData.length === 0 ? (
      <Typography variant="h4">{t("dodgy_shops.no_result")}</Typography>
    ) : (
      paginate(filteredData, pageSize, activeStep).map((node, index) => (
        <BasicCard
          alignItems="flex-start"
          key={index}
          children={item(node, i18n, t)}
        />
      ))
    )

  return (
    <>
      <SEO title="ShopsPage" />
      <Layout>
        {/* <FabContainer>
          <Link href="https://t.me/findmasks" target="_blank">
            <BasicFab title={t("dodgy_shops.find_mask")} icon="search" />
          </Link>
        </FabContainer> */}
        <Typography variant="h2">{t("dodgy_shops.list_text")}</Typography>
        <PageContent>
          <Paragraph>{t("dodgy_shops.disclaimer")}</Paragraph>
          <MultiPurposeSearch
            list={data.allDodgyShop.edges}
            placeholder={t("dodgy_shops.search_placeholder")}
            options={[
              {
                label: t("search.sub_district"),
                options: createDedupOptions(
                  i18n,
                  data.allDodgyShop.edges,
                  "sub_district"
                ),
                defaultSize: 100,
              },
              {
                label: t("search.pharmacy"),
                options: createDedupOptions(
                  i18n,
                  data.allDodgyShop.edges,
                  "name"
                ),
              },
            ]}
            searchKey="dodgy_shop"
            onListFiltered={list => {
              setFilteredData(list)
            }}
          />
        </PageContent>
        {mobileStepper}
        <ResponsiveWrapper>{searchResult}</ResponsiveWrapper>
        {mobileStepper}
      </Layout>
    </>
  )
}

export default ShopsPage

export const ShopsQuery = graphql`
  query {
    allDodgyShop(
      filter: { enabled: { eq: "Y" } }
      sort: { order: DESC, fields: last_update }
    ) {
      edges {
        node {
          category
          name_zh
          name_en
          address_zh
          address_en
          sub_district_zh
          sub_district_en
          district_zh
          district_en
          area_zh
          area_en
          mask_price_per_box
          mask_level_zh
          mask_level_en
          details_zh
          details_en
          last_update
          type_zh
          type_en
          source_zh
          source_en
          source_url
          lat
          lng
        }
      }
    }
  }
`
