import React, { useState, useRef } from "react"
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
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const elementRef = useRef()
  const inputRef = useRef()
  const selectValue = option => () => {
    setOption(option)
    setMenuOpen(false)
  }
  const openMenu = () => setMenuOpen(true)
  const closeMenu = () => setMenuOpen(false)
  const filterExists = Boolean(filters[field])
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
          {options
            .map(option => ({
              ...option,
              field,
              count: getFilterCount({ [field]: option.value }, filterExists),
            }))
            .sort(
              orderOptionsByFilterCount ? (a, b) => b.count - a.count : () => 0
            )
            .map((option, index) => (
              <form key={index}>
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
                    {option.count}
                  </div>
                </MenuItem>
              </form>
            ))}
        </Menu>
      )}
    </div>
  )
}

const TagStyledFilter = props => {
  const { options, list, onListFiltered } = props
  const [orderedItemSym] = useState(Symbol("order"))
  const [filteredList, setFilteredList] = useState(list)
  const [filters, setFilters] = useState({ [orderedItemSym]: [] })
  const getWhereFilter = newFilters => {
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
        Object.fromEntries(andFilters),
        ...orFilters.map(filters => ({ or: filters })),
      ],
    }
  }
  const getFilterCount = (filter, active) => {
    return lbFilter.applyLoopbackFilter(active ? list : filteredList, {
      where: active
        ? getWhereFilter({ ...filters, ...filter })
        : getWhereFilter(filter),
    }).length
  }
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
  return (
    <React.Fragment>
      <div style={{ marginTop: "1em", lineHeight: 2 }}>
        {options.map(option => (
          <OptionTag
            key={option.realFieldName + option.value}
            {...option}
            filters={filters}
            setOption={setOption}
            clearFilter={clearFilter}
            field={option.realFieldName}
            list={list}
            filteredList={filteredList}
            filterType={option.filterType}
            getFilterCount={getFilterCount}
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
