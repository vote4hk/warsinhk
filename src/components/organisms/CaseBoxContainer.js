import React from "react"
import { useTranslation } from "react-i18next"
import Box from "@material-ui/core/Box"
import styled from "styled-components"
import { mapColorForStatus } from "@/utils/colorHelper"
import { bps } from "@/ui/theme"
import _get from "lodash/get"
import _uniq from "lodash/uniq"
import _groupBy from "lodash/groupBy"
import _map from "lodash/map"
import * as moment from "moment"
import { withLanguage } from "@/utils/i18n"
import Typography from "@material-ui/core/Typography"

const colorArray = [
  "#1a237e",
  "#ff74e0",
  "#1b5e20",
  "#00bfa5",
  "#651fff",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF",
]

const StyledBox = styled(Box)`
  cursor: pointer;
  margin: 0 8px 10px;
  width: 32px;
  height: 32px;
  font-size: 12px;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props =>
    props.gender === "M"
      ? "#78bbce"
      : props.gender === "F"
      ? "#ffa5eb"
      : "#fff"};
  background: ${props => props.statuscolor || "transparent"};
  border: 3px ${props => props.groupcolor} solid;
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);

  ${bps.down("sm")} {
    position: relative;
    width: calc((100% / 6) - 8px);
    height: auto;
    border-radius: 12px;
    font-size: 15px;
    padding-bottom: calc((100% / 6) - 8px - 10px);
    margin: 0 4px 10px;
    border-width: 5px;

    span {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`
const WarsGroupContainer = styled(Box)`
  background: ${props => props.theme.palette.background.paper};
  padding: 16px;
  margin: 16px 0;
  box-shadow: ${props =>
    props.selected
      ? "0px 2px 10px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)"
      : "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"};

  max-height: 80vh;
  overflow-y: auto;
  border-radius: 5px;
  }
`

const GroupHeader = styled(Typography)`
  margin-bottom: 8px;
`

const StyledContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px;

  ${bps.down("sm")} {
    margin: 0 -4px;
  }
`

export const WarsCaseBox = React.forwardRef((props, ref) => {
  const {
    cases: { node },
    handleBoxClick,
  } = props

  return (
    <StyledBox
      className={`wars_box_${node.case_no}`}
      statuscolor={mapColorForStatus(node.status).main}
      groupcolor={colorArray[node.group_id || 0]}
      gender={node.gender}
      onClick={e => handleBoxClick(node)}
    >
      <span className="wars_box_case_number">{node.case_no}</span>
    </StyledBox>
  )
})

export const WarsCaseBoxLegend = React.forwardRef((props, ref) => {
  const { caseGroup, i18n } = props
  return (
    <>
      {caseGroup.map(({ node }, id) => {
        return (
          <li style={{ color: colorArray[id || 0] }}>
            {withLanguage(i18n, node, "name")}
          </li>
        )
      })}
    </>
  )
})

export const WarsCaseBoxContainer = React.forwardRef((props, ref) => {
  const { filteredCases, handleBoxClick, selectedGroupButton } = props
  const { t, i18n } = useTranslation()

  if (selectedGroupButton === 1) {
    // **********************
    // ** By Date
    // **********************

    // Grouping Logic:
    // 1. descending chronological order
    // 2. First row: Most recent date's case
    // 3. Other rows: Every 7 days a row eg. Feb 22- Feb 28, Feb 15 - Feb 21 etc
    const lastConfirmedDate = _get(
      filteredCases,
      "[0].node.confirmation_date",
      ""
    )
    const caseStartDate = moment("2020-01-21")

    const dateMap = {
      [lastConfirmedDate]: moment(lastConfirmedDate).format("M.DD"),
    }
    let date = moment(lastConfirmedDate).add(-1, "day")
    let count = 0
    let dateLabel = ""
    while (date.isAfter(caseStartDate)) {
      if (count % 7 === 0) {
        dateLabel = `${moment(date)
          .add(-7, "days")
          .format("M.DD")} - ${date.format("M.DD")}`
      }
      dateMap[date.format("YYYY-MM-DD")] = dateLabel
      count++
      date = date.add(-1, "day")
    }
    const dates = _uniq(Object.values(dateMap))
    return (
      <>
        {dates.map((dateKey, index) => {
          let matchedCases = filteredCases.filter(
            ({ node }) => dateMap[node.confirmation_date] === dateKey
          ).length
          return (
            matchedCases > 0 && (
              <WarsGroupContainer index={index}>
                <GroupHeader variant="h6">
                  {dateKey} (
                  {t("cases.box_view_cases", { cases: matchedCases })})
                </GroupHeader>
                <StyledContainer>
                  {filteredCases
                    .filter(
                      ({ node }) => dateMap[node.confirmation_date] === dateKey
                    )
                    .map(cases => (
                      <WarsCaseBox
                        cases={cases}
                        handleBoxClick={handleBoxClick}
                      />
                    ))}
                </StyledContainer>
              </WarsGroupContainer>
            )
          )
        })}
      </>
    )
  } else if (selectedGroupButton === 2) {
    // **********************
    // ** By Area
    // **********************
    const groupedCases = _groupBy(
      filteredCases,
      ({ node: { citizenship_en } }) => `${citizenship_en}`
    )

    const casesByGroups = _map(groupedCases, (v, k) => ({
      citizenship_en: _uniq(v.map(({ node }) => node.citizenship_en))[0],
      citizenship_zh: _uniq(v.map(({ node }) => node.citizenship_zh))[0],
      cases: v,
    }))

    return (
      <>
        {casesByGroups.map((casesByGroup, index) => {
          let { citizenship_en, cases } = casesByGroup
          let area

          if (citizenship_en === "#N/A") {
            area = t("cases.uncategorized")
          } else {
            area = withLanguage(i18n, casesByGroup, "citizenship")
          }

          return (
            <WarsGroupContainer index={index}>
              <GroupHeader variant="h6">
                {area} ({t("cases.box_view_cases", { cases: cases.length })})
              </GroupHeader>
              <StyledContainer>
                {casesByGroup.cases.map(cases => (
                  <WarsCaseBox cases={cases} handleBoxClick={handleBoxClick} />
                ))}
              </StyledContainer>
            </WarsGroupContainer>
          )
        })}
      </>
    )
  } else if (selectedGroupButton === 3) {
    // **********************
    // ** By Group
    // **********************
    const groupedCases = _groupBy(
      filteredCases,
      ({ node: { group_id } }) => `${group_id}`
    )

    const casesByGroups = _map(groupedCases, (v, k) => ({
      group_id: k,
      group_name_en: _uniq(v.map(({ node }) => node.group_name_en))[0],
      group_name_zh: _uniq(v.map(({ node }) => node.group_name_zh))[0],
      cases: v,
    }))

    return (
      <>
        {casesByGroups.map((casesByGroup, index) => {
          let { group_id, cases } = casesByGroup
          let group

          if (group_id === "null") {
            group = t("cases.uncategorized")
          } else {
            group = withLanguage(i18n, casesByGroup, "group_name")
          }

          return (
            <WarsGroupContainer index={index}>
              <GroupHeader variant="h6">
                {group} ({t("cases.box_view_cases", { cases: cases.length })})
              </GroupHeader>
              <StyledContainer>
                {casesByGroup.cases.map(cases => (
                  <WarsCaseBox cases={cases} handleBoxClick={handleBoxClick} />
                ))}
              </StyledContainer>
            </WarsGroupContainer>
          )
        })}
      </>
    )
  } else if (selectedGroupButton === 4) {
    // **********************
    // ** By Status
    // **********************
    const groupedCases = _groupBy(
      filteredCases,
      ({ node: { status } }) => `${status}`
    )
    const casesByGroups = _map(groupedCases, (v, k) => ({
      status: k,
      cases: v,
    }))

    return (
      <>
        {casesByGroups.map((casesByGroup, index) => {
          let { status, cases } = casesByGroup

          if (cases.length === 0) {
            return null
          }

          if (status === null || status === "") {
            status = t("cases.uncategorized")
          } else {
            status = t(`cases.status_${status}`)
          }

          return (
            <WarsGroupContainer index={index}>
              <GroupHeader variant="h6">
                {status} ({t("cases.box_view_cases", { cases: cases.length })})
              </GroupHeader>
              <StyledContainer>
                {casesByGroup.cases.map(cases => (
                  <WarsCaseBox cases={cases} handleBoxClick={handleBoxClick} />
                ))}
              </StyledContainer>
            </WarsGroupContainer>
          )
        })}
      </>
    )
  }
})
