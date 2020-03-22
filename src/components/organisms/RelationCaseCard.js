import React from "react"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import MuiLink from "@material-ui/core/Link"
import { Link } from "gatsby"
import styled from "styled-components"
import { Row } from "@components/atoms/Row"
import { withLanguage, getLocalizedPath } from "@/utils/i18n"
import { Label } from "@components/atoms/Text"
import { DefaultChip } from "@components/atoms/Chip"
import { bps } from "@/ui/theme"
import {
  mapColorForClassification,
  mapColorForStatus,
} from "@/utils/colorHelper"
import { formatDateDDMM } from "@/utils"
import * as d3 from "d3"
import _get from "lodash.get"

const colors = d3.scaleOrdinal(d3.schemeDark2).domain([0, 1, 2, 3, 4])

const RelationWarsCaseContainer = styled(Box)`
  background: ${props => props.theme.palette.background.paper};
  padding: 8px 16px;
  box-shadow: ${props =>
    props.selected
      ? "0px 2px 10px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)"
      : "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"};

  border-top: 3px ${props => props.statuscolor} solid;
  max-height: 80vh;
  overflow-y: auto;
  position: absolute;
  bottom: 0;

  ${bps.up("sm")} {
    padding-left: 260px;
  }

  animation-name: slideup;
  animation-duration: 0.4s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;

  @keyframes slideup {
    0% {
      bottom: -300px;
    }
    100% {
      bottom: 0px;
    }
  }

  a {
    color: ${props => props.theme.palette.primary.main};
  }
  .track-row {
    border-top: 1px #ddd solid;
    padding: 8px 0 8px;
  }

  .wars-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    div:not(:first-child):last-child {
      text-align: right;
    }
    b {
      font-weight: 700;
    }
  }
`

const RelationWarsCaseDetail = styled(Typography)`
  margin-top: 20px;
`

const RelationWarsCaseGroup = styled.div`
  margin-top: 16px;
  padding: 8px 16px;
  background: #eee;
  border-radius: 8px;

  div:last-child {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
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
const RelationWarsCaseTrackContainer = styled(Box)`
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
  margin-top: 8px;
  font-size: ${props => props.theme.typography.smallFontSize}px;
`
const RelationWarsCaseTrack = ({ i18n, t, track }) => {
  return (
    <RelationWarsCaseTrackContainer>
      {track.map((tr, i) => {
        const remarksText = withLanguage(i18n, tr.node, "remarks")
        return (
          <div key={i} className="track-row">
            {tr.node.start_date && tr.node.end_date && (
              <div className="wars-row">
                <Box>
                  {tr.node.start_date === tr.node.end_date
                    ? tr.node.end_date
                    : `${formatDateDDMM(tr.node.start_date)} - ${formatDateDDMM(
                        tr.node.end_date
                      )}`}
                </Box>
                <b>{withLanguage(i18n, tr.node, "action")}</b>
              </div>
            )}
            <div className="wars-row">
              <b>{withLanguage(i18n, tr.node, "location")}</b>
              {(!tr.node.start_date || !tr.node.end_date) && (
                <b>{withLanguage(i18n, tr.node, "action")}</b>
              )}
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
    </RelationWarsCaseTrackContainer>
  )
}

export const RelationWarsCaseCard = React.forwardRef((props, ref) => {
  const {
    node,
    i18n,
    t,
    isSelected,
    patientTrack,
    showViewMore = false,
  } = props
  const trackData = _get(patientTrack, "[0].edges", null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const track = React.useMemo(
    () =>
      trackData && (
        <RelationWarsCaseTrack i18n={i18n} t={t} track={trackData} />
      ),
    [i18n, t, trackData]
  )

  const dateFormat = /\d{4}-\d{2}-\d{2}/g
  return (
    <RelationWarsCaseContainer
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
            {(node.gender === "M" || node.gender === "F") &&
              t(`dashboard.gender_${node.gender}`)}
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
            <b>
              {node.onset_date.match(dateFormat)
                ? node.onset_date
                : node.onset_date === "asymptomatic"
                ? t("cases.asymptomatic")
                : ""}
            </b>
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
        <RelationWarsCaseDetail>
          {withLanguage(i18n, node, "detail")}
        </RelationWarsCaseDetail>
      </Row>
      {node.group_id && (
        <RelationWarsCaseGroup>
          <Row>
            <Typography variant="body2">
              {withLanguage(i18n, node, "group_name")}
            </Typography>
          </Row>
          <Row>{withLanguage(i18n, node, "group_description")}</Row>
          <Row>
            {node.group_related_cases.split(",").map(rc => (
              <>{`#${rc},`}</>
            ))}
          </Row>
        </RelationWarsCaseGroup>
      )}
      <Row>
        <MuiLink href={node.source_url} target="_blank">
          {t("dashboard.source")}
        </MuiLink>
        {showViewMore && (
          <Link to={getLocalizedPath(i18n, `/cases/#${node.case_no} `)}>
            {t("cases.view_more")}
          </Link>
        )}
      </Row>
      {track}
    </RelationWarsCaseContainer>
  )
})
