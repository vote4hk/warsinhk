import React, { useRef, useState, useEffect, useLayoutEffect } from "react"
import * as d3 from "d3"

// Reference: https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811

export default props => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const d3Container = useRef(null)

  const drawChart = ({ nodes, links }) => {
    if (dimensions.width === 0) {
      return
    }

    const color = d3.scaleSequential(d3.interpolateReds).domain([0, 10])

    const margin = { top: 0, right: 0, bottom: 0, left: 0 }

    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.width - margin.top - margin.bottom

    const INITIAL_SCALE = width < 500 ? 0.4 : 0.6

    const svg = d3
      .select(d3Container.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("display", "block")
      .style("background", color(0))
      .style("cursor", "pointer")
      .on("click", () => {
        svg
          .transition()
          .duration(750)
          .call(zoom.transform, initialTransform)
      })

    var zoom = d3
      .zoom()
      .scaleExtent([INITIAL_SCALE, 10])
      .translateExtent([
        [-width, -height],
        [width * 4, height * 4],
      ])
      .on("zoom", onZoom)

    const initialTransform = d3.zoomIdentity
      .translate(
        ((1 - INITIAL_SCALE) * width) / 2,
        ((1 - INITIAL_SCALE) * height) / 2
      )
      .scale(INITIAL_SCALE)

    const root = svg.append("g")
    // .attr("transform", `scale(.4) translate(${width / 2}, ${height / 2})`);
    function onZoom() {
      root.attr("transform", d3.event.transform)
    }

    const linkElements = root
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", 1)
      .attr("stroke", "rgba(50, 50, 50, 0.3)")

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id(link => link.id)
          .strength(link => link.strength)
      )
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2))

    simulation.nodes(nodes).on("tick", () => {
      nodeElements.attr("cx", node => node.x).attr("cy", node => node.y)
      textElements.attr("x", node => node.x).attr("y", node => node.y)
      linkElements
        .attr("x1", link => link.source.x)
        .attr("y1", link => link.source.y)
        .attr("x2", link => link.target.x)
        .attr("y2", link => link.target.y)
    })

    const nodeElements = root
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("fill", d => color(d.level))
      .attr("pointer-events", null)
      .on("mouseover", function() {
        d3.select(this).attr("stroke", "#000")
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke", null)
      })
      .on("click", d => {
        // set initial position via zoom
        const transform = d3.zoomIdentity
          .translate(-(d.x - width / 2), -(d.y - height / 2))
          .scale(1.2)
        svg
          .transition()
          .duration(750)
          .call(zoom.transform, transform)
        d3.event.stopPropagation()
      })

    const textElements = root
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(node => node.name)
      .attr("font-size", 14)
      .attr("dominant-baseline", "central")
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")

    simulation.force("link").links(links)
    svg.call(zoom.transform, initialTransform)

    svg.call(zoom)
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
