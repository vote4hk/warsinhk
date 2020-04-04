import React, { useRef, useState, useEffect, useLayoutEffect } from "react"
import * as d3 from "d3"
import _times from "lodash.times"

const getHeight = width => "75" // hardcode lol, why dynamic

export default props => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const d3Container = useRef(null)

  const drawChart = (data, labels) => {
    if (dimensions.width === 0) {
      return
    }

    const margin = { top: 20, right: 12, bottom: 20, left: 10 }

    const width = dimensions.width - margin.left - margin.right
    const height = getHeight(dimensions.width) - margin.top - margin.bottom

    const max = data.max

    const svg = d3
      .select(d3Container.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height)

    svg.selectAll("g").remove()

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, max])

    const xScale = d3
      .scalePoint()
      .range([0, width])
      .domain(_times(data.xaxis.length))

    // 7. d3's line generator
    const lineFunc = d3
      .line()
      .x((_, i) => xScale(i))
      .y(d => yScale(d))

    const drawLine = (lineData, label, styles) => {
      const validData = lineData.filter(d => d !== null)
      const animTime = 3000

      svg
        .append("path")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .datum(validData)
        .attr("fill", "none")
        .attr("stroke", styles.color)
        .attr("stroke-width", 2)
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

      const index = validData.length - 1
      svg
        .append("g")
        .append("circle")
        .attr("fill", styles.color)
        .attr("class", "dot")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("cx", xScale(index))
        .attr("cy", yScale(validData[index]))
        .attr("r", 4)
        .attr("opacity", 0)
        .transition()
        .delay(animTime - 500)
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
