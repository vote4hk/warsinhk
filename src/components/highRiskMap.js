import React, { Component } from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import L from "leaflet"
import "leaflet-pixi-overlay"
// import "leaflet.markercluster"
// import "leaflet.markercluster/dist/MarkerCluster.css"
// import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet/dist/leaflet.css"
import AutoSizer from "react-virtualized/dist/es/AutoSizer"
import List from "react-virtualized/dist/es/List"
import CellMeasurer, {
  CellMeasurerCache,
} from "react-virtualized/dist/es/CellMeasurer"
import Fullscreen from "react-full-screen";
import ConfirmedCaseMarker from "./icons/confirmed_case.png"
import HomeConfineesMarker from "./icons/home_confinees.png"
import ClinicMarker from "./icons/clinic.png"
import QuarantineMarker from "./icons/quarantine.png"
import DefaultMarker from "./icons/default.png"
import keyBy from "lodash/keyBy"
import findIndex from "lodash/findIndex"
import { withTheme } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import DateRangeIcon from "@material-ui/icons/DateRange"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit"
import NotListedLocationIcon from "@material-ui/icons/NotListedLocationRounded"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import styled, { createGlobalStyle } from "styled-components"
import { bps } from "@/ui/theme"
import { Loader, Sprite, Container } from "pixi.js"

const limit = 1.5

const LeafletStyleOverride = createGlobalStyle`
.leaflet-popup-content {
${bps.down("sm")} {
    margin: 5px 7px;
  }
}
.faded {
  opacity: .15 !important;
}
`

const DateButton = styled(IconButton)`
  padding: 0;
  margin-left: 8px;
`

const LegendContainer = styled.table`
  margin: 8px 10px;
  td:first-child {
    padding-right: 8px;
  }
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
      fullscreenEnabled: false,
      showDatePicker: false,
      legend: null,
      showLegend: true,
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
          this.map.once("zoomend", () => {
            if (marker && !marker.isPopupOpen())
              this.map.openPopup(marker._popup, marker._latlng, {
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
                closeOnEscapeKey: false,
              })
            this.pixiLayer.redraw()
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

  initMarkerMappings() {
    this.iconMappings = {
      confirmed_case: this.icons.confirmedCaseMarker,
      confirmed_case_pass14days: this.icons.fadedConfirmedCaseMarker,
      home_confinees: this.icons.homeConfineesMarker,
      home_confinees_pass14days: this.icons.fadedHomeConfineesMarker,
      quarantine: this.icons.quarantineMarker,
      // clinic: this.icons.clinicMarker,
    }
    Object.entries(this.iconMappings).forEach(([key, marker]) =>
      this.loader.add(key, marker.options.iconUrl)
    )
    // Load images into GL texture
    this.textureReady = new Promise(resolve =>
      this.loader.load((loader, resources) => {
        this.textureResources = resources
        resolve()
      })
    )
  }

  renderLegend() {
    return (
      <LegendContainer>
        <tbody>
          {Object.keys(this.iconMappings)
            .map(k => [k, this.iconMappings[k]])
            .map(
              ([
                key,
                {
                  options: {
                    className,
                    iconUrl,
                    iconSize: [width, height],
                  },
                },
              ]) => (
                <tr key={key}>
                  <td>
                    {
                      <img
                        className={className}
                        src={iconUrl}
                        width={width / 2}
                        height={height / 2}
                        alt={key}
                      />
                    }
                  </td>
                  <td>{this.props.t(`high_risk_map_legend.${key}`)}</td>
                </tr>
              )
            )}
        </tbody>
      </LegendContainer>
    )
  }

  mapPinTypeToMarker = (pinType, allPass14days) => {
    const type = allPass14days ? `${pinType}_pass14days` : pinType
    if (!this.iconMappings[type]) {
      console.log(type)
      return this.icons.defaultMarker
    }
    return this.iconMappings[type]
  }

  dataPointToMarker = highRiskLocation => {
    const { lat, lng, pinType, allPass14days } = highRiskLocation
    const activeHandler = this.getActiveHandler(highRiskLocation)
    const marker = L.marker([+lat, +lng], {
      icon: this.mapPinTypeToMarker(pinType, allPass14days),
      pinType: allPass14days ? `${pinType}_pass14days` : pinType,
      id: highRiskLocation.id,
      fade: allPass14days,
      activeHandler,
    }).bindPopup(
      `${this.props.getTranslated(
        highRiskLocation,
        "sub_district"
      )}<br /><b style='font-weight:700'>${this.props.getTranslated(
        highRiskLocation,
        "location"
      )}</b>`
    )
    return marker
  }
  async updateLocationMarkers(filteredLocations) {
    await this.textureReady
    const dataPoints = filteredLocations.filter(i => i.lat && i.lng)
    // this.markerClusterGroup.clearLayers()
    const markers = dataPoints.map(this.dataPointToMarker)
    this.markersById = keyBy(markers, "options.id")
    this.pixiContainer.removeChildren()
    let x, y, target
    markers.forEach(marker => {
      if (!this.textureResources[marker.options.pinType]) {
        console.log(marker.options.pinType, "resource not found")
        return
      }
      const sprite = new Sprite(
        this.textureResources[marker.options.pinType].texture
      )
      sprite._latlng = marker._latlng
      sprite.anchor.set(0.5, 1)
      sprite.interactive = true
      if (marker.options.fade) sprite.alpha = 0.5
      sprite.on("pointerdown", e => {
        x = e.data.global.x
        y = e.data.global.y
        target = e.target
      })

      sprite.on("pointerup", e => {
        if (
          e.target === target &&
          e.data.global.x === x &&
          e.data.global.y === y
        ) {
          setTimeout(marker.options.activeHandler, 16)
        }
      })
      this.pixiContainer.addChild(sprite)
    })

    this.pixiLayer.redraw()
  }

  initIcons() {
    const defaultMarkerOptions = {
      iconUrl: DefaultMarker,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    }
    this.icons = {
      defaultMarker: L.icon({ ...defaultMarkerOptions }),
      confirmedCaseMarker: L.icon({
        ...defaultMarkerOptions,
        iconUrl: ConfirmedCaseMarker,
      }),
      homeConfineesMarker: L.icon({
        ...defaultMarkerOptions,
        iconUrl: HomeConfineesMarker,
      }),
      clinicMarker: L.icon({ ...defaultMarkerOptions, iconUrl: ClinicMarker }),
      quarantineMarker: L.icon({
        ...defaultMarkerOptions,
        iconUrl: QuarantineMarker,
      }),
      fadedConfirmedCaseMarker: L.icon({
        ...defaultMarkerOptions,
        iconUrl: ConfirmedCaseMarker,
        className: "faded",
      }),
      fadedHomeConfineesMarker: L.icon({
        ...defaultMarkerOptions,
        iconUrl: HomeConfineesMarker,
        className: "faded",
      }),
      pass14days: L.icon({ ...defaultMarkerOptions, className: "faded" }),
    }
  }
  initPixiOverlay() {
    const pixiContainer = new Container()
    pixiContainer.interactive = true
    pixiContainer.interactiveChildren = true
    pixiContainer.buttonMode = true
    this.pixiContainer = pixiContainer

    return L.pixiOverlay(
      utils => {
        var zoom = utils.getMap().getZoom()
        var container = utils.getContainer()
        var renderer = utils.getRenderer()
        var project = utils.latLngToLayerPoint
        var scale = utils.getScale()

        container.children.forEach(item => {
          const { x, y } = project(item._latlng)
          item.x = x
          item.y = y
          item.scale.set(zoom > 12 ? 1 / scale : 1)
        })
        renderer.render(container)
      },
      pixiContainer,
      {
        padding: 0,
        clearBeforeRender: true,
        doubleBuffering:
          /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
      }
    )
  }
  initMap() {
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
    // this.markerClusterGroup = L.markerClusterGroup({
    //   spiderfyOnMaxZoom: false,
    //   disableClusteringAtZoom: 11,
    // })
    // this.markerClusterGroup.addTo(this.map)
  }
  // Leaflet related Initializations need to be wrapped inside CDM (Leaflet requires window to be rendered)
  componentDidMount() {
    this.loader = new Loader()
    this.initIcons()
    this.initMarkerMappings()
    this.initMap()
    const pixiLayer = this.initPixiOverlay()
    pixiLayer.addTo(this.map)
    this.map.on("moveend", () => this.pixiLayer.redraw())
    this.pixiLayer = pixiLayer
    this.setState({ legend: this.renderLegend() })
    this.popupContainer = document.createElement("div")
    this.PopUpContent = ({ children }) =>
      ReactDom.createPortal(children, this.popupContainer)

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
    if (prevProps.language !== this.props.language) {
      this.setState({ legend: this.renderLegend() })
    }
  }

  resetMapViewPort() {
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

  toggleFullscreen(fullscreenEnabled) {
    if (typeof fullscreenEnabled !== "boolean") { fullscreenEnabled = !this.state.fullscreenEnabled }
    this.setState({ fullscreenEnabled })
  }

  render() {
    const { fullscreenEnabled, useHorizontalLayout } = this.state
    const { height, width, theme } = this.props

    return (
      <Fullscreen
        enabled={fullscreenEnabled}
        onChange={enabled => this.toggleFullscreen(enabled)}
      >
        <div
          style={{
            position: "relative",
            height: fullscreenEnabled ? "100%" : height,
            width: fullscreenEnabled ? "100%" : width,
          }}
        >
          <LeafletStyleOverride />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: (useHorizontalLayout && !fullscreenEnabled) ? 480 : 0,
              bottom: (useHorizontalLayout || fullscreenEnabled) ? 0 : height / 2,
              right: 0,
              zIndex: 0,
            }}
          >
            <div
              ref={el => (this.mapContainer = el)}
              style={{ width: "100%", height: "100%" }}
            />

            {this.state.showLegend && (
              <div
                style={{
                  position: "absolute",
                  background: "rgba(255,255,255,0.9)",
                  bottom: "64px",
                  right: 0,
                  zIndex: 500,
                  pointerEvents: "none",
                }}
              >
                {this.state.legend}
              </div>
            )}
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                right: "48px",
                zIndex: 501,
              }}
            >
              <IconButton
                color={this.state.showLegend ? "secondary" : "primary"}
                onClick={() => {
                  trackCustomEvent({
                    category: "high_risk_map",
                    action: "toggle_legend",
                    label: this.state.showLegend ? "enable" : "disable",
                  })
                  this.setState({ showLegend: !this.state.showLegend })
                }}
              >
                <NotListedLocationIcon />
              </IconButton>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                right: 0,
                zIndex: 550,
              }}
            >
              <IconButton
                color="primary"
                onClick={() => {
                  trackCustomEvent({
                    category: "high_risk_map",
                    action: "toggle_fullscreen",
                    label: fullscreenEnabled ? "enable" : "disable",
                  })
                  this.toggleFullscreen()
                }}
              >
                {fullscreenEnabled ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </div>
          </div>
          {
            !fullscreenEnabled && (
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
                      scrollToAlignment="start"
                      activeDataPoint={this.state.activeDataPoint}
                    />
                  )}
                </AutoSizer>
              </div>
            )
          }
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
      </Fullscreen>
    )
  }
}
export default withTheme(HighRiskMap)
