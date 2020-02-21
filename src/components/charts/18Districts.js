import React from "react"
import * as d3 from "d3"
import hk18DistrictGeoJson from "./hk18districts.json"

const colorList = [
  "#FFFFFF",
  "#f7f0f0",
  "#edd4cc",
  "#ffad91",
  "#ec7d58",
  "#b53232",
  "#b53232",
  "#ec7d58",
  "#9e2527",
  "#5c0608",
]

const dimension = (window && window.innerWidth) || 500

export class HK18DistrictChart extends React.Component {
  static defaultProps = {
    districtNodeDrawer: () => undefined,
    getDescriptionByDistrictName: () => "",
    getColorer: ele => d3.scaleQuantize(ele.props.scale, colorList),
  }

  updateGraph() {
    const svg = d3.select(this.svgContainer)
    const projection = d3.geoMercator().fitExtent(
      [
        [0, 0],
        [dimension, dimension],
      ],
      hk18DistrictGeoJson
    )
    const geoGenerator = d3.geoPath().projection(projection)

    const color = this.props.getColorer(this)
    const getDescriptionByDistrictName = this.props.getDescriptionByDistrictName
    const tooltip = this.tooltip
    const d3DistrictPathNode = svg
      .selectAll("path")
      .remove()
      .data(hk18DistrictGeoJson.features)
      .enter()
      .append("g")
      .attr("class", "hk-district-map-district")
      .attr("data-district-name-tc", datum => datum.properties.TCNAME)
      .append("path")
      .attr("fill", datum =>
        color(
          this.props.getDataByDistrictName(
            datum.properties.TCNAME,
            datum.properties.ENAME
          )
        )
      )
      .attr("stroke", "#d6d6d6")
      .attr("stroke-width", "1px")
      .attr("d", geoGenerator)
      .on("mouseover", function mouseoverHandler(datum) {
        d3.select(this).attr("stroke", "#b5b5b5")
        tooltip.style("visibility", "visible")
        tooltip.text(
          getDescriptionByDistrictName(
            datum.properties.TCNAME,
            datum.properties.ENAME
          )
        )
      })
      .on("mousemove", function(datum) {
        const event = d3.event
        tooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px")
      })
      .on("mouseout", function mouseoutHandler() {
        d3.select(this).attr("stroke", "#d6d6d6")
        tooltip.style("visibility", "hidden")
      })

    this.props.districtNodeDrawer(d3DistrictPathNode)
  }
  initSimpleTooltip() {
    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "hk-district-map-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "#333")
      .style("color", "white")
      .style("padding", "10px")
  }
  componentDidMount() {
    this.initSimpleTooltip()
    this.updateGraph()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.entries !== this.props.entries && this.svgContainer)
      this.updateGraph()
  }
  componentWillUnmount() {
    this.tooltip.remove()
  }
  render() {
    return (
      <svg
        ref={el => (this.svgContainer = el)}
        viewBox={`0 0 ${dimension} ${dimension}`}
        xmlns="http://www.w3.org/2000/svg"
      ></svg>
    )
  }
}
export default HK18DistrictChart
