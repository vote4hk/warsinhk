import React, { Component } from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import L from "leaflet"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet/dist/leaflet.css"
import AutoSizer from "react-virtualized/dist/es/AutoSizer"
import List from "react-virtualized/dist/es/List"
import CellMeasurer, {
  CellMeasurerCache,
} from "react-virtualized/dist/es/CellMeasurer"
import mapMarker from "./icons/map-marker.png"
import keyBy from "lodash/keyBy"
import findIndex from "lodash/findIndex"
import { withTheme } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import DateRangeIcon from "@material-ui/icons/DateRange"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import styled, { createGlobalStyle } from "styled-components"
import { bps } from "@/ui/theme"

const limit = 1.5

const LeafletStyleOverride = createGlobalStyle`
.leaflet-popup-content {
${bps.down("sm")} {
    margin: 5px 7px;
  }
}
`

const DateButton = styled(IconButton)`
  padding: 0;
  margin-left: 8px;
`

class HighRiskMap extends Component {
  static propTypes = {
    filteredLocations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        lat: PropTypes.string,
        lng: PropTypes.string,
      })
    ),
    getTranslated: PropTypes.func.isRequired,
  }
  static defaultProps = {
    filteredLocations: [],
    maxBounds: [
      [22.3600556 - limit, 114.1535941 - limit],
      [22.3600556 + limit, 114.1535941 + limit],
    ],
    center: [22.3600556, 114.1535941],
    defaultZoom: 11,
  }
  constructor(props) {
    super(props)
    this.state = {
      activeDataPoint: undefined,
      dataPointRendered: null,
      showDatePicker: false,
    }
    this.cache = new CellMeasurerCache({
      defaultHeight: 50,
      fixedWidth: true,
    })
    this.rowRenderer = ({ index, isScrolling, key, parent, style }) => {
      return (
        <CellMeasurer
          cache={this.cache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
        >
          <div className={this.props.rowContainerClass} style={{ ...style }}>
            <div
              onClick={this.getActiveHandler(
                this.props.filteredLocations[index]
              )}
            >
              {this.props.renderCard({
                node: this.props.filteredLocations[index],
                isActive: this.state.activeDataPoint
                  ? this.props.filteredLocations[index].id ===
                    this.state.activeDataPoint.id
                  : false,
              })}
            </div>
          </div>
        </CellMeasurer>
      )
    }
  }

  getActiveHandler = highRiskLocation => () => {
    const { id } = highRiskLocation
    trackCustomEvent({
      category: "high_risk_map",
      action: "click_marker",
      label: `${highRiskLocation.sub_district_zh} | ${highRiskLocation.location_zh}`,
    })
    if (!this.state.activeDataPoint || this.state.activeDataPoint.id !== id) {
      this.setState(
        {
          activeDataPoint: highRiskLocation,
        },
        () => {
          if (highRiskLocation.lat && highRiskLocation.lng)
            this.map.flyToBounds(
              [
                [highRiskLocation.lat, highRiskLocation.lng],
                [highRiskLocation.lat, highRiskLocation.lng],
              ],
              {
                maxZoom: 15,
                paddingTopLeft: [0, 60],
                duration: 1.5,
              }
            )
          const marker = this.markersById[id]
          if (marker && !marker.isPopupOpen())
            this.map.openPopup(marker._popup, marker._latlng, {
              autoClose: false,
              closeOnClick: false,
              closeButton: false,
              closeOnEscapeKey: false,
            })
        }
      )
    } else {
      this.setState({ activeDataPoint: undefined }, () => {
        if (this.markersById[id] && this.markersById[id].isPopupOpen())
          this.map.closePopup(this.markersById[id]._popup)
        this.resetMapViewPort()
      })
    }
  }

  dataPointToMarker = highRiskLocation => {
    const { lat, lng } = highRiskLocation
    const activeHandler = this.getActiveHandler(highRiskLocation)
    const marker = L.marker([+lat, +lng], {
      icon: this.icons.defaultMarker,
      id: highRiskLocation.id,
    })
      .bindPopup(
        `${this.props.getTranslated(
          highRiskLocation,
          "sub_district"
        )}<br /><b style='font-weight:700'>${this.props.getTranslated(
          highRiskLocation,
          "location"
        )}</b>`
      )
      .on("click", activeHandler)
    return marker
  }
  updateLocationMarkers(filteredLocations) {
    const dataPoints = filteredLocations.filter(i => i.lat && i.lng)
    this.markerClusterGroup.clearLayers()
    const markers = dataPoints.map(this.dataPointToMarker)
    this.markersById = keyBy(markers, "options.id")
    this.markerClusterGroup.addLayers(dataPoints.map(this.dataPointToMarker))
  }

  initialIcons() {
    this.icons = {
      defaultMarker: L.icon({
        iconUrl: mapMarker,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      }),
    }
  }

  // Leaflet related Initializations need to be wrapped inside CDM (Leaflet requires window to be rendered)
  componentDidMount() {
    this.initialIcons()
    this.popupContainer = document.createElement("div")
    this.PopUpContent = ({ children }) =>
      ReactDom.createPortal(children, this.popupContainer)
    this.map = L.map(this.mapContainer, {
      zoomControl: false,
      attributionControl: false,
      maxBounds: this.props.maxBounds,
    }).setView(this.props.center, this.props.defaultZoom)
    this.attributionControl = L.control
      .attribution()
      .setPrefix("")
      .addAttribution(
        'Tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      )
    this.attributionControl.addTo(this.map)
    L.tileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}",
      {
        subdomains: "abcd",
        maxZoom: 16,
        minZoom: 9,
        ext: "png",
      }
    ).addTo(this.map)
    this.markerClusterGroup = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      disableClusteringAtZoom: 11,
    })
    this.markerClusterGroup.addTo(this.map)
    this.updateLocationMarkers(this.props.filteredLocations)
  }

  static getDerivedStateFromProps(props, state) {
    const { activeDataPoint } = state
    const scrollToIndex =
      activeDataPoint &&
      findIndex(props.filteredLocations, i => i.id === activeDataPoint.id)
    return {
      useHorizontalLayout: props.width - props.height > 480,
      scrollToIndex,
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.filteredLocations !== this.props.filteredLocations) {
      this.cache.clearAll()
      this.setState({ activeDataPoint: null, dataPointRendered: null })
    }
    if (prevProps.dateFilterEnabled !== this.props.dateFilterEnabled) {
      this.setState({ showDatePicker: false })
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.height !== this.props.height ||
      prevProps.width !== this.props.width
    ) {
      this.map.invalidateSize()
    }
    if (prevProps.filteredLocations !== this.props.filteredLocations) {
      this.updateLocationMarkers(this.props.filteredLocations)
      this.resetMapViewPort()
    }
  }
  resetMapViewPort = () => {
    const bounds = this.props.filteredLocations
      .filter(i => i.lat && i.lng)
      .reduce(
        (acc, node, i, arr) => {
          if (i === 0) {
            acc[0][0] = acc[1][0] = +node.lat
            acc[0][1] = acc[1][1] = +node.lng
          } else {
            acc[0][0] = Math.min(acc[0][0], +node.lat)
            acc[0][1] = Math.min(acc[0][1], +node.lng)
            acc[1][0] = Math.max(acc[1][0], +node.lat)
            acc[1][1] = Math.max(acc[1][1], +node.lng)
          }
          return acc
        },
        [
          [0, 0],
          [0, 0],
        ]
      )
    this.map.fitBounds(L.latLngBounds(bounds).pad(0.1), { maxZoom: 15 })
  }
  render() {
    const { useHorizontalLayout } = this.state
    const { height, width, theme } = this.props

    return (
      <div
        style={{
          position: "relative",
          height,
          width,
        }}
      >
        <LeafletStyleOverride />
        <div
          ref={el => (this.mapContainer = el)}
          style={{
            position: "absolute",
            top: 0,
            left: useHorizontalLayout ? 480 : 0,
            bottom: useHorizontalLayout ? 0 : height / 2,
            right: 0,
            zIndex: 0,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: useHorizontalLayout ? 56 : height / 2,
            left: 0,
            width: useHorizontalLayout ? 480 : width,
            height: useHorizontalLayout ? height - 56 : height / 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <AutoSizer>
            {({ width, height }) => (
              <List
                ref={el => (this.list = el)}
                height={height}
                overscanRowCount={8}
                rowCount={this.props.filteredLocations.length}
                rowHeight={this.cache.rowHeight}
                rowRenderer={this.rowRenderer}
                deferredMeasurementCache={this.cache}
                width={width}
                scrollToIndex={this.state.scrollToIndex || 0}
                scrollToAlignment="auto"
                activeDataPoint={this.state.activeDataPoint}
              />
            )}
          </AutoSizer>
        </div>
        <div
          style={
            !useHorizontalLayout
              ? {
                  position: "absolute",
                  top: theme.spacing(1),
                  left: theme.spacing(2),
                  right: theme.spacing(2),
                  opacity: 0.96,
                }
              : {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 480,
                  height: 56,
                  paddingTop: theme.spacing(2),
                  paddingBottom: theme.spacing(1),
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  backgroundColor: theme.palette.background.paper,
                }
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>{this.props.selectBar}</div>
            <DateButton
              color={this.props.dateFilterEnabled ? "secondary" : "primary"}
              onClick={() => {
                trackCustomEvent({
                  category: "high_risk_map",
                  action: "click_date_filter",
                  label: this.props.dateFilterEnabled ? "enable" : "disable",
                })
                this.setState({ showDatePicker: !this.state.showDatePicker })
              }}
            >
              <DateRangeIcon />
            </DateButton>
          </div>
          {this.state.showDatePicker && this.props.datePicker}
        </div>
      </div>
    )
  }
}
export default withTheme(HighRiskMap)
