import React from "react"
import * as d3 from "d3"
import hk18DistrictGeoJson from "./hk18districts.json"

export class HK18DistrictChart extends React.Component {
  static defaultProps = {
    districtNodeDrawer: () => undefined,
    getDescriptionByDistrictName: () => "",
    getColorer: ele => d3.scaleQuantize(ele.props.scale, d3.schemeReds[6]),
  }
  updateGraph() {
    const svg = d3.select(this.svgContainer)
    const projection = d3.geoMercator().fitExtent(
      [
        [0, 0],
        [300, 300],
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
      .attr("d", geoGenerator)
      .on("mouseover", function mouseoverHandler(datum) {
        d3.select(this).attr("stroke", "yellow")
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
        d3.select(this).attr("stroke", "")
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
      .style("background", "white")
      .style("border", "1px solid black")
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
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      ></svg>
    )
  }
}
export default HK18DistrictChart
