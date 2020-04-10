import * as d3 from "d3"

import { makeStyles, withStyles } from "@material-ui/core/styles"

import React from "react"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import { feature } from "topojson-client"
import mapBaiduCountry from "@/utils/mapBaiduCountry"
import { useTranslation } from "react-i18next"
import { withLanguage } from "@/utils/i18n"
import worldJson from "./world-110m"

const projection = d3
  .geoMercator()
  .scale(120)
  .translate([380, 280])

const useStyles = makeStyles(theme => ({
  legendCell: {
    width: "100px",
    height: "10px",
    padding: "0 0 2",
  },
  legendRow: {
    height: "8px",
  },
  legendTable: {
    borderCollapse: "separate",
    borderSpacing: "2px",
  },
  legendText: {
    fontSize: "12px",
  },
}))

const StyledTooltip = withStyles({
  tooltip: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 10,
    borderRadius: 14,
    padding: 10,
  },
})(Tooltip)

const getIntensity = num => {
  switch (true) {
    case num <= 0:
      return 0.05
    case num <= 50:
      return 0.2
    case num <= 200:
      return 0.4
    case num <= 500:
      return 0.6
    case num <= 1000:
      return 0.8
    case num > 1000:
      return 1
    default:
      return 0
  }
}

const getRadius = num => {
  switch (true) {
    case num <= 10:
      return 0
    case num > 10 && num <= 50:
      return 2
    case num > 50 && num <= 100:
      return 4
    case num > 100 && num <= 500:
      return 6
    case num > 500:
      return 12
    default:
      return 0
  }
}

const WorldMap = ({ data }) => {
  const [hoveredCountry, setHoverCountry] = React.useState("")
  const geographies = feature(worldJson, worldJson.objects.countries).features
  const { i18n, t } = useTranslation()
  const svgRef = React.useRef(null)
  const [scale, setScale] = React.useState(1)
  const classes = useStyles()

  const countriesMap = React.useMemo(
    () =>
      new Map(
        data.map(d => {
          const country = mapBaiduCountry(d.area)
          const perMillion =
            country.population > 0
              ? (d.confirmed / country.population) * 1000000
              : 0
          return [
            country.iso_code,
            {
              iso: country.iso_code,
              name: withLanguage(i18n, country, "country"),
              emoji: country.country_emoji,
              coordinates: [country.longitude, country.latitude],
              confirmed: d.confirmed,
              died: d.died,
              cured: d.crued,
              perMillion: perMillion,
            },
          ]
        })
      ),
    [data, i18n]
  )

  const handleCountryClick = countryIndex => {
    setHoverCountry(geographies[countryIndex].id)
  }

  const getIntensityByConfirmedMillion = countryIso => {
    const country = countriesMap.get(countryIso)
    return getIntensity(country ? country.perMillion * 1 : 0)
  }

  const ToolTipTitle = ({ props }) => {
    const formatZero = num => (num === 0 ? "-" : num)
    return (
      <>
        <Typography color="inherit" variant="h6">
          {props.emoji} {props.name}
        </Typography>
        {`${t("world.ranking_confirmed")}: ${formatZero(props.confirmed)} `}
        {`${t("cases.status_deceased")}: ${formatZero(props.died)} `}
        {`${t("cases.status_discharged")}: ${formatZero(props.cured)} `}
      </>
    )
  }

  const zoomed = React.useCallback(() => {
    const t = d3.event.transform
    const selection = d3.select(svgRef.current)
    selection
      .select("g")
      .attr("transform", `translate(${t.x}, ${t.y}) scale(${t.k})`)
    setScale(1 - (t.k - 1) / 4)
  }, [svgRef])

  React.useEffect(() => {
    if (svgRef.current != null) {
      const selection = d3.select(svgRef.current)
      const zoom = d3
        .zoom()
        .scaleExtent([1, 5])
        .on("zoom", zoomed)
      selection.call(zoom)
    }
  }, [svgRef, zoomed])

  return (
    <div style={{ overflow: "hidden" }}>
      <svg width="100%" ref={svgRef} viewBox="0 0 800 450">
        <g>
          {geographies.map((d, i) => (
            <path
              key={`path-${i}`}
              d={d3.geoPath().projection(projection)(d)}
              fill={
                hoveredCountry === d.id
                  ? `rgba(38,50,56,0.1)`
                  : `rgba(38,50,56,${getIntensityByConfirmedMillion(
                      parseInt(d.id)
                    )})`
              }
              stroke={
                hoveredCountry === d.id
                  ? `rgba(38,50,56,1)`
                  : `rgba(255,255,255,1)`
              }
              strokeWidth={0.5}
              onMouseOver={() => handleCountryClick(i)}
              onMouseOut={() => setHoverCountry("")}
            />
          ))}

          {[...countriesMap.values()].map((country, i) => (
            <StyledTooltip
              key={`tooltip-${i}`}
              title={<ToolTipTitle props={country} />}
              enterTouchDelay={10}
              leaveTouchDelay={100}
            >
              <circle
                key={`marker-${i}`}
                cx={projection(country.coordinates)[0]}
                cy={
                  projection(country.coordinates)[1]
                    ? projection(country.coordinates)[1]
                    : 0
                }
                r={getRadius(country.confirmed) * scale + 2}
                fill={`rgba(207, 7, 7, 0.5)`}
                stroke="#FFFFFF"
                strokeWidth={scale + 0.5}
                className="marker"
              />
            </StyledTooltip>
          ))}
        </g>
      </svg>
      <div>
        <table className={classes.legendTable}>
          <tbody>
            <tr className={classes.legendRow}>
              <td
                className={classes.legendCell}
                style={{ backgroundColor: "rgba(38,50,56,0.2)" }}
              />
              <td
                className={classes.legendCell}
                style={{ backgroundColor: "rgba(38,50,56,0.4)" }}
              />
              <td
                className={classes.legendCell}
                style={{ backgroundColor: "rgba(38,50,56,0.6)" }}
              />
              <td
                className={classes.legendCell}
                style={{ backgroundColor: "rgba(38,50,56,0.8)" }}
              />
              <td
                className={classes.legendCell}
                style={{ backgroundColor: "rgba(38,50,56,1)" }}
              />
            </tr>
            <tr>
              <td className={classes.legendText}>1 - 50</td>
              <td className={classes.legendText}>51 - 200</td>
              <td className={classes.legendText}>201 - 500</td>
              <td className={classes.legendText}>501 - 1000 </td>
              <td className={classes.legendText}>1,001 +</td>
            </tr>
          </tbody>
          <caption
            className={classes.legendText}
            style={{ paddingBottom: "5px" }}
          >
            {t("world.per_million_confirmed_case")}
          </caption>
        </table>
      </div>
    </div>
  )
}

export default WorldMap
