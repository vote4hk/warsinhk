import React, { Component } from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import L from "leaflet"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.default.css"
import "leaflet/dist/leaflet.css"
import mapMarker from "./icons/map-marker.png"

const icons = {
  defaultMarker: L.icon({
    iconUrl: mapMarker,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  }),
}
const limit = 1.5
export default class highRiskMap extends Component {
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
    this.popupContainer = document.createElement("div")
    this.PopUpContent = ({ children }) =>
      ReactDom.createPortal(children, this.popupContainer)
    this.state = {
      activeDataPoint: {},
    }
  }

  dataPointToMarker = highRiskLocation => {
    const { lat, lng } = highRiskLocation
    // TODO: Different visual for different type of data.
    // const marker = L.marker
    const marker = L.circleMarker
    return marker([+lat, +lng], {
      icon: icons.defaultMarker,
      radius: 10,
      fillColor: "red",
      fillOpacity: 1,
      strokeColor: "red",
      strokeOpacity: "0.8",
      data: highRiskLocation,
    })
      .bindPopup(this.popupContainer)
      .on("popupopen", () => {
        this.setState({ activeDataPoint: highRiskLocation })
        this.map.setView([highRiskLocation.lat, highRiskLocation.lng])
      })
  }
  updateLocationMarkers(filteredLocations) {
    const dataPoints = filteredLocations.filter(i => i.lat && i.lng)
    this.markerClusterGroup.clearLayers()
    this.markerClusterGroup.addLayers(dataPoints.map(this.dataPointToMarker))
  }

  componentDidMount() {
    this.map = L.map(this.mapContainer, {
      zoomControl: false,
      maxBounds: this.props.maxBounds,
    }).setView(this.props.center, this.props.defaultZoom)
    L.tileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}",
      {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: "abcd",
        maxZoom: 20,
        minZoom: 9,
        ext: "png",
      }
    ).addTo(this.map)
    this.markerClusterGroup = L.markerClusterGroup({})
    this.markerClusterGroup.addTo(this.map)
    this.updateLocationMarkers(this.props.filteredLocations)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.filteredLocations !== this.props.filteredLocations) {
      this.updateLocationMarkers(this.props.filteredLocations)
      const centerPoint = this.props.filteredLocations
        .filter(i => i.lat && i.lng)
        .reduce(
          (acc, node, i, arr) => {
            acc[0] += +node.lat / arr.length
            acc[1] += +node.lng / arr.length
            return acc
          },
          [0, 0]
        )
      this.map.setView(centerPoint, this.props.defaultZoom)
    }
  }

  render() {
    const PopUp = this.PopUpContent
    return (
      <div style={{ position: "relative" }}>
        <div
          ref={el => (this.mapContainer = el)}
          style={{ height: this.props.height, zIndex: 0 }}
        ></div>
        {this.props.children}
        <PopUp>
          {this.state.activeDataPoint
            ? this.props.renderTooltip(this.state.activeDataPoint)
            : null}
        </PopUp>
      </div>
    )
  }
}
