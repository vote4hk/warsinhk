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
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Collapse,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import SearchIcon from "@material-ui/icons/Search"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { Row } from "@components/atoms/Row"
import { withLanguage } from "../utils/i18n"
import Button from "@material-ui/core/Button"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import MobileStepper from "@material-ui/core/MobileStepper"

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

const DisruptionCard = styled(Card)`
  margin-top: 1rem;
  margin-bottom: 1rem;

  .Mui-disabled {
    background: ${props => props.theme.palette.background.paper};
    opacity: 1;
  }
`

const DisruptionCardHeader = styled(CardHeader)`
  padding-bottom: 0px;
`

const DisruptionCardContent = styled(CardContent)`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`

const DisruptionCardActions = styled(CardActions)`
  padding-top: 0rem;
  padding-bottom: 0rem;
  justify-content: flex-end;
`

const DisruptionDetail = styled(Typography)`
  color: ${props => props.theme.palette.secondary.main};
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`

const DisruptionAction = styled(Box)`
  padding-left: 0.5rem;
  flex-grow: 1;
`

const InvertedExpandMoreIcon = styled(ExpandMoreIcon)`
  transform: "rotate(180deg)";
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
        {withLanguage(i18n, node, "description_title")}
        <br />
        {withLanguage(i18n, node, "description_content")}
      </Typography>
    </Row>
  )
}

const Disruption = props => {
  const { node } = props
  const { i18n, t } = useTranslation()
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const sourceUrl = withLanguage(i18n, node, "source_url")
  const hasDescription = props.children && props.children.length > 0
  const ExpandIcon = expanded ? InvertedExpandMoreIcon : ExpandMoreIcon

  return (
    <DisruptionCard>
      <DisruptionCardHeader title={withLanguage(i18n, node, "name")} />
      <DisruptionCardContent>
        <Box alignItems="flex-start">
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
        </Box>
      </DisruptionCardContent>
      <>
        <DisruptionCardActions disableSpacing>
          <DisruptionAction>
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
          </DisruptionAction>
          {hasDescription && (
            <IconButton onClick={handleExpandClick} aria-expanded={expanded}>
              <ExpandIcon />
            </IconButton>
          )}
        </DisruptionCardActions>
        {hasDescription && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <DisruptionCardContent>
              {hasDescription && (
                <Box alignItems="flex-start">{props.children}</Box>
              )}
            </DisruptionCardContent>
          </Collapse>
        )}
      </>
    </DisruptionCard>
  )
}

const Paginator = props => {
  const {
    disruptions,
    disruptionDescriptions,
    pageSize,
    activeStep,
    setActiveStep,
  } = props

  const paginate = (data, pageSize, pageNumber) => {
    return data.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  }

  const handleNext = () => {
    const maxSteps = Math.ceil(disruptions.length / pageSize)
    setActiveStep(prevActiveStep =>
      prevActiveStep + 1 >= maxSteps ? 0 : prevActiveStep + 1
    )
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const maxSteps = Math.ceil(disruptions.length / pageSize) || 1

  return (
    <>
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
      {paginate(disruptions, pageSize, activeStep).map(
        (disruptionEdge, disruptionIndex) => (
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
        )
      )}
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

  return (
    <Layout>
      <SEO title="DisruptionPage" />
      <Typography variant="h4" component="h1">
        {t("disruption.list_text")}
      </Typography>
      <DisruptionSearchBox
        placeholder={t("disruption.filter_text")}
        onChange={e => {
          setActiveStep(0)
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
          setActiveStep(0)
          setCategories(selectedCategories || [])
        }}
      />
      <Paginator
        disruptions={disruptions}
        disruptionDescriptions={disruptionDescriptions}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        pageSize={10}
      />
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
