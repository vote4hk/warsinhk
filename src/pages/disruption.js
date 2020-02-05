import React, { useState } from "react"
import { graphql } from "gatsby"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import { InputAdornment, TextField, Typography } from "@material-ui/core"
import SearchIcon from "@material-ui/icons/Search"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { withLanguage } from "../utils/i18n"
import { ItemStepper } from "@components/organisms/item/ItemSteper"
import { DisruptionDescription } from "@components/organisms/disruption/DisruptionDescription"
import { Disruption } from "@components/organisms/disruption/Disruption"

const DisruptionSearchBox = styled(TextField)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  && {
    width: 100%;
  }
`

const CategorySelect = styled(Select)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const animatedComponents = makeAnimated()

function containsText(i18n, node, text) {
  return (
    text === "" ||
    withLanguage(i18n, node, "category").indexOf(text) >= 0 ||
    withLanguage(i18n, node, "name").indexOf(text) >= 0
  )
}

function isInCategory(i18n, node, textList) {
  return (
    textList.length === 0 ||
    (textList &&
      textList.some(
        optionObj =>
          withLanguage(i18n, node, "category").indexOf(optionObj.value) >= 0
      ))
  )
}

function createCategoryOptions(edges, i18n) {
  const categories = edges.map(({ node }) =>
    withLanguage(i18n, node, "category")
  )

  return categories
    .filter((a, b) => categories.indexOf(a) === b)
    .map(value => {
      return {
        value: value,
        label: value,
      }
    })
}

const ItemPaginator = props => {
  const { items, pageSize, activeStep, setActiveStep, children } = props

  const paginate = (data, pageSize, activeStep) => {
    return data.slice(activeStep * pageSize, (activeStep + 1) * pageSize)
  }

  const handleNextClick = () => {
    const maxSteps = Math.ceil(items.length / pageSize)
    setActiveStep(prevActiveStep =>
      prevActiveStep + 1 >= maxSteps ? 0 : prevActiveStep + 1
    )
  }

  const handleBackClick = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const maxSteps = Math.ceil(items.length / pageSize) || 1

  return (
    <>
      <ItemStepper
        maxSteps={maxSteps}
        activeStep={activeStep}
        onNextClick={handleNextClick}
        onBackClick={handleBackClick}
      />
      {paginate(items, pageSize, activeStep).map((item, index) =>
        children(item, index)
      )}
      <ItemStepper
        maxSteps={maxSteps}
        activeStep={activeStep}
        onNextClick={handleNextClick}
        onBackClick={handleBackClick}
      />
    </>
  )
}

const DisruptionPage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()
  const [keyword, setKeyword] = useState("")
  const [categories, setCategories] = useState([])
  const [activeStep, setActiveStep] = useState(0)

  const disruptions = data.allDisruption.edges.filter(
    e =>
      containsText(i18n, e.node, keyword) &&
      isInCategory(i18n, e.node, categories)
  )
  const disruptionDescriptions = data.allDisruptionDescription.edges

  const categoryOptions = createCategoryOptions(data.allDisruption.edges, i18n)

  const handleSearchBoxChange = e => {
    setActiveStep(0)
    setKeyword(e.target.value)
  }

  const handleCategoryChange = selectedCategories => {
    setActiveStep(0)
    setCategories(selectedCategories || [])
  }

  return (
    <Layout>
      <SEO title="DisruptionPage" />
      <Typography variant="h2" component="h1">
        {t("disruption.list_text")}
      </Typography>
      <DisruptionSearchBox
        placeholder={t("disruption.filter_text")}
        onChange={handleSearchBoxChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        size="small"
      />
      <CategorySelect
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        placeholder={t("disruption.filter_by_category_text")}
        options={categoryOptions}
        onChange={handleCategoryChange}
      />
      <ItemPaginator
        items={disruptions}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        setCategories={selectedCategories =>
          setCategories(selectedCategories || [])
        }
        pageSize={10}
      >
        {(item, index) => (
          <Disruption key={index} node={item.node}>
            {disruptionDescriptions
              .filter(
                disruptionDescriptionEdge =>
                  disruptionDescriptionEdge.node.disruption_id ===
                  item.node.disruption_id
              )
              .map((disruptionDescriptionEdge, disruptionDescriptionIndex) => (
                <DisruptionDescription
                  key={disruptionDescriptionIndex}
                  node={disruptionDescriptionEdge.node}
                />
              ))}
          </Disruption>
        )}
      </ItemPaginator>
    </Layout>
  )
}

export default DisruptionPage

export const DisruptionQuery = graphql`
  query {
    allDisruption(
      filter: { enabled: { eq: "Y" } }
      sort: { order: DESC, fields: last_update }
    ) {
      edges {
        node {
          disruption_id
          name_zh
          name_en
          category_zh
          category_en
          detail_zh
          detail_en
          status_zh
          status_en
          to_zh
          to_en
          source_url_zh
          source_url_en
          last_update
        }
      }
    }
    allDisruptionDescription(
      filter: { enabled: { eq: "Y" } }
      sort: { order: DESC, fields: last_update }
    ) {
      edges {
        node {
          disruption_id
          description_title_zh
          description_title_en
          description_content_zh
          description_content_en
          last_update
        }
      }
    }
  }
`
