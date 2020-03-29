import React from "react"
import { useTranslation } from "react-i18next"
import Box from "@material-ui/core/Box"
import styled from "styled-components"
import { mapColorForStatus } from "@/utils/colorHelper"
import { bps } from "@/ui/theme"
import _groupBy from "lodash/groupBy"
import _orderBy from "lodash/orderBy"
import * as moment from "moment"
import { withLanguage } from "@/utils/i18n"
import Typography from "@material-ui/core/Typography"
import MaleIcon from "@/components/icons/male.svg"
import FemaleIcon from "@/components/icons/female.svg"
import ImportIcon from "@/components/icons/import.svg"

const CaseAvatar = styled(Box)`
  cursor: pointer;
  font-weight: 900;
  font-size: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
  max-width: 70px;
  width: calc(100% / 5);
  height: 32px;
  margin-bottom: 30px;

  g {
    fill: ${props => props.statuscolor};
  }

  svg.male,
  svg.female {
    position: absolute;
  }

  svg.imported {
    position: absolute;
    top: -8px;
    right: 10px;
    width: 16px;
    height: 16px;
    z-index: 1;
  }

  .case-no {
    position: absolute;
    display: table;
    margin: 2px auto;
    color: ${props => props.statuscolor};
  }
`
const WarsGroupContainer = styled(Box)`
  margin: 16px 0 16px;
  border-bottom: 1px #cfcfcf solid;
  }
`

const GroupHeader = styled(Typography)`
  margin-bottom: 16px;
`

const DescriptionContainer = styled(Box)`
  margin: 10px 0px;
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
    <CaseAvatar
      className={`wars_box_${node.case_no}`}
      statuscolor={mapColorForStatus(node.status).main}
      onClick={e => handleBoxClick(node)}
    >
      {node.classification === "imported" && <ImportIcon />}
      <span className="case-no">{node.case_no}</span>
      {node.gender === "F" ? <FemaleIcon /> : <MaleIcon />}
    </CaseAvatar>
  )
})

const groupByKeyMap = {
  1: "node.confirmation_date",
  2: "node.confirmation_date",
  3: "node.citizenship_en",
  4: "node.citizenship_en",
  5: "node.group_id",
  6: "node.group_id",
  7: "node.status",
}
const orderByPolicies = {
  1: [["key"], ["desc"]],
  2: [["key"], ["asc"]],
  3: [["count"], ["desc"]],
  4: [["count"], ["asc"]],
  5: [["count"], ["desc"]],
  6: [["count"], ["asc"]],
  7: [["count"], ["desc"]],
}

const prepareData = ({ filteredCases, selectedGroupButton }, { t, i18n }) => {
  const titleByDate = ({ key, cases }) =>
    `${moment(key).format("M.DD")} (${t("cases.box_view_cases", {
      cases: cases.length,
    })})`
  const titleByArea = ({ key, cases }) =>
    `${
      key === "#N/A"
        ? t("cases.uncategorized")
        : withLanguage(i18n, cases[0].node, "citizenship")
    } (${t("cases.box_view_cases", { cases: cases.length })})`
  const titleByGroupName = ({ key, cases }) =>
    `${
      key === "null"
        ? t("cases.uncategorized")
        : withLanguage(i18n, cases[0].node, "group_name")
    }  (${t("cases.box_view_cases", { cases: cases.length })})`
  const titleByStatus = ({ key, cases }) =>
    `${
      key === "null" || key === "undefined"
        ? t("cases.uncategorized")
        : t(`cases.status_${key}`)
    }  (${t("cases.box_view_cases", { cases: cases.length })})`
  const titlePolicies = {
    1: titleByDate,
    2: titleByDate,
    3: titleByArea,
    4: titleByArea,
    5: titleByGroupName,
    6: titleByGroupName,
    7: titleByStatus,
  }
  const getTitle = titlePolicies[selectedGroupButton]

  const groupByKey = groupByKeyMap[selectedGroupButton]
  const groups = Object.entries(_groupBy(filteredCases, groupByKey)).map(
    ([key, cases]) => ({
      key,
      cases,
      count: cases.length,
      title: getTitle({ key, cases }),
      description:
        (selectedGroupButton === 5 || selectedGroupButton) === 6
          ? withLanguage(i18n, cases[0].node, "group_description")
          : undefined,
    })
  )
  debugger;
  return _orderBy(groups, orderByPolicies[selectedGroupButton][0], orderByPolicies[selectedGroupButton][1])
}

export const WarsCaseBoxContainer = React.forwardRef(
  function WarsCaseBoxContainer(props, ref) {
    const { handleBoxClick } = props
    // --------------------------------------
    // selectedGroupButton
    // --------------------------------------
    // 1: by date   : from latest to oldest
    // 2: by date   : from oldest to latest
    // 3: by area   : from greatest to least
    // 4: by area   : from least to greatest
    // 5: by group  : from more to less
    // 6: by group  : from less to more
    // 7: by status
    // --------------------------------------
    const displayingData = prepareData(props, useTranslation())
    return (
      <>
        {displayingData.map((group, index) => (
          <WarsGroupContainer index={index}>
            <GroupHeader variant="h6">{group.title}</GroupHeader>
            {group.description && (
              <DescriptionContainer>{group.description}</DescriptionContainer>
            )}
            <StyledContainer>
              {group.cases.map(cases => (
                <WarsCaseBox cases={cases} handleBoxClick={handleBoxClick} />
              ))}
            </StyledContainer>
          </WarsGroupContainer>
        ))}
      </>
    )
  }
)
