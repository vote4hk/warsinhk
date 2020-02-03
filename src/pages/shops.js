import React, { useState, useMemo } from "react"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import { UnstyledLinkedCard } from "@components/atoms/LinkedCard"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import { BasicCard } from "@components/atoms/Card"
import { TextField, InputAdornment } from "@material-ui/core/"
import SearchIcon from "@material-ui/icons/Search"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { Row, FlexStartRow } from "@components/atoms/Row"
import { Label } from "@components/atoms/Text"
import MobileStepper from "@material-ui/core/MobileStepper"
import Button from "@material-ui/core/Button"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"

import { withLanguage } from "../utils/i18n"
import { bps } from "../ui/theme"
import { BasicFab } from "@components/atoms/Fab"
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

const animatedComponents = makeAnimated()

const SearchBox = styled(TextField)`
  && {
    ${bps.down("md")} {
      margin-top: 8px;
      margin-bottom: 8px;
      width: 100%;
    }
  }
`
const PageSize = 10

const MultiSelect = styled(Select)`
  && {
    margin-top: 16px;
  }
`

function item(props, i18n, t) {
  const { node } = props

  const sourceUrl = node.source_url

  return (
    <UnstyledLinkedCard
      onClick={() =>
        window.open(
          `https://maps.google.com/?q=${withLanguage(i18n, node, "address")}`,
          "_blank"
        )
      }
    >
      <Row>
        <Box>{withLanguage(i18n, node, "type")}</Box>
        <DubiousShopLabel>
          {t(`dodgy_shops.category_${node.category}`)}
        </DubiousShopLabel>
      </Row>
      <Row>
        <Box>{withLanguage(i18n, node, "address")}</Box>
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
        <ShopDetail component="p">
          {withLanguage(i18n, node, "details")}
        </ShopDetail>
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
    </UnstyledLinkedCard>
  )
}

function containsText(i18n, node, text) {
  return (
    withLanguage(i18n, node, "district")
      .toLowerCase()
      .indexOf(text) >= 0 ||
    withLanguage(i18n, node, "sub_district")
      .toLowerCase()
      .indexOf(text) >= 0 ||
    withLanguage(i18n, node, "name")
      .toLowerCase()
      .indexOf(text) >= 0 ||
    withLanguage(i18n, node, "address")
      .toLowerCase()
      .indexOf(text) >= 0
  )
}

function isInSubDistrict(i18n, node, textList) {
  return (
    textList &&
    typeof textList !== "string" &&
    textList.some(
      optionObj =>
        withLanguage(i18n, node, "sub_district").indexOf(optionObj.label) >=
          0 ||
        withLanguage({ language: "en" }, node, "sub_district").indexOf(
          optionObj.value
        ) >= 0
    )
  )
}

function createSubDistrictOptionList(allData, i18n) {
  const subDistrictArrayForFilter = allData.map(
    ({ node }) => node["sub_district_en"]
  )

  return allData
    .map(({ node }) => ({
      zh: node["sub_district_zh"],
      en: node["sub_district_en"],
    }))
    .filter(
      (item, index) => subDistrictArrayForFilter.indexOf(item.en) === index
    )
    .filter(item => item.en !== "#N/A")
    .map(item => ({
      value: i18n.language === "zh" ? item.en.toLowerCase() : item.zh,
      label: item[i18n.language],
    }))
}

function paginate(array, page_size, page_number) {
  return array.slice(page_number * page_size, (page_number + 1) * page_size)
}

const ShopsPage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()
  const [filter, setFilter] = useState("")
  const [activeStep, setActiveStep] = useState(0)

  const subDistrictOptionList = createSubDistrictOptionList(
    data.allDodgyShop.edges,
    i18n
  )

  // added for paging
  const handleNext = () => {
    const maxSteps = Math.ceil(filteredData.length / PageSize)
    setActiveStep(prevActiveStep =>
      prevActiveStep + 1 >= maxSteps ? 0 : prevActiveStep + 1
    )
  }

  // added for paging
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const filteredData = useMemo(
    () =>
      data.allDodgyShop.edges.filter(
        e =>
          filter === "" ||
          containsText(i18n, e.node, filter) ||
          isInSubDistrict(i18n, e.node, filter)
      ),
    [filter, i18n, data]
  )

  const maxSteps = useMemo(() => Math.ceil(filteredData.length / PageSize), [
    filteredData,
  ])

  //Use to reset the activeStep after change filter
  if(activeStep >= maxSteps) {
    setActiveStep(0);
  }

  const mobileStepper = maxSteps < 2? <div/>: 
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
        <Button
          size="small"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          <KeyboardArrowLeft />
        </Button>
      }
    />

  return (
    <>
      <SEO title="Home" />
      <Layout>
        <FabContainer>
          <Link href="https://t.me/findmasks" target="_blank">
            <BasicFab title={t("dodgy_shops.find_mask")} icon="search" />
          </Link>
        </FabContainer>
        <Typography variant="h4">{t("dodgy_shops.list_text")}</Typography>
        <>
          <MultiSelect
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            placeholder={t("dodgy_shops.filter_by_district_text")}
            options={subDistrictOptionList}
            onChange={selectedArray => {
              trackCustomEvent({
                category: "dodgy_shop",
                action: "multiselect_input",
                label: (selectedArray && selectedArray.toString()) || "",
              })
              setFilter(selectedArray || "")
            }}
          />
          <SearchBox
            id="input-with-icon-textfield"
            placeholder={t("dodgy_shops.filter_text")}
            onChange={e => {
              trackCustomEvent({
                category: "dodgy_shop",
                action: "filter_input",
                label: e.target.value,
              })
              setFilter(e.target.value.toLowerCase())
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
        {mobileStepper}
        {paginate(filteredData, PageSize, activeStep).map((node, index) => (
          <BasicCard
            alignItems="flex-start"
            key={index}
            children={item(node, i18n, t)}
          />
        ))}
        {/* TODO:  Fix button mobile stepper overlapping the bottom nav */}
        {/* {mobileStepper} */}
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
