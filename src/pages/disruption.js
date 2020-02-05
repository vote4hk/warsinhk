import React, { useRef, useState } from "react"
import { graphql } from "gatsby"
import { useTranslation } from "react-i18next"
import { Typography } from "@material-ui/core"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { withLanguage } from "../utils/i18n"
import { DisruptionDescription } from "@components/organisms/disruption/DisruptionDescription"
import { Disruption } from "@components/organisms/disruption/Disruption"
import { ItemPaginator } from "@components/organisms/item/ItemPaginator"
import { ItemSearch } from "@components/organisms/item/ItemSearch"
import { ItemSelect } from "@components/organisms/item/ItemSelect"
import { ItemEmpty } from "@components/organisms/item/ItemEmpty"

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

const DisruptionPage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()
  const [keyword, setKeyword] = useState("")
  const [categories, setCategories] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const selectRef = useRef(null)

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

  const handleCategoryClick = category => {
    setActiveStep(0)
    setCategories([{ value: category, label: category }])
    if (selectRef.current) {
      selectRef.current.select.setValue([{ value: category, label: category }])
    }
  }

  return (
    <Layout>
      <SEO title="DisruptionPage" />
      <Typography variant="h2" component="h1">
        {t("disruption.list_text")}
      </Typography>
      <ItemSearch
        placeholder={t("disruption.filter_text")}
        onChange={handleSearchBoxChange}
      />
      <ItemSelect
        ref={selectRef}
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
        renderEmpty={() => <ItemEmpty />}
      >
        {(item, index) => (
          <Disruption
            key={index}
            node={item.node}
            onCategoryClick={handleCategoryClick}
          >
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
