import React, { useState, useRef } from "react"
import PropTypes from "prop-types"
import Chip from "@material-ui/core/Chip"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import AddIcon from "@material-ui/icons/Add"
import omit from "lodash/omit"
import mapKeys from "lodash/mapKeys"
import loopbackFilters from "loopback-filters"

const OptionTag = ({
  label,
  options,
  filters,
  field,
  setOption,
  clearFilter,
  filteredList,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const elementRef = useRef()
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
        clickable
        deleteIcon={filterExists ? undefined : <AddIcon />}
        onDelete={filterExists ? () => clearFilter(field) : openMenu}
        label={label}
        onClick={openMenu}
      />
      <Menu
        id="simple-menu"
        anchorEl={elementRef.current}
        // keepMounted
        open={menuOpen}
        onClose={closeMenu}
      >
        {options.map(option => (
          <MenuItem
            key={option.value}
            onClick={selectValue({ ...option, filterName: label, field })}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>{option.label}</span>
            <span style={{ textAlign: "right", marginLeft: "2em" }}>
              {
                loopbackFilters(filteredList, {
                  where: { [`node.${field}`]: option.value },
                }).length
              }
            </span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

const TagStyledFilter = props => {
  const { options, list, onListFiltered } = props
  const [orderedItemSym] = useState(Symbol("order"))
  const [filteredList, setFilteredList] = useState(list)
  const [filters, setFilters] = useState({ [orderedItemSym]: [] })
  const applyFilter = filter => {
    const result = loopbackFilters(list, {
      where: mapKeys(filter, (v, key) => `node.${key}`),
    })
    setFilters(filter)
    setFilteredList(result)
    onListFiltered(result)
  }
  const setOption = option => {
    const newFilter = {
      ...filters,
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
            key={option.realFieldName}
            {...option}
            filters={filters}
            setOption={setOption}
            clearFilter={clearFilter}
            field={option.realFieldName}
            list={list}
            filteredList={filteredList}
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

export default TagStyledFilter
