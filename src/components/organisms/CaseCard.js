import React from "react"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import styled from "styled-components"
import { Row } from "@components/atoms/Row"
import { withLanguage } from "../../utils/i18n"
import { Label } from "@components/atoms/Text"
import { DefaultChip } from "@components/atoms/Chip"
import {
  pink,
  teal,
  blueGrey,
  red,
  green,
  amber,
  grey,
} from "@material-ui/core/colors"

const mapColorForClassification = classification => {
  const mapping = {
    imported: {
      main: pink[600],
      contrastText: "#fff",
    },
    imported_close_contact: {
      main: pink[700],
      contrastText: "#fff",
    },
    local: {
      main: teal[600],
      contrastText: "#fff",
    },
    local_possibly: {
      main: teal[500],
      contrastText: "#fff",
    },
    local_unknown_source: {
      main: teal[700],
      contrastText: "#fff",
    },
    local_possibly_close_contact: {
      main: teal[400],
      contrastText: "#fff",
    },
    local_close_contact: {
      main: teal[500],
      contrastText: "#fff",
    },
    default: {
      main: grey[900],
      contrastText: "#fff",
    },
  }

  if (!mapping[classification]) return mapping["default"]
  return mapping[classification]
}

const mapColorForStatus = status => {
  const mapping = {
    hospitalised: {
      main: amber[700],
      contrastText: "#000",
    },
    discharged: {
      main: green[700],
      contrastText: "#fff",
    },
    serious: {
      main: red[600],
      contrastText: "#fff",
    },
    critical: {
      main: red[900],
      contrastText: "#fff",
    },
    deceased: {
      main: blueGrey[800],
      contrastText: "#fff",
    },
    default: {
      main: grey[50],
      contrastText: "#000",
    },
  }

  if (!mapping[status]) return mapping["default"]
  return mapping[status]
}

const WarsCaseContainer = styled(Box)`
  background: ${props =>
    props.selected
      ? props.theme.palette.background.paperHighlighted
      : props.theme.palette.background.paper};
  padding: 8px 16px;
  margin: 16px 0;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  border-top: 3px ${props => props.statuscolor} solid;
`

const WarsCaseDetail = styled(Typography)`
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.33rem;
`

const WarsSource = styled(Link)`
  margin-top: 8px;
`

const WarsRow = styled(Row)`
  margin-bottom: 8px;
  div:not(:first-child):last-child {
    text-align: right;
  }
  b {
    font-weight: 700;
  }
`

const StatusRow = styled(Row)`
  margin: 8px 0 10px;
`

export const WarsCaseCard = React.forwardRef((props, ref) => {
  const { node, i18n, t, isSelected } = props

  return (
    <div ref={ref}>
      <WarsCaseContainer
        key={`case-${node.case_no}`}
        selected={isSelected}
        statuscolor={mapColorForStatus(node.status).main}
      >
        <Row>
          <Box>
            {`#${node.case_no}`} ({withLanguage(i18n, node, "type")})
          </Box>
          <Box>
            <DefaultChip
              textcolor={mapColorForStatus(node.status).main}
              bordercolor={mapColorForStatus(node.status).main}
              size="small"
              fontsize={14}
              label={t(`cases.status_${node.status}`)}
            />
          </Box>
        </Row>
        <Row>
          <Box>
            <Typography variant="h6">
              {node.age && t("dashboard.patient_age_format", { age: node.age })}{" "}
              {node.gender !== "-" && t(`dashboard.gender_${node.gender}`)}
            </Typography>
          </Box>
        </Row>
        <StatusRow>
          <Box>
            {node.classification && (
              <DefaultChip
                bordercolor={
                  mapColorForClassification(node.classification).main
                }
                backgroundcolor={
                  mapColorForClassification(node.classification).main
                }
                textcolor={
                  mapColorForClassification(node.classification).contrastText
                }
                size="small"
                fontsize={14}
                label={t(`cases.classification_${node.classification}`)}
              />
            )}
          </Box>
        </StatusRow>
        <WarsRow>
          {node.onset_date && (
            <Box>
              <Label>{t("dashboard.patient_onset_date")}</Label>
              <b>{node.onset_date}</b>
            </Box>
          )}
          <Box>
            <Label>{t("dashboard.patient_confirm_date")}</Label>
            <b>{node.confirmation_date}</b>
          </Box>
        </WarsRow>
        <WarsRow>
          <Box>
            <Label>{t("dashboard.patient_citizenship")}</Label>
            <b>{withLanguage(i18n, node, "citizenship") || "-"}</b>
          </Box>
          <Box>
            <Label>{t("dashboard.patient_hospital")}</Label>
            <b>{withLanguage(i18n, node, "hospital") || "-"}</b>
          </Box>
        </WarsRow>
        <Row>
          <WarsCaseDetail>{withLanguage(i18n, node, "detail")}</WarsCaseDetail>
        </Row>
        <Row>
          <WarsSource href={node.source_url} target="_blank">
            {t("dashboard.source")}
          </WarsSource>
        </Row>
      </WarsCaseContainer>
    </div>
  )
})
