import React from "react"
import styled from "styled-components"
import {
  Box,
  CardHeader,
  Chip,
  Collapse,
  IconButton,
  Link,
  Typography,
} from "@material-ui/core"
import { BasicCard } from "@components/atoms/Card"
import { useTranslation } from "react-i18next"
import { withLanguage } from "@/utils/i18n"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { Row } from "@components/atoms/Row"

const DisruptionCard = styled(BasicCard)`
  margin-top: 1rem;
  margin-bottom: 1rem;

  .Mui-disabled {
    background: ${props => props.theme.palette.background.paper};
    opacity: 1;
  }
`
const DisruptionCardHeader = styled(CardHeader)`
  padding: 8px 0px 0px;
  font-weight: 700;
`
const DisruptionCardContent = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`
const DisruptionCardActions = styled.div`
  display: flex;
  justify-content: flex-end;
`
const DisruptionDetail = styled(Typography)`
  color: ${props => props.theme.palette.secondary.main};
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`
const DisruptionAction = styled(Box)`
  flex-grow: 1;
`
const InvertedExpandMoreIcon = styled(ExpandMoreIcon)`
  transform: "rotate(180deg)";
`

export const Disruption = props => {
  const { node, onCategoryClick } = props
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
              onClick={() =>
                onCategoryClick(withLanguage(i18n, node, "category"))
              }
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
