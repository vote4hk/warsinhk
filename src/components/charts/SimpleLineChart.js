import React, { useRef, useState, useEffect, useLayoutEffect } from "react"
import * as d3 from "d3"
import _max from "lodash.max"
import _times from "lodash.times"

const getHeight = width => Math.max((width * 2) / 3, 300)

export default props => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const d3Container = useRef(null)

  const drawChart = (data, labels) => {
    if (dimensions.width === 0) {
      return
    }

    const margin = { top: 20, right: 10, bottom: 50, left: 35 }

    const width = dimensions.width - margin.left - margin.right
    const height = getHeight(dimensions.width) - margin.top - margin.bottom

    const XAXIS_INTERVAL = width < 500 ? 7 : 3

    const max =
      Math.max(
        _max(
          data.datasets.map(dataset =>
            _max(
              dataset.data.map(d =>
                _max(
                  Object.keys(d)
                    .filter(field => data.fields.indexOf(field) >= 0)
                    .map(key => d[key])
                )
              )
            )
          )
        ),
        _max(data.horizontalLines.map(l => l.value))
      ) * 1.1

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
      .range([height, 0])
      .domain([0, max])

    const xScale = d3
      .scalePoint()
      .range([0, width])
      .domain(_times(data.xaxis.length))

    // y axis
    chart.append("g").call(d3.axisLeft(yScale))

    // x axis
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(xScale)
          // https://github.com/d3/d3-axis/blob/master/README.md#axis_ticks
          .tickValues(
            xScale.domain().filter((_, i) => i % XAXIS_INTERVAL === 0)
          )
          .tickFormat((d, i) => data.xaxis[i])
      )
      .selectAll("text")
      .attr("transform", "translate(0,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "#69a3b2")

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
      )

    // draw horizontal lines
    data.horizontalLines.forEach((hLine, i) => {
      svg
        .append("line")
        .attr("x1", margin.left)
        .attr("y1", margin.top + yScale(hLine.value))
        .attr("x2", margin.left + width)
        .attr("y2", margin.top + yScale(hLine.value))
        .style("stroke", hLine.color)
        .attr("stroke-dasharray", hLine["stroke-dasharray"])

      svg
        .append("text")
        .attr("width", 100)
        .attr("x", margin.left + width)
        .attr("y", margin.top + yScale(hLine.value) - 4)
        .style("text-anchor", "end")
        .attr("fill", hLine.color)
        .text(hLine.legend)
    })

    // 7. d3's line generator
    const lineFunc = d3
      .line()
      .x((_, i) => xScale(i))
      .y(d => yScale(d))

    const drawLine = (lineData, label, styles) => {
      const validData = lineData.filter(d => d !== null)
      const animTime = 1500 + Math.random() * 2000

      svg
        .append("path")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .datum(validData)
        .attr("fill", "none")
        .attr("stroke", styles.color)
        .attr("stroke-width", 1.5)
        .attr("opacity", styles.opactiy || 1.0)
        .attr("stroke-dashoffset", width * 2)
        .attr("stroke-dasharray", [width * 2, width * 2])
        .attr("d", lineFunc)
        .transition()
        .duration(animTime)
        .attr("stroke-dashoffset", 0)
        .transition()
        .duration(0)
        .attr("stroke-dasharray", styles["stroke-dasharray"])

      svg
        .append("g")
        .selectAll(".dot")
        .data(validData)
        .enter()
        .append("circle")
        .attr("fill", styles.color)
        .attr("class", "dot")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(d))
        .attr("r", 2)
        .attr("opacity", 0)
        .transition()
        .delay(animTime - 500)
        .duration(2000)
        .attr("opacity", styles.opactiy || 1.0)
    }

    data.datasets.forEach((dataset, i) =>
      drawLine(
        dataset.data.map(d =>
          Object.keys(d)
            .filter(field => data.fields.indexOf(field) === i)
            .map(key => d[key])
        ),
        null,
        dataset.line
      )
    )

    if (data.showLegend) {
      //Legend
      const legend = svg
        .selectAll(".legend")
        .data(data.datasets)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr(
          "transform",
          (d, i) => `translate(${margin.left + 20}, ${margin.top + i * 24})`
        )

      legend
        .append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .style("fill", function(d, i) {
          return d.line.color
        })

      legend
        .append("text")
        .attr("x", 16)
        .attr("y", 7)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("fill", function(d, i) {
          return d.line.color
        })
        .text(function(d) {
          return d.line.legend
        })
    }

    // Tooltip rendering
    const TOOLTIP_WIDTH = 100
    const tooltip = svg
      .append("g")
      .attr("display", "none")
      .attr("class", "tooltip")

    tooltip
      .append("rect")
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .attr("width", 100)
      .attr("height", 80)
      .attr("x", 0)
      .attr("y", 0)
      .attr("rx", 4)
      .attr("ry", 4)

    tooltip
      .append("text")
      .attr("class", "title")
      .attr("width", 100)
      .attr("height", 35)
      .attr("dy", ".35em")
      .attr("font-size", 14)
      .attr("x", 4)
      .attr("y", 12)
      .text("date")

    tooltip
      .selectAll(".legend")
      .data(data.datasets)
      .enter()
      .append("text")
      .attr("class", "figures")
      .attr("width", 100)
      .attr("height", 35)
      .attr("dy", ".35em")
      .attr("font-size", 12)
      .style("text-anchor", "start")

    const tooltipLine = svg.append("line")
    const tipBox = svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("opacity", 0)
      .on("mousemove", drawTooltip)
      .on("mouseout", removeTooltip)
      .on("mouseclick", drawTooltip)

    function drawTooltip() {
      const band = xScale.step()
      const coord = d3.mouse(tipBox.node())

      coord[0] -= margin.left
      coord[1] -= margin.top
      const xIndex = Math.max(Math.round(coord[0] / band), 0)

      // const date = Math.floor((xScale.invert(d3.mouse(tipBox.node())[0]) + 5) / 10) * 10;

      tooltipLine
        .attr("stroke", "black")
        .attr("stroke-dasharray", "5, 2")
        .attr("x1", margin.left + xScale(xIndex))
        .attr("x2", margin.left + xScale(xIndex))
        .attr("y1", margin.top + 0)
        .attr("y2", margin.top + height)

      let tooltipX = margin.left + xScale(xIndex) + 20
      tooltipX =
        tooltipX > width - TOOLTIP_WIDTH
          ? tooltipX - TOOLTIP_WIDTH - 40
          : tooltipX

      tooltip
        .attr("display", "block")
        .attr(
          "transform",
          `translate(${tooltipX}, ${Math.min(
            height - 100,
            margin.top + coord[1] - 20
          )})`
        )
        .selectAll(".figures")
        .attr("x", 4)
        .attr("y", (d, i) => 35 + i * 16)
        .attr("fill", d => d.line.color)
        .text((d, i) => `${d.line.legend}: ${d.data[xIndex][data.fields[i]]}`)

      tooltip.select(".title").text(data.xaxis[xIndex])
      // .style('color', d => d.line.color)
      // .text(d => d.line.legend);
    }

    function removeTooltip() {
      if (tooltip) tooltip.attr("display", "none")
      if (tooltipLine) tooltipLine.attr("stroke", "none")
    }
  }

  useEffect(() => {
    drawChart(props.data, props.labels)
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
        style={{ height: getHeight(dimensions.width), width: "100%" }}
      ></svg>
    </>
  )
}
