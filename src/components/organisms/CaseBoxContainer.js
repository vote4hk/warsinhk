import React from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { mapColorForStatus } from "@/utils/colorHelper"
import _groupBy from "lodash/groupBy"
import _orderBy from "lodash/orderBy"
import _entries from "lodash/entries"
import _findIndex from "lodash/findIndex"
import * as moment from "moment"
import { withLanguage } from "@/utils/i18n"
import Typography from "@material-ui/core/Typography"
import AutoSizer from "react-virtualized/dist/es/AutoSizer"
import WindowScroller from "react-virtualized/dist/es/WindowScroller"
import List from "react-virtualized/dist/es/List"
import { CaseAvatar } from "@/components/atoms/CaseAvatar"

const WarsGroupContainer = styled("div")`
  margin: 16px 0 16px;
  border-bottom: 1px #cfcfcf solid;
  }
`

const GroupHeader = styled(Typography)`
  margin-bottom: 16px;
`
const AvatarContainer = styled("div")`
  display: inline-block;
  width: calc(100% / 5);
  max-width: 70px;
  text-align: center;
  padding-bottom: 16px;

  svg {
    cursor: pointer;
  }

  text {
    font-weight: 700;
  }
`

const DescriptionContainer = styled("div")`
  margin: 10px 0px;
`

const StyledContainer = "div"

export const WarsCaseBox = props => {
  const {
    cases: { node },
    handleBoxClick,
  } = props
  return (
    <AvatarContainer>
      <CaseAvatar
        sex={node.gender}
        color={mapColorForStatus(node.status).main}
        code={node.case_no}
        onClick={e => handleBoxClick(node)}
        isImported={node.classification === "imported"}
        isUnknown={node.classification === "local_unknown_source"}
      />
    </AvatarContainer>
  )
}

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

const move = (from, to, ...arr) => {
  return from === to ? arr : (arr.splice(to, 0, ...arr.splice(from, 1)), arr)
}

const reorderData = (key, groups) => {
  const idx = _findIndex(groups, { key: key })

  if (idx > -1 && groups.length > 0) {
    return move(idx, groups.length - 1, ...groups)
  }
  return groups
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
    } (${t("cases.box_view_cases", {
      cases: cases.length,
    })})`
  const titleByGroupName = ({ key, cases }) =>
    `${
      key === "null"
        ? t("cases.uncategorized")
        : withLanguage(i18n, cases[0].node, "group_name")
    }  (${t("cases.box_view_cases", {
      cases: cases.length,
    })})`
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

  const groups = _entries(_groupBy(filteredCases, groupByKey)).map(
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

  var orderedGroups = _orderBy(
    groups,
    orderByPolicies[selectedGroupButton][0],
    orderByPolicies[selectedGroupButton][1]
  )

  // put unclassified groups to the end
  if (selectedGroupButton === 3 || selectedGroupButton === 4) {
    orderedGroups = reorderData("Uncertain", orderedGroups)
    orderedGroups = reorderData("#N/A", orderedGroups)
  } else if (selectedGroupButton === 5 || selectedGroupButton === 6) {
    orderedGroups = reorderData("null", orderedGroups)
  }

  return orderedGroups
}

class VirtulizedWarsCasesList extends React.Component {
  rowRenderer = ({ index, key, style }) => (
    <div key={key} style={{ ...style, overflow: "hidden" }}>
      <WarsGroupContainer index={index}>
        <GroupHeader variant="h6">{this.props.data[index].title}</GroupHeader>
        {this.props.data[index].description && (
          <DescriptionContainer>
            {this.props.data[index].description}
          </DescriptionContainer>
        )}
        <StyledContainer>
          {this.props.data[index].cases.map(cases => (
            <WarsCaseBox
              cases={cases}
              handleBoxClick={this.props.handleBoxClick}
            />
          ))}
        </StyledContainer>
      </WarsGroupContainer>
    </div>
  )
  rowHeight = ({ index }) => {
    const width = this.props.width
    const titleHeight = 36
    const rowHeight = 80
    const margin = 16 + 16
    const itemCountPerRow = width < 350 ? 5 : (width / 70) | 0
    const fontSize = 14
    const lineHeight = 1.43
    const group = this.props.data[index]
    const numberOfRows = Math.ceil(group.count / itemCountPerRow)
    const descriptionTextEstimation = group.description
      ? Math.ceil((group.description.length * fontSize) / width) *
        fontSize *
        lineHeight
      : 0
    const result =
      rowHeight * numberOfRows +
      titleHeight +
      margin +
      descriptionTextEstimation
    return result
  }
  componentDidUpdate(prevProps) {
    if (
      (prevProps.width !== this.props.width ||
        prevProps.data !== this.props.data) &&
      this.list
    )
      this.list.recomputeRowHeights()
  }
  render() {
    return (
      <List
        ref={el => (this.list = el)}
        rowHeight={this.rowHeight}
        rowRenderer={this.rowRenderer}
        width={this.props.width}
        height={this.props.height}
        rowCount={this.props.data.length}
        isScrolling={this.props.isScrolling}
        onScroll={this.props.onChildScroll}
        scrollTop={this.props.scrollTop}
        style={{ outline: "none" }}
        autoHeight
      />
    )
  }
}

const VirtulizedWarsCasesContainer = props => {
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
  const groups = prepareData(props, useTranslation())
  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => {
            return (
              <VirtulizedWarsCasesList
                data={groups}
                width={width}
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                handleBoxClick={props.handleBoxClick}
              />
            )
          }}
        </AutoSizer>
      )}
    </WindowScroller>
  )
}

export const WarsCaseBoxContainer = React.memo(VirtulizedWarsCasesContainer)
