import React, { useRef, useState, useEffect, useLayoutEffect } from "react"
import * as d3 from "d3"
import { getPath } from "@/utils/urlHelper"
import { useTranslation } from "react-i18next"

export default props => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const { i18n } = useTranslation()

  const d3Container = useRef(null)

  const drawChart = data => {
    if (dimensions.width === 0) {
      return
    }

    const color = d3
      .scaleLinear()
      .domain([0, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl)

    const margin = { top: 50, right: 20, bottom: 60, left: 40 }

    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.width - margin.top - margin.bottom

    const pack = data =>
      d3
        .pack()
        .size([width, height])
        .padding(3)(
        d3
          .hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value)
      )

    const root = pack(data)
    let focus = root
    let view

    const svg = d3
      .select(d3Container.current)
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("background", color(0))
      .style("cursor", "pointer")
      .on("click", () => zoom(root))

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
      .attr("fill", d => (d.children ? color(d.depth) : "white"))
      .attr("pointer-events", d => (!d.children ? "none" : null))
      .on("mouseover", function() {
        d3.select(this).attr("stroke", "#000")
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke", null)
      })
      .on("click", d => {
        if (d.children) {
          if (focus !== d) {
            zoom(d)
            d3.event.stopPropagation()
          }
        } else {
          window.location = getPath(i18n.language, `/cases/${d.data.name}`)
        }
      })

    const label = svg
      .append("g")
      .style("font", "20px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", d => (d.parent === root ? 1 : 0))
      .style("display", d => (d.parent === root ? "inline" : "none"))
      .text(d => d.data.name)

    zoomTo([root.x, root.y, root.r * 2])

    function zoomTo(v) {
      const k = width / v[2]

      view = v

      label.attr(
        "transform",
        d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      )
      node.attr(
        "transform",
        d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      )
      node.attr("r", d => d.r * k)
    }

    function zoom(d) {
      focus = d

      const transition = svg
        .transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2])
          return t => zoomTo(i(t))
        })

      label
        .filter(function(d) {
          return d.parent === focus || this.style.display === "inline"
        })
        .transition(transition)
        .style("fill-opacity", d => (d.parent === focus ? 1 : 0))
        .on("start", function(d) {
          if (d.parent === focus) this.style.display = "inline"
        })
        .on("end", function(d) {
          if (d.parent !== focus) this.style.display = "none"
        })

      // disable the click event when zoom
      node
        .filter(function(d) {
          return d.parent === focus
        })
        .attr("pointer-events", null)

      node
        .filter(function(d) {
          return d.parent !== focus
        })
        .attr("pointer-events", d => (!d.children ? "none" : null))
    }
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
