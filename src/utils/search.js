import { withLanguage } from "@/utils/i18n"
import _uniqBy from "lodash.uniqby"
import _uniq from "lodash.uniq"
import _isEqual from "lodash.isequal"
import _flatten from "lodash.flatten"

// Helper function for filterSearchOptions()
const getSizeInSearchOptions = (options, size) => {
  if (options.some(e => e.field === "case_no")) {
    size = 3
  }
  return size
}

export const createDedupOptions = (
  i18n,
  edges,
  field,
  sort_by_value = false
) => {
  if (!i18n) {
    let r = edges
      .map(({ node }) => node[field] || "")
      .map(v => ({
        label: v,
        value: v,
        field,
      }))
    if (sort_by_value) {
      return r.sort((e1, e2) => e1.value - e2.value)
    } else {
      return r
    }
  } else {
    return _uniq(edges.map(({ node }) => withLanguage(i18n, node, field)))
      .filter(v => v !== "#N/A" && v !== "-" && v !== "")
      .map(v => ({
        label: v,
        value: v,
        field,
      }))
  }
}

export const createDedupArrayOptions = (i18n, edges, field, fieldName) => {
  return _uniq(
    _flatten(
      edges.map(({ node }) =>
        node[field].map(nodeField => withLanguage(i18n, nodeField, fieldName))
      )
    )
  )
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
        // Specific check for case number
        if (field === "case_no" && node.case_no === text) {
          return true
        }
        const value = withLanguage(i18n, node, field)
        if (typeof value === "string") {
          return value.toLowerCase().indexOf(text.toLowerCase()) >= 0
        } else if (Array.isArray(value)) {
          return value.indexOf(text) >= 0
        }
        return false
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

export const filterSearchOptions = (options, text, size) => {
  return options.map(option => ({
    ...option,
    options: _uniqBy(
      option.options.filter(opt => searchText(opt.label, text)),
      "label"
    ).slice(
      0,
      option.defaultSize || getSizeInSearchOptions(option.options, size)
    ),
  }))
}

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

export const filterValues = (i18n, edges, filterArray, isOr) =>
  edges.filter(({ node }) => {
    return filterArray
      .map(
        option =>
          containsText(i18n, node, option.label, [option.field]) &&
          filterByDate(node)
      )
      .reduce((c, v) => (isOr ? c || v : c && v), isOr ? false : true)
  })

const optionSortOrder = (option, histories) => {
  return histories.findIndex(h => _isEqual(h, option))
}

export const sortOptionsWithHistories = (options, histories) => {
  return options.sort(
    (a, b) => optionSortOrder(b, histories) - optionSortOrder(a, histories)
  )
}

export const calculatePastNdays = ({ case_no, date }, n = 14) => {
  const endDateTimeStamp = +new Date(date)
  const daysToExpire = case_no !== "-" ? 14 : 0
  if (Number.isNaN(endDateTimeStamp)) return false
  return new Date() - endDateTimeStamp > 86400 * 1000 * daysToExpire
}
