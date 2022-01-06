import React, { useState, useRef, useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import Chip from "@material-ui/core/Chip"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import ListItem from "@material-ui/core/ListItem"
import IconButton from "@material-ui/core/IconButton"
import AddIcon from "@material-ui/icons/Add"
import DoneIcon from "@material-ui/icons/Done"
import omit from "lodash/omit"
import TextField from "@material-ui/core/TextField"
import * as lbFilter from "my-loopback-filter"
import { useTranslation } from "react-i18next"
import fromPairs from "lodash/fromPairs"
import noop from "lodash/noop"

const OptionTag = ({
  label,
  options,
  orderOptionsByFilterCount,
  filters,
  field,
  setOption,
  clearFilter,
  filterType = "options",
  filterPlaceholder = "",
  getFilterCount,
  resetFilters,
}) => {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const triggerRender = useState(0)[1].bind(null, i => i + 1)
  const elementRef = useRef()
  const inputRef = useRef()
  const selectValue = option => () => {
    setOption(option)
    setMenuOpen(false)
  }
  const openMenu = () => setMenuOpen(true)
  const closeMenu = () => setMenuOpen(false)
  const filterExists = Boolean(filters[field])
  const [countsMap, setOptionCountsMap] = useState(new WeakMap())
  const [countsReady, setCountsReady] = useState(false)
  useEffect(() => {
    setCountsReady(false)
    setOptionCountsMap(() => {
      const countsMap = new WeakMap()
      for (const option of options) countsMap.set(option, null)
      return countsMap
    })
  }, [filters, filterExists, options, setOptionCountsMap])
  useEffect(() => {
    const oldCountsMap = countsMap
    if (menuOpen && !countsReady) {
      ;(async () => {
        for (const option of options)
          if (countsMap.get(option) === null) {
            await new Promise((resolve, reject) => {
              requestAnimationFrame(() =>
                setOptionCountsMap(countsMap => {
                  if (oldCountsMap === countsMap) {
                    countsMap.set(
                      option,
                      getFilterCount({ [field]: option.value }, filterExists)
                    )
                    resolve()
                  } else {
                    reject()
                  }
                  return countsMap
                })
              )
            })
            if (Math.random() > 0.75) triggerRender()
          }

        setOptionCountsMap(countsMap => {
          if (countsMap === oldCountsMap) setCountsReady(true)
          return countsMap
        })
      })().catch(noop)
    }
  }, [
    filters,
    filterExists,
    menuOpen,
    countsReady,
    getFilterCount,
    options,
    field,
    setCountsReady,
    countsMap,
  ])
  const displayingOptions =
    menuOpen && countsReady
      ? options
          .sort(
            orderOptionsByFilterCount
              ? (a, b) => countsMap.get(b) - countsMap.get(a)
              : () => 0
          )
          .filter(option =>
            orderOptionsByFilterCount ? countsMap.get(option) > 0 : 1
          )
      : options
  const displayEmptyMessage =
    displayingOptions.length === 0 && options.length > 0
  return (
    <div
      style={{ display: "inline-block", marginRight: "1em" }}
      ref={elementRef}
    >
      <Chip
        size="small"
        variant="outlined"
        color={filterExists ? "secondary" : undefined}
        clickable
        deleteIcon={filterExists ? undefined : <AddIcon />}
        onDelete={filterExists ? () => clearFilter(field) : openMenu}
        label={label}
        onClick={openMenu}
      />
      {menuOpen && (
        <Menu anchorEl={elementRef.current} open={menuOpen} onClose={closeMenu}>
          {filterType === "string" && (
            <form
              onSubmit={event => {
                event.preventDefault()
                const value = inputRef.current.value
                selectValue({ field, filterName: label, value, label: value })()
              }}
            >
              <ListItem>
                <TextField
                  name="filterValue"
                  placeholder={filterPlaceholder}
                  defaultValue={filterExists ? filters[field] : ""}
                  inputRef={inputRef}
                  style={{ width: 280 }}
                />
                <IconButton color="primary" type="submit">
                  <DoneIcon />
                </IconButton>
              </ListItem>
            </form>
          )}
          {displayEmptyMessage ? (
            <MenuItem color="secondary" onClick={resetFilters}>
              <div
                style={{
                  color: "#1a237e",
                  fontWeight: 700,
                }}
              >
                {t("cases.filters_clear")}
              </div>
            </MenuItem>
          ) : menuOpen ? (
            displayingOptions.map((option, index) => (
              <MenuItem
                key={option.value}
                onClick={selectValue({
                  ...option,
                  filterName: label,
                  field,
                })}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  whiteSpace: "break-spaces",
                }}
                selected={filterExists && filters[field] === option.value}
              >
                <div
                  style={{
                    marginRight: "16px",
                  }}
                >
                  {option.label}
                </div>
                <div
                  style={{
                    color: "#1a237e",
                    fontWeight: 700,
                  }}
                >
                  {countsMap.get(option) === null
                    ? t("cases.filters_counting", { defaultValue: "Counting" })
                    : countsMap.get(option)}
                </div>
              </MenuItem>
            ))
          ) : null}
        </Menu>
      )}
    </div>
  )
}

const TagStyledFilter = props => {
  const { options, list, onListFiltered, initialFilters = [] } = props
  const [orderedItemSym] = useState(Symbol("order"))
  const [filteredList, setFilteredList] = useState(list)
  const initialFiltersState = {
    [orderedItemSym]: initialFilters,
    ...fromPairs(initialFilters.map(i => [i.realFieldName, i.value])),
  }
  const [filters, setFilters] = useState(initialFiltersState)
  const getWhereFilter = useMemo(
    () => newFilters => {
      const andFilters = options
        .filter(i => !i.isOrFilter)
        .map(i =>
          newFilters[i.realFieldName]
            ? i.toFilterEntry([i.realFieldName, newFilters[i.realFieldName]])
            : undefined
        )
        .filter(Boolean)

      const orFilters = options
        .filter(i => i.isOrFilter)
        .map(i =>
          newFilters[i.realFieldName]
            ? i.toFilterEntry([i.realFieldName, newFilters[i.realFieldName]])
            : undefined
        )
        .filter(Boolean)
      return {
        and: [
          fromPairs(andFilters),
          ...orFilters.map(filters => ({ or: filters })),
        ],
      }
    },
    [options]
  )
  const getFilterCount = useMemo(
    () => (filter, active) => {
      return lbFilter.applyLoopbackFilter(active ? list : filteredList, {
        where: active
          ? getWhereFilter({ ...filters, ...filter })
          : getWhereFilter(filter),
      }).length
    },
    [list, filteredList, getWhereFilter, filters]
  )
  const applyFilter = newFilters => {
    const where = getWhereFilter(newFilters)
    const result = lbFilter.applyLoopbackFilter(list, {
      where,
    })
    setFilters(newFilters)
    setFilteredList(result)
    onListFiltered(result)
  }
  const setOption = option => {
    const newFilter = {
      ...omit(filters, option.field),
      [option.field]: option.value,
      [orderedItemSym]: [
        ...filters[orderedItemSym].filter(i => i.field !== option.field),
        option,
      ],
    }
    applyFilter(newFilter)
  }
  const clearFilter = field => {
    const newFilter = {
      ...omit(filters, field),
      [orderedItemSym]: filters[orderedItemSym].filter(i => i.field !== field),
    }
    applyFilter(newFilter)
  }
  const resetFilters = () => {
    applyFilter(initialFiltersState)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => applyFilter(filters), [filters])
  return (
    <React.Fragment>
      <div style={{ marginTop: "1em", lineHeight: 2 }}>
        {options.map(option => (
          <OptionTag
            key={option.realFieldName}
            {...option}
            filters={filters}
            setOption={setOption}
            clearFilter={clearFilter}
            field={option.realFieldName}
            list={list}
            filteredList={filteredList}
            filterType={option.filterType}
            getFilterCount={getFilterCount}
            resetFilters={resetFilters}
          />
        ))}
      </div>
      <div style={{ marginTop: "1em", lineHeight: 2 }}>
        {filters[orderedItemSym].map(option => (
          <div
            style={{ display: "inline-block", marginRight: "1em" }}
            key={option.filterName}
          >
            <Chip
              size="small"
              clickable
              color="primary"
              label={`${option.filterName}: ${option.label}`}
              onDelete={() => clearFilter(option.field)}
              onClick={() => clearFilter(option.field)}
            />
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}

TagStyledFilter.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.object.isRequired,
    }).isRequired
  ).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      realFieldName: PropTypes.string.isRequired,
      filterType: PropTypes.oneOf(["options", "string", undefined]),
      toFilter: PropTypes.func,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          field: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
      orderOptionsByFilterCount: PropTypes.bool,
    }).isRequired
  ).isRequired,
  onListFiltered: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchKey: PropTypes.string.isRequired,
}

export default TagStyledFilter
