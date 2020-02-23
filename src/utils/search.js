import { withLanguage } from "@/utils/i18n"
import _uniqBy from "lodash.uniqby"
import _uniq from "lodash.uniq"
import _isEqual from "lodash.isequal"

export const createDedupOptions = (i18n, edges, field) => {
  return _uniq(edges.map(({ node }) => withLanguage(i18n, node, field)))
    .filter(v => v !== "#N/A" && v !== "-" && v !== "")
    .map(v => ({
      label: v,
      value: v,
      field,
    }))
}

export const containsText = (i18n, node, text, fields) => {
  if (typeof text === "string") {
    return fields
      .map(field => {
        return (
          withLanguage(i18n, node, field)
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        )
      })
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
    ).slice(0, option.defaultSize || size),
  }))

export const filterByDate = (node, search_start_date, search_end_date) => {
  const { start_date, end_date } = node
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
