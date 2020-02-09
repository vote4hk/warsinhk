import React, { useRef, useState, useEffect, useLayoutEffect } from "react"
import * as d3 from "d3"
import _max from "lodash.max"
import _sum from "lodash.sum"

export default props => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const { keys, keyToLabel } = props

  const d3Container = useRef(null)

  const drawChart = data => {
    if (dimensions.width === 0) {
      return
    }

    const color = d3.scaleOrdinal(d3.schemeAccent).domain(keys)

    const margin = { top: 50, right: 20, bottom: 60, left: 40 }

    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.width - margin.top - margin.bottom

    const max = _max(
      data.map(d =>
        _sum(Object.keys(d).map(k => (keys.indexOf(k) >= 0 ? d[k] : 0)))
      )
    )
    // const maxStack = _maxBy(data, r => r.values.length).values.length

    const svg = d3
      .select(d3Container.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    svg.selectAll("g").remove()
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    const yScale = d3
      .scaleLinear()
      .rangeRound([height, 0])
      .domain([0, max]) // space for showing legend

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map(s => s.label))

    chart.append("g").call(d3.axisLeft(yScale).ticks(max))

    // draw the lines
    chart
      .append("g")
      .style("color", "lightgrey")
      .style("stroke-opacity", "0.7")
      .call(
        d3
          .axisLeft(yScale)
          .tickSizeOuter(0)
          .tickSizeInner(-width)
          .tickFormat("")
          .ticks(Math.min(max, 6))
      )

    // x axis
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "translate(0,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "#69a3b2")

    const stackedData = d3.stack().keys(keys)(data)

    const slice = svg
      .append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", function(d) {
        return color(d.key)
      })
      .attr("transform", d => `translate(${margin.left},${margin.top})`)

    // enter a second time = loop subgroup per subgroup to add all rectangles
    slice
      .selectAll("rect")
      .data(function(d) {
        return d
      })
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.data.label))
      .attr("y", d => yScale(d[1]))
      .attr("height", function(d) {
        return yScale(d[0]) - yScale(d[1])
      })
      .attr("width", xScale.bandwidth())

    // Legend
    const legend = svg
      .selectAll(".legend")
      .data(keys)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(${width - 40}, ${40 + i * 20})`)

    legend
      .append("rect")
      // .attr('x', 20)
      // .attr('y', height + )
      .attr("width", 14)
      .attr("height", 14)
      .style("fill", d => color(d))

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 6)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(keyToLabel)
  }

  useEffect(() => {
    drawChart(props.data)
  })

  useLayoutEffect(() => {
    if (d3Container.current) {
      setDimensions({
        width: d3Container.current.clientWidth,
      })
    }
  }, [])

  return (
    <>
      <svg
        ref={d3Container}
        style={{ height: dimensions.width, width: "100%" }}
      ></svg>
    </>
  )
}
