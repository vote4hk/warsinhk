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

    const groupIds = d3.set(nodes.map(n => n.group)).values()

    const valueline = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveCatmullRomClosed)

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

    // add the arrow
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 0) // here i was placed 0
      .attr("refY", 0)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")

    const zoom = d3
      .zoom()
      .scaleExtent([INITIAL_SCALE, 10])
      .translateExtent([
        [-width, -height],
        [width * 2, height * 2],
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

    // select nodes of the group, retrieve its positions
    // and return the convex hull of the specified points
    // (3 points as minimum, otherwise returns null)
    var polygonGenerator = function(groupId) {
      const nodeCoords = nodeElements
        .filter(d => d.group && d.group === groupId)
        .data()
        .map(d => [d.x, d.y])

      // fake points
      if (nodeCoords && nodeCoords.length <= 2) {
        console.log(nodeCoords)
        for (let i = 0; i < 3 - nodeCoords.length; i++) {
          const lastCoord = nodeCoords[nodeCoords.length - 1]
          nodeCoords.push([lastCoord.x + 0.001, lastCoord.y])
        }
      }
      return d3.polygonHull(nodeCoords)
    }

    function updateGroups() {
      groupIds.forEach(function(groupId) {
        let centroid // potential memory leak
        paths
          .filter(d => d.group && d.group === groupId)
          .attr("transform", "scale(1) translate(0,0)")
          .attr("d", function(d) {
            const polygon = polygonGenerator(d)
            centroid = d3.polygonCentroid(polygon)

            // to scale the shape properly around its points:
            // move the 'g' element to the centroid point, translate
            // all the path around the center of the 'g' and then
            // we can scale the 'g' element properly
            return valueline(
              polygon.map(function(point) {
                return [point[0] - centroid[0], point[1] - centroid[1]]
              })
            )
          })

        // d3.select(path.node().parentNode).attr('transform', 'translate(' + centroid[0] + ',' + (centroid[1]) + ') scale(' + 1.2 + ')');
      })
    }

    const linkElements = root
      .append("g")
      // .attr("class", "links")
      .attr("stroke-width", 1)
      .attr("stroke", "rgba(50, 50, 50, 0.3)")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "edgepath")
      .style("marker-end", "url(#arrow)")

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id(link => link.id)
          .strength(link => link.strength)
      )
      .force("charge", d3.forceManyBody().strength(-width / 5))
      .force("center", d3.forceCenter(width / 2, height / 2))

    function offsetForArrow(d) {
      var t_radius = d.target.size + 4 // size is custom variables
      var dx = d.target.x - d.source.x
      var dy = d.target.y - d.source.y
      var gamma = Math.atan2(dy, dx) // Math.atan2 returns the angle in the correct quadrant as opposed to Math.atan
      var tx = d.target.x - Math.cos(gamma) * t_radius
      var ty = d.target.y - Math.sin(gamma) * t_radius
      return [tx, ty]
    }

    simulation.nodes(nodes).on("tick", () => {
      nodeElements.attr("cx", node => node.x).attr("cy", node => node.y)
      textElements.attr("x", node => node.x).attr("y", node => node.y)
      linkElements
        .attr("x1", link => link.source.x)
        .attr("y1", link => link.source.y)
        .attr("x2", link => offsetForArrow(link)[0])
        .attr("y2", link => offsetForArrow(link)[1])

      updateGroups()
    })

    const nodeElements = root
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", d => d.size)
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
    // Render the groups
    const groups = svg.append("g").attr("class", "groups")
    const paths = groups
      .selectAll(".path_placeholder")
      .data(groupIds)
      .enter()
      .append("g")
      .attr("class", "path_placeholder")
      .append("path")
      .attr("stroke", "1")
      .attr("fill", "red")
      .attr("opacity", 0)

    paths.transition().duration(2000)

    // Add the force
    simulation.force("link").links(links)

    // Add the zooms
    svg.call(zoom.transform, initialTransform)
    svg.call(zoom)

    updateGroups()
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
