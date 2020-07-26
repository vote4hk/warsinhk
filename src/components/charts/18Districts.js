import React from "react"
import * as d3 from "d3"
import { legendColor } from "d3-svg-legend"
import hk18DistrictGeoJson from "./hk18districts.json"

const colorList = [
  "#f7f0f0",
  "#edd4cc",
  "#ffad91",
  "#ec7d58",
  "#b53232",
  // "#b53232",
  // "#ec7d58",
  // "#9e2527",
  // "#5c0608",
]

// eslint-disable-next-line no-unused-vars
const legendColumn = container => scale => {
  const legend = legendColor
    .apply(d3)
    .labelFormat(d3.format("d"))
    .labelDelimiter("-")
    .scale(scale)
    .shapeWidth(12)
    .shapeHeight(12)
    .labels(({ i, generatedLabels, range }) => {
      const oriLabel = generatedLabels[i]
      const [start, end] = oriLabel.match(/\d+/g)
      return `${i === 0 ? +start + 1 : start} - ${
        i < generatedLabels.length - 1 ? +end - 1 : end
      }`
    })

  const svg = d3.select(container)
  svg.append("g").attr("class", "legend")

  svg.select(".legend").call(legend)
  const { width, height } = svg
    .select(".legend")
    .node()
    .getBBox()
  svg.attr("width", width)
  svg.attr("height", height)
}

const dimension = (window && window.innerWidth) || 500

export class HK18DistrictChart extends React.Component {
  static defaultProps = {
    districtNodeDrawer: () => undefined,
    getDescriptionByDistrictName: () => "",
    legendTitle: null,
    legendShapeSize: 12,
    getColorer: ele => d3.scaleQuantize(ele.props.scale, colorList),
  }

  appendLegend = scale => {
    const legendMaker = legendColor
      .apply(d3)
      .labelFormat(d3.format("d"))
      .labelDelimiter("-")
      .scale(scale)
      .shapeWidth(this.props.legendShapeSize)
      .shapeHeight(this.props.legendShapeSize)
      .labels(({ i, generatedLabels, range }) => {
        const oriLabel = generatedLabels[i]
        const [start, end] = oriLabel.match(/\d+/g)
        return `${i === 0 ? +start + 1 : start} - ${
          i < generatedLabels.length - 1 ? +end - 1 : end
        }`
      })
    const svg = d3.select(this.legendContainer)
    svg.append("g").attr("class", "legend")

    svg.select(".legend").call(legendMaker)
    const { width, height } = svg
      .select(".legend")
      .node()
      .getBBox()
    svg.attr("width", width)
    svg.attr("height", height)
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
      .selectAll("g")
      .data(hk18DistrictGeoJson.features)
      .join("g")
      .attr("class", "hk-district-map-district")
      .attr("data-district-name-tc", datum => datum.properties.TCNAME)
      .append("path")
      .attr("fill", datum => {
        const count = this.props.getDataByDistrictName(
          datum.properties.TCNAME,
          datum.properties.ENAME
        )
        return count === 0 ? "#FFFFFF" : color(count)
      })
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
    this.appendLegend(color)
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
    if (prevProps.scale !== this.props.scale && this.svgContainer)
      this.updateGraph()
  }

  componentWillUnmount() {
    this.tooltip.remove()
  }
  render() {
    return (
      <div
        ref={el => (this.graphContainer = el)}
        style={{ position: "relative" }}
      >
        <svg
          ref={el => (this.svgContainer = el)}
          viewBox={`0 0 ${dimension} ${dimension}`}
          xmlns="http://www.w3.org/2000/svg"
        ></svg>
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            fontSize: 12,
            bottom: "5%",
            right: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            padding: "5px 5px 0px",
          }}
        >
          {this.props.legendTitle}
          <svg
            ref={el => (this.legendContainer = el)}
            xmlns="http://www.w3.org/2000/svg"
            width="100"
          ></svg>
        </div>
      </div>
    )
  }
}
export default HK18DistrictChart
