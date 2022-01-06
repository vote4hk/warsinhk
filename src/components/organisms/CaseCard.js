import React from "react"
import Typography from "@material-ui/core/Typography"
import MuiLink from "@material-ui/core/Link"
import { Link } from "gatsby"
import styled from "styled-components"
import { Row, FlexStartRow } from "@components/atoms/Row"
import { withLanguage, getLocalizedPath } from "@/utils/i18n"
import { DefaultChip } from "@components/atoms/Chip"
import { bps } from "@/ui/theme"
import {
  mapColorForClassification,
  mapColorForStatus,
} from "@/utils/colorHelper"
import _get from "lodash.get"
import CloseIcon from "@material-ui/icons/Close"
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded"
import ChevronRightRoundedIcon from "@material-ui/icons/ChevronRightRounded"
import ShareButton from "@/components/organisms/ShareButton"
import { DefaultTooltip } from "@/components/atoms/Tooltip"
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded"
const Box = "div"
const CaseCard = styled.div`
  margin: 16px 0;
  ${bps.up("xs")} {
    min-width: 320px;
  }
  min-width: 360px;

  .header {
    border-radius: 12px 12px 0 0;
    font-size: 16px;
    font-weight: 700;
    padding: 16px 16px 14px;
    background: ${props => props.statuscolor};
    color: #ffffff;
    display: flex;
    justify-content: ${props =>
      props.backToCase ? "flex-start" : "space-between"};
    align-items: center;

    svg {
      cursor: pointer;
    }

    a {
      color: white;
      line-height: 0;
    }

    .share-close {
      display: flex;

      svg:first-child {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }
    }
  }

  .content {
    max-height: 70vh;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 0 0 12px 12px;
    padding: 12px 16px 12px;
  }

  .basic-info {
    padding-bottom: 12px;
  }

  label {
    display: block;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .highlight {
    margin: 12px 0 12px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: start;

    div:first-child {
      padding-right: 8px;
    }

    p {
      font-weight: 400;
      display: inline-flex;
      align-self: center;
    }
  }

  .question_mark {
    margin-left: 4px;
    top: 0.125em;
    position: relative;
    font-size: 1.125rem;
  }

  .detail {
    border-top: 1px #cfcfcf solid;
    line-height: 1.75rem;
    padding: 16px 0 16px;

    a {
      color: ${props => props.theme.palette.primary.main};
    }
  }

  .case-source {
    margin-top: 16px;
    a {
      margin-left: 8px;
    }
  }

  .track-header {
    color: #525252;
    font-size: 14px;
  }

  .track-item {
    padding: 8px 0 8px;
    border-top: 1px #cfcfcf solid;
  }

  .track-remarks {
    color: #5c5c5c;
  }

  .track-source {
    display: flex;
    justify-content: flex-start;
    margin-top: 12px;
    label {
      border: 1px ${props => props.theme.palette.background.main} solid;
      padding: 2px 6px;
      margin-right: 6px;
      font-size: ${props => props.theme.typography.smallFontSize}px;
    }
  }
`
const WarsCaseTrack = ({ i18n, t, track }) => {
  return (
    <>
      {track.map((tr, i) => {
        const remarksText = withLanguage(i18n, tr.node, "remarks")
        const subDistrict = withLanguage(i18n, tr.node, "sub_district")
        return (
          <div key={i} className="track-item">
            <Row className="track-header">
              <Box>{withLanguage(i18n, tr.node, "action")}</Box>
              <Box>{tr.node.end_date}</Box>
            </Row>
            <Row className="">
              <Typography variant="body1">
                {t("cases_sub_district_location", {
                  sub_district: subDistrict === "-" ? "" : subDistrict,
                  location: withLanguage(i18n, tr.node, "location"),
                })}
              </Typography>
            </Row>
            {remarksText && (
              <Row className="track-remarks">
                <Typography variant="body1">
                  {renderTextWithCaseLink(i18n, tr.node, "remarks")}
                </Typography>
              </Row>
            )}
            <Row className="track-source">
              {tr.node.source_url_1 && (
                <MuiLink target="_blank" href={tr.node.source_url_1}>
                  <label>{t("high_risk.source_1")}</label>
                </MuiLink>
              )}
              {tr.node.source_url_2 && (
                <MuiLink target="_blank" href={tr.node.source_url_2}>
                  <label>{t("high_risk.source_2")}</label>
                </MuiLink>
              )}
            </Row>
          </div>
        )
      })}
    </>
  )
}

const renderTextWithCaseLink = (i18n, node, text = "detail") => {
  let rawText = withLanguage(i18n, node, text, true)

  let regexp = /#\d+/g
  let relatedCases = []
  let m
  do {
    m = regexp.exec(rawText)
    if (m) {
      relatedCases.push(m)
    }
  } while (m)
  let splitedRawText = rawText.split(regexp)

  return splitedRawText.map((str, i) => {
    let caseNo = relatedCases[i] && relatedCases[i][0]
    return (
      <React.Fragment key={i}>
        {str}
        {caseNo && (
          <Link
            key={caseNo}
            to={getLocalizedPath(
              i18n,
              `/cases/${caseNo.slice(1, caseNo.length)}`
            )}
          >
            {caseNo}
          </Link>
        )}
      </React.Fragment>
    )
  })
}

const WarsCaseCardComponent = React.forwardRef((props, ref) => {
  const {
    node,
    i18n,
    t,
    isSelected,
    patientTrack,
    handleClose = undefined,
    showViewMore = false,
    backToCase = false,
  } = props
  const trackData = _get(patientTrack, "[0].edges", null)
  const track = React.useMemo(
    () =>
      trackData && trackData.length > 0 ? (
        <WarsCaseTrack
          key={`track-${node.case_no}`}
          i18n={i18n}
          t={t}
          track={trackData}
        />
      ) : null,
    [i18n, node.case_no, t, trackData]
  )

  const statusText = withLanguage(i18n, node, "status")
  const hospitalText = withLanguage(i18n, node, "hospital")
  const citizenshipText = withLanguage(i18n, node, "citizenship")
  const sources = [
    node.source_url_1,
    node.source_url_2,
    node.source_url_3,
    node.source_url_4,
    node.source_url_5,
  ].filter(n => n)

  const dateFormat = /\d{4}-\d{2}-\d{2}/g
  return (
    <CaseCard
      key={`case-${node.case_no}`}
      selected={isSelected}
      statuscolor={mapColorForStatus(node.status).main}
      ref={ref}
      backToCase={backToCase}
    >
      <Box className="header">
        {backToCase && (
          <Link to={getLocalizedPath(i18n, `/cases`)}>
            <ChevronLeftRoundedIcon />
          </Link>
        )}
        <Box>
          {`#${node.case_no}`}{" "}
          {`(${
            statusText && statusText !== "#N/A" && statusText !== "-"
              ? statusText
              : t("cases.status_pending_update")
          })`}
        </Box>
        <div className="share-close">
          {handleClose && !showViewMore && (
            <ShareButton caseId={node.case_no} />
          )}
          {handleClose && <CloseIcon onClick={e => handleClose(e)} />}
        </div>
        {showViewMore && (
          <Link to={getLocalizedPath(i18n, `/cases`)}>
            <ChevronRightRoundedIcon />
          </Link>
        )}
        {!handleClose && !backToCase && !showViewMore && (
          <ShareButton caseId={node.case_no} />
        )}
      </Box>
      <Box className="content">
        <Row className="basic-info">
          <Typography variant="h4">
            {node.age && t("dashboard.patient_age_format", { age: node.age })}{" "}
            {(node.gender === "M" || node.gender === "F") &&
              t(`dashboard.gender_${node.gender}`)}
          </Typography>
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
                fontSize={14}
                label={withLanguage(i18n, node, "classification")}
              />
            )}
          </Box>
        </Row>
        <Row className="highlight">
          {node.onset_date && (
            <Box>
              <label>{t("dashboard.patient_onset_date")}</label>
              <Typography variant="body1">
                {node.onset_date.match(dateFormat)
                  ? node.onset_date
                  : node.onset_date.toLowerCase() === "asymptomatic" ||
                    node.onset_date.toLowerCase() === "none"
                  ? t("cases.asymptomatic")
                  : ""}
              </Typography>
            </Box>
          )}
          <Box>
            <label>{t("dashboard.patient_confirm_date")}</label>
            <Typography variant="body1">{node.confirmation_date}</Typography>
          </Box>
        </Row>
        <Row className="highlight">
          <Box>
            <label>{t("dashboard.patient_hospital")}</label>
            <Typography variant="body1">
              {(hospitalText && hospitalText !== "#N/A" && hospitalText) || "-"}
            </Typography>
          </Box>
          <Box>
            <label>{t("dashboard.patient_citizenship")}</label>
            <Typography variant="body1">
              {(citizenshipText &&
                citizenshipText !== "#N/A" &&
                citizenshipText) ||
                "-"}
            </Typography>
          </Box>
        </Row>
        {node.groups && node.groups.length > 0 && (
          <Row className="group">
            <Box>
              <label>{t("dashboard.group_name")}</label>
              <Typography variant="body1">
                {node.groups.map((group, i) => {
                  const groupName = withLanguage(i18n, group, "name")
                  const groupDescriptionName = withLanguage(
                    i18n,
                    group,
                    "description"
                  )
                  return (
                    <span key={groupName} variant="body1">
                      {groupName}
                      {groupDescriptionName && (
                        <DefaultTooltip
                          title={<>{groupDescriptionName}</>}
                          enterTouchDelay={10}
                          leaveTouchDelay={5000}
                          interactive
                        >
                          <HelpOutlineRoundedIcon
                            fontSize="inherit"
                            className="question_mark"
                          />
                        </DefaultTooltip>
                      )}
                      {node.groups.length > 1 &&
                        i !== node.groups.length - 1 &&
                        "／"}
                    </span>
                  )
                })}
              </Typography>
            </Box>
          </Row>
        )}

        <Box className="detail">
          <Typography variant="body1">
            {renderTextWithCaseLink(i18n, node, "detail")}
          </Typography>
          {!!sources.length && (
            <div className="case-source">
              <FlexStartRow>
                <Typography variant="body1">{t("dashboard.source")}</Typography>
                {sources.map((source, i) => {
                  return (
                    <MuiLink
                      key={source}
                      variant="body1"
                      href={source}
                      target="_blank"
                    >
                      {i + 1}
                    </MuiLink>
                  )
                })}
              </FlexStartRow>
            </div>
          )}
        </Box>
        {track}
      </Box>
    </CaseCard>
  )
})
export const WarsCaseCard = React.memo(WarsCaseCardComponent)
