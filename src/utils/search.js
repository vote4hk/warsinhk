import { withLanguage } from "@/utils/i18n"
import _uniqBy from "lodash.uniqby"
import _isEqual from "lodash.isequal"

export const isInSubDistrict = (i18n, node, textList) => {
  return (
    textList &&
    typeof textList !== "string" &&
    textList.some(
      optionObj =>
        withLanguage(i18n, node, "sub_district").indexOf(optionObj.label) >=
          0 ||
        withLanguage({ language: "en" }, node, "sub_district").indexOf(
          optionObj.value
        ) >= 0
    )
  )
}

export const createSubDistrictOptionList = (i18n, edges) => {
  const subDistrictArrayForFilter = edges.map(
    ({ node }) => node["sub_district_en"]
  )

  return edges
    .map(({ node }) => ({
      zh: node["sub_district_zh"],
      en: node["sub_district_en"],
      start_date: node["start_date"],
      end_date: node["end_date"],
    }))
    .filter(
      (item, index) => subDistrictArrayForFilter.indexOf(item.en) === index
    )
    .filter(item => item.en !== "#N/A" && item.zh !== "-")
    .map(item => ({
      value: i18n.language === "zh" ? item.en.toLowerCase() : item.zh,
      label: item[i18n.language],
      field: "sub_district",
      start_date: item.start_date,
      end_date: item.end_date,
    }))
}

export const containsText = (i18n, node, text, fields) => {
  if (typeof text === "string") {
    return fields
      .map(
        field =>
          withLanguage(i18n, node, field)
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
      )
      .reduce((c, v) => c || v, false)
  } else {
    return false
  }
}

export const searchText = (value, text) =>
  !text || (value || "").toLowerCase().indexOf((text || "").toLowerCase()) >= 0

export const searchDate = (
  x_start_date,
  x_end_date,
  y_start_date,
  y_end_date
) => {
  if (x_end_date > y_start_date && y_end_date < x_start_date) {
    return false
  }

  if (
    (x_start_date > y_start_date && x_end_date > y_end_date) ||
    (x_start_date < y_start_date && x_end_date < y_end_date)
  ) {
    return false
  }

  return true
}

export const filterSearchOptions = (options, text, size) =>
  options.map(option => ({
    ...option,
    options: _uniqBy(
      option.options.filter(opt => searchText(opt.label, text)),
      "label"
    ).slice(0, size),
  }))

export const filterByDate = node => {
  console.log(node)
  const { start_date, end_date, search_start_date, search_end_date } = node
  if (!search_start_date || !search_end_date) {
    return true
  }
  const x_start_date = new Date(search_start_date)
  const x_end_date = new Date(search_end_date)
  const y_start_date = new Date(start_date)
  const y_end_date = new Date(end_date)
  return searchDate(x_start_date, x_end_date, y_start_date, y_end_date)
}

export const filterValues = (i18n, edges, filterArray) =>
  edges.filter(({ node }) => {
    if (filterArray.length === 0) {
      const { search_start_date, search_end_date } = node
      return search_start_date && search_end_date ? filterByDate(node) : true
    }

    return filterArray
      .map(
        option =>
          containsText(i18n, node, option.label, [option.field]) &&
          filterByDate(node)
      )
      .reduce((c, v) => c || v, false)
  })

const optionSortOrder = (option, histories) => {
  return histories.findIndex(h => _isEqual(h, option))
}

export const sortOptionsWithHistories = (options, histories) => {
  return options.sort(
    (a, b) => optionSortOrder(b, histories) - optionSortOrder(a, histories)
  )
}
