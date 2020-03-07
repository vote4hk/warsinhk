import React from "react"
import Box from "@material-ui/core/Box"
import styled from "styled-components"
import { mapColorForStatus } from "@/utils/colorHelper"
import { bps } from "@/ui/theme"
import _get from "lodash/get"
import _uniq from "lodash/uniq"
import * as moment from "moment"

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
  margin: 16px 0;
`

const GroupHeader = styled(Box)`
  margin-bottom: 4px;
`

const StyledContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px;

  ${bps.down("sm")} {
    margin: 0 -4px;
  }
`
const ExampleContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  padding: 0 0 8px;
  margin: 16px -8px 8px;
  border-bottom: black 2px solid;

  ${bps.down("sm")} {
    margin: 16px -4px 8px;
  }

  ${StyledBox} {
    cursor: default;
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

export const WarsCaseBoxContainer = React.forwardRef((props, ref) => {
  const { filteredCases, handleBoxClick } = props

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
    [lastConfirmedDate]: moment(lastConfirmedDate).format("MMM DD"),
  }
  let date = moment(lastConfirmedDate).add(-1, "day")
  let count = 0
  let dateLabel = ""
  while (date.isAfter(caseStartDate)) {
    if (count % 7 === 0) {
      dateLabel = `${moment(date)
        .add(-7, "days")
        .format("MMM DD")} - ${date.format("MMM DD")}`
    }
    dateMap[date.format("YYYY-MM-DD")] = dateLabel
    count++
    date = date.add(-1, "day")
  }
  const dates = _uniq(Object.values(dateMap))

  const exampleCases = [
    {
      node: {
        case_no: "群組",
        status: "hospitalised",
        group_id: 1,
        gender: "-",
      },
    },
    {
      node: {
        case_no: "嚴重",
        status: "serious",
        group_id: 0,
        gender: "-",
      },
    },
    {
      node: {
        case_no: "死亡",
        status: "deceased",
        group_id: 0,
        gender: "-",
      },
    },
    {
      node: {
        case_no: "出院",
        status: "discharged",
        group_id: 0,
        gender: "-",
      },
    },
    {
      node: {
        case_no: "男",
        status: "hospitalised",
        group_id: 0,
        gender: "M",
      },
    },
    {
      node: {
        case_no: "女",
        status: "hospitalised",
        group_id: 0,
        gender: "F",
      },
    },
  ]
  return (
    <>
      <ExampleContainer>
        {exampleCases.map(c => (
          <WarsCaseBox cases={c} handleBoxClick={() => {}} />
        ))}
      </ExampleContainer>
      {dates.map(
        (dateKey, index) =>
          filteredCases.filter(
            ({ node }) => dateMap[node.confirmation_date] === dateKey
          ).length > 0 && (
            <WarsGroupContainer>
              <GroupHeader>{dateKey}</GroupHeader>
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
      )}
    </>
  )
})
