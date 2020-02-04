import React, { useState } from "react"
import { graphql } from "gatsby"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import {
  TextField,
  InputAdornment,
  Box,
  Link,
  Chip,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import SearchIcon from "@material-ui/icons/Search"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { Row } from "@components/atoms/Row"

import { withLanguage } from "../utils/i18n"

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

const DisruptionExpansionPanel = styled(ExpansionPanel)`
  margin-top: 1rem;
  margin-bottom: 1rem;

  .Mui-disabled {
    background: ${props => props.theme.palette.background.paper};
    opacity: 1;
  }
`

const DisruptionExpansionPanelSummary = styled(ExpansionPanelSummary)`
  .Mui-expanded {
    margin: 1rem 0;
  }
`

const DisruptionDetail = styled(Typography)`
  color: ${props => props.theme.palette.secondary.main};
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

const DisruptionDescription = props => {
  const { node } = props
  const { i18n } = useTranslation()

  return (
    <Row>
      <Typography variant="caption">
        {withLanguage(i18n, node, "description_title")} -{" "}
        {withLanguage(i18n, node, "description_content")}
      </Typography>
    </Row>
  )
}

const Disruption = props => {
  const { node } = props
  const { i18n, t } = useTranslation()

  const sourceUrl = withLanguage(i18n, node, "source_url")
  const hasDescription = props.children && props.children.length > 0
  const panelSummaryAttributes = hasDescription
    ? { expandIcon: <ExpandMoreIcon /> }
    : {}

  return (
    <DisruptionExpansionPanel disabled={!hasDescription}>
      <DisruptionExpansionPanelSummary
        aria-controls={`panel-${node.id}-content`}
        id={`panel-${node.id}-header`}
        {...panelSummaryAttributes}
      >
        <Box alignItems="flex-start">
          <Row>
            <Typography variant="h3" component="h2">
              {withLanguage(i18n, node, "name")}
            </Typography>
          </Row>
          <Row>
            <Chip
              label={withLanguage(i18n, node, "category")}
              size="small"
              variant="outlined"
            />
          </Row>
          <Row>
            <DisruptionDetail variant="body1">
              {withLanguage(i18n, node, "detail")}
            </DisruptionDetail>
          </Row>
          <Row>
            {t("disruption.status")}:{" "}
            {withLanguage(i18n, node, "status") || "-"}
          </Row>
          <Row>
            {t("disruption.to")}: {withLanguage(i18n, node, "to") || "-"}
          </Row>
          {sourceUrl && (
            <Row>
              <Typography variant="caption">
                <Link component={Link} href={sourceUrl} target="_blank">
                  {t("disruption.source")}
                </Link>
              </Typography>
            </Row>
          )}
          <Row>
            <Typography variant="caption">
              {t("disruption.last_updated", { date: node.last_update })}
            </Typography>
          </Row>
        </Box>
      </DisruptionExpansionPanelSummary>
      <ExpansionPanelDetails>
        {hasDescription && <Box alignItems="flex-start">{props.children}</Box>}
      </ExpansionPanelDetails>
    </DisruptionExpansionPanel>
  )
}

const DisruptionPage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()
  const [keyword, setKeyword] = useState("")
  const [categories, setCategories] = useState([])

  const disruptions = data.allDisruption.edges.filter(
    e =>
      containsText(i18n, e.node, keyword) &&
      isInCategory(i18n, e.node, categories)
  )
  const disruptionDescriptions = data.allDisruptionDescription.edges

  const categoryOptions = createCategoryOptions(data.allDisruption.edges, i18n)

  return (
    <Layout>
      <SEO title="DisruptionPage" />
      <Typography variant="h2" component="h1">
        {t("disruption.list_text")}
      </Typography>
      <DisruptionSearchBox
        placeholder={t("disruption.filter_text")}
        onChange={e => {
          setKeyword(e.target.value)
        }}
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
        onChange={selectedCategories => {
          setCategories(selectedCategories || [])
        }}
      />
      {disruptions.map((disruptionEdge, disruptionIndex) => (
        <Disruption key={disruptionIndex} node={disruptionEdge.node}>
          {disruptionDescriptions
            .filter(
              disruptionDescriptionEdge =>
                disruptionDescriptionEdge.node.disruption_id ===
                disruptionEdge.node.disruption_id
            )
            .map((disruptionDescriptionEdge, disruptionDescriptionIndex) => (
              <DisruptionDescription
                key={disruptionDescriptionIndex}
                node={disruptionDescriptionEdge.node}
              />
            ))}
        </Disruption>
      ))}
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
