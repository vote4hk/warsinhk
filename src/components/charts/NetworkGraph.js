import React, { useRef, useState, useEffect, useLayoutEffect } from "react"
import * as d3 from "d3"
import _get from "lodash.get"
// Reference: https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811
// Force-directed graph with groups: https://bl.ocks.org/bumbeishvili/f027f1b6664d048e894d19e54feeed42
// Arrows: https://stackoverflow.com/questions/55612043/d3-force-layout-change-links-into-paths-and-place-arrows-on-node-edge-instead-of
// Data Hull with 2 poitns: https://stackoverflow.com/questions/30655950/d3-js-convex-hull-with-2-data-points/32574853

const FORCE_FACTOR = 10

export default props => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const d3Container = useRef(null)

  const drawChart = ({ nodes, links }) => {
    if (dimensions.width === 0) {
      return
    }

    const color = d3.scaleSequential(d3.interpolateReds).domain([0, 10])
    const groupColor = d3.scaleOrdinal(d3.schemeAccent).domain([-1, 20])

    const groupTexts = nodes.map(n => n.group).filter(g => g)
    const groupIds = d3.set(groupTexts).values()

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
      let nodeCoords = nodeElements
        .filter(d => d.group && d.group === groupId)
        .data()
        .map(d => [d.x, d.y])

      // fake points
      if (nodeCoords && nodeCoords.length === 2) {
        // This doesn't work well as the polygon have no radius..
        // https://stackoverflow.com/questions/30655950/d3-js-convex-hull-with-2-data-points

        // FIXME: use the orthogonal to project the exact 6 points of the two circles?
        // Get 8 points of a circle
        const RADIUS = 30
        const newPoints = []

        for (let i = 0; i < 2; i++) {
          let cx = nodeCoords[i][0]
          let cy = nodeCoords[i][1]

          for (let j = 0; j < 4; j++) {
            const angle = (j * Math.PI) / 2
            const newX = cx + RADIUS * Math.cos(angle)
            const newY = cy + RADIUS * Math.sin(angle)
            newPoints.push([newX, newY])
          }
        }

        nodeCoords = newPoints
      }

      return d3.polygonHull(nodeCoords)
    }

    function updateGroups() {
      groupIds.forEach(function(groupId) {
        let centroid // potential memory leak
        const path = paths
          .filter(d => d === groupId)
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

        d3.select(path.node().parentNode).attr(
          "transform",
          "translate(" +
            centroid[0] +
            "," +
            centroid[1] +
            ") scale(" +
            1.2 +
            ")"
        )
      })
    }

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id(link => link.id)
          .strength(link => link.strength)
          .distance(link => link.distance || 50)
      )
      .force(
        "charge",
        d3.forceManyBody().strength(d => (-d.replusion * width) / FORCE_FACTOR)
      )
      .force("center", d3.forceCenter(width / 2, height / 2))

    // Function for offset the arrow
    // function offsetForArrow(d) {
    //   var t_radius = d.target.size + 4 // size is custom variables
    //   var dx = d.target.x - d.source.x
    //   var dy = d.target.y - d.source.y
    //   var gamma = Math.atan2(dy, dx) // Math.atan2 returns the angle in the correct quadrant as opposed to Math.atan
    //   var tx = d.target.x - Math.cos(gamma) * t_radius
    //   var ty = d.target.y - Math.sin(gamma) * t_radius
    //   return [tx, ty]
    // }

    simulation.nodes(nodes).on("tick", () => {
      nodeElements.attr("cx", node => node.x).attr("cy", node => node.y)
      textElements.attr("x", node => node.x).attr("y", node => node.y)
      linkElements.attr(
        "d",
        d =>
          "M " +
          d.source.x +
          " " +
          d.source.y +
          " L " +
          d.target.x +
          " " +
          d.target.y
      )

      linkLabels.attr("transform", function(d) {
        if (d.target.x < d.source.x) {
          var bbox = this.getBBox()

          const rx = bbox.x + bbox.width / 2
          const ry = bbox.y + bbox.height / 2
          return "rotate(180 " + rx + " " + ry + ")"
        } else {
          return "rotate(0)"
        }
      })

      updateGroups()
    })

    const linkElements = root
      .append("g")
      // .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("path")
      .style("stroke-dasharray", d => (d.type === "dotted" ? ["3, 3"] : [5000]))
      .attr("stroke-width", d => (d.type === "dotted" ? 1 : 2))
      .attr("stroke", d =>
        d.type === "dotted" ? "rgba(50, 50, 50, 0.3)" : "rgba(256, 50, 50, 0.5)"
      )
      .attr("class", "edgepath")
      .attr("id", (d, i) => `edgepath${i}`)

    const linkLabels = root
      .selectAll(".edgelabel")
      .data(links)
      .enter()
      .append("text")
      .attr("pointer-events", "none")
      .attr("class", "edgelabel")
      .attr("id", (d, i) => `edgelabel${i}`)
      .attr("fill", "#aaa")

    // .attrs({
    //   'class': 'edgelabel',
    //   'id': function (d, i) { return 'edgelabel' + i },
    //   'font-size': 10,
    //   'fill': '#aaa'
    // });

    linkLabels
      .append("textPath")
      .attr("xlink:href", (d, i) => "#edgepath" + i)
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")
      .attr("startOffset", d =>
        _get(d, "relationships.length", 0) > 1 ? "20%" : "50%"
      )
      .text(d => _get(d, "relationships[0]", ""))

    linkLabels
      .append("textPath")
      .attr("xlink:href", (d, i) => "#edgepath" + i)
      // .attr("display", d => _get(d, 'relationships.length', 0) <= 1 ? "none" : null)
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")
      .attr("startOffset", "80%")
      .text(d => _get(d, "relationships[1]", ""))

    // Render the groups
    const groups = root.append("g").attr("class", "groups")
    const paths = groups
      .selectAll(".path_placeholder")
      .data(groupIds)
      .enter()
      .append("g")
      .attr("class", "path_placeholder")
      .append("path")
      .attr("stroke", d => groupColor(groupTexts.indexOf(d)))
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 1)
      .attr("fill", d => groupColor(groupTexts.indexOf(d)))
      .attr("fill-opacity", 0.1)
      .attr("opacity", 0)

    paths
      .transition()
      .duration(2000)
      .attr("opacity", 1)

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
