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
  mapColorForClassification,
  mapColorForStatus,
} from "@/utils/colorHelper"
import { formatDateDDMM } from "@/utils"
import MuiLink from "@material-ui/core/Link"
import * as d3 from "d3"
import _get from "lodash.get"

const colors = d3.scaleOrdinal(d3.schemeDark2).domain([0, 1, 2, 3, 4])

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

  .track-row {
    border-top: 1px #ddd solid;
    padding: 8px 0 8px;
  }

  .wars-row {
    margin-bottom: 8px;
    div:not(:first-child):last-child {
      text-align: right;
    }
    b {
      font-weight: 700;
    }
  }
`

const WarsCaseDetail = styled(Typography)`
  margin-top: 20px;
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
const WarsCaseTrackContainer = styled(Box)`
  margin-top: 16px;
`

const CaseLabel = styled(Box)`
  color: ${props => props.color};
  background: white;
  border: ${props => props.color} 1px solid;
  padding: 2px 5px 2px;
  margin-right: 4px;
  border-radius: 2px;
`
const SourceRow = styled(Box)`
  display: flex;
  justify-content: flex-start;
  font-size: ${props => props.theme.typography.smallFontSize};
`
const WarsCaseTrack = ({ i18n, t, track }) => {
  return (
    <WarsCaseTrackContainer>
      {track.map((tr, i) => {
        const remarksText = withLanguage(i18n, tr.node, "remarks")
        return (
          <div key={i} className="track-row">
            <div className="wars-row">
              <Box>
                {tr.node.start_date === tr.node.end_date
                  ? tr.node.end_date
                  : `${formatDateDDMM(tr.node.start_date)} - ${formatDateDDMM(
                      tr.node.end_date
                    )}`}
              </Box>
              <Box>
                <b>{withLanguage(i18n, tr.node, "action")}</b>
              </Box>
            </div>
            <div className="wars-row">
              <b>{withLanguage(i18n, tr.node, "location")}</b>
            </div>
            {remarksText && (
              <div className="wars-row">
                <Typography variant="body2">{remarksText}</Typography>
              </div>
            )}

            <SourceRow>
              {tr.node.source_url_1 && (
                <MuiLink target="_blank" href={tr.node.source_url_1}>
                  <CaseLabel color={colors(2)}>
                    {t("high_risk.source_1")}
                  </CaseLabel>
                </MuiLink>
              )}
              {tr.node.source_url_2 && (
                <MuiLink target="_blank" href={tr.node.source_url_2}>
                  <CaseLabel color={colors(4)}>
                    {t("high_risk.source_2")}
                  </CaseLabel>
                </MuiLink>
              )}
            </SourceRow>
          </div>
        )
      })}
    </WarsCaseTrackContainer>
  )
}

export const WarsCaseCard = React.forwardRef((props, ref) => {
  const { node, i18n, t, isSelected, patientTrack } = props
  const trackData = _get(patientTrack, "[0].edges", null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const track = React.useMemo(
    () => trackData && <WarsCaseTrack i18n={i18n} t={t} track={trackData} />,
    [i18n, t, trackData]
  )
  return (
    <WarsCaseContainer
      key={`case-${node.case_no}`}
      selected={isSelected}
      statuscolor={mapColorForStatus(node.status).main}
      ref={ref}
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
            fontSize={14}
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
              bordercolor={mapColorForClassification(node.classification).main}
              backgroundcolor={
                mapColorForClassification(node.classification).main
              }
              textcolor={
                mapColorForClassification(node.classification).contrastText
              }
              size="small"
              fontSize={14}
              label={withLanguage(i18n, node, "classification")}
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
      {track}
    </WarsCaseContainer>
  )
})
