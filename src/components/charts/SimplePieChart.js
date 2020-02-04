import React from "react"
import * as d3 from "d3"
import PropTypes from "prop-types"
export class SimplePieChart extends React.Component {
  static propTypes = {
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
  }
  updateGraph() {
    const sum = this.props.entries.map(i => i.value).reduce((a, b) => a + b, 0)

    const pieData = d3.pie().value(datum => datum.value)
    d3.select(this.svgContainer)
      .selectAll("g")
      .remove()
    const piePiece = d3
      .arc()
      .outerRadius(140)
      .innerRadius(70)
      .padAngle(3)
      .padRadius(1)
      .cornerRadius(2.5)
    const pieSlices = d3
      .select(this.svgContainer)
      .append("g")
      .attr("transform", "translate(150, 150)")
      .selectAll("whatever")
      .remove()
      .data(pieData(this.props.entries))
      .enter()
      .append("g")
    pieSlices
      .append("path")
      .style("fill", datum => datum.data.color)
      .attr("d", piePiece)
    const labelGroup = pieSlices
      .append("g")
      .attr("transform", datum => `translate(${piePiece.centroid(datum)})`)
    const addLabel = (pos, cb) =>
      labelGroup
        .append("text")
        .attr("text-anchor", "middle")
        .text(cb)
        .style("font-family", d => this.props.font.family)
        .style("font-size", d => this.props.font.size)
        .style(
          "text-shadow",
          d => `1px 1px 2px ${d.data.color}, -1px -1px 2px ${d.data.color}`
        )
        .attr("fill", "#FFF")
        .attr("dy", pos)
    addLabel("-0.7em", d => d.data.label)
    addLabel("0.7em", d => Math.round((d.data.value / sum) * 1000) / 10 + "%")
  }
  componentDidMount() {
    this.updateGraph()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.entries !== this.props.entries && this.svgContainer)
      this.updateGraph()
  }

  render() {
    return (
      <svg
        ref={el => (this.svgContainer = el)}
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          ref={el => (this.pieContainer = el)}
          transform="translate(150, 150)"
        ></g>
      </svg>
    )
  }
}
export default SimplePieChart
