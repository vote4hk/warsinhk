import React, { useState, useEffect } from "react"
import AsyncSelect from "react-select/async"
import { useTranslation } from "react-i18next"
import PropTypes from "prop-types"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

import {
  filterSearchOptions,
  filterValues,
  sortOptionsWithHistories,
} from "@/utils/search"

import { saveToLocalStorage, loadFromLocalStorage } from "@/utils"

const MultiPurposeSearch = props => {
  const {
    options,
    list,
    placeholder,
    onListFiltered,
    searchKey,
    filterWithOr = true,
  } = props

  const [filters, setFilters] = useState([])
  const [histories, setHistories] = useState([])
  const sortedOptions = options.map(opt => ({
    ...opt,
    options: sortOptionsWithHistories(opt.options, histories),
  }))
  const { t, i18n } = useTranslation()
  useEffect(() => {
    const v = loadFromLocalStorage(searchKey)
    if (v) {
      setHistories(JSON.parse(v))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const customStyles = {
    placeholder: () => ({
      // none of react-select's styles are passed to <Control />
      fontSize: "12px",
      color: "#cccccc",
    }),
  }

  return (
    <AsyncSelect
      styles={customStyles}
      closeMenuOnSelect={false}
      loadOptions={(input, callback) =>
        callback(filterSearchOptions(sortedOptions, input, 5))
      }
      isMulti
      placeholder={placeholder}
      noOptionsMessage={() => t("text.not_found")}
      defaultOptions={filterSearchOptions(sortedOptions, null, 10)}
      onChange={selectedArray => {
        trackCustomEvent({
          category: searchKey,
          action: "search_input",
          label: selectedArray ? selectedArray.join(",") : "",
        })
        if (selectedArray && selectedArray.length > (filters || []).length) {
          let historiesToSave = [
            ...histories,
            selectedArray[selectedArray.length - 1],
          ]
          if (historiesToSave.length >= 10) {
            historiesToSave.shift()
          }
          setHistories(historiesToSave)
          saveToLocalStorage(searchKey, JSON.stringify(historiesToSave))
          onListFiltered(filterValues(i18n, list, selectedArray, filterWithOr))
        } else if (selectedArray && selectedArray.length > 0) {
          onListFiltered(filterValues(i18n, list, selectedArray, filterWithOr))
        } else {
          // return whole list if input is empty
          onListFiltered(list)
        }
        setFilters(selectedArray)
      }}
    />
  )
}

MultiPurposeSearch.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.object.isRequired,
    }).isRequired
  ).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          field: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ).isRequired,
  onListFiltered: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchKey: PropTypes.string.isRequired,
}

export default MultiPurposeSearch
