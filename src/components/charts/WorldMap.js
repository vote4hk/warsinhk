import React from "react"
import * as d3 from "d3"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import { withLanguage } from "@/utils/i18n"
import { feature } from "topojson-client"
import worldJson from "./world-110m"
import mapBaiduCountry from "@/utils/mapBaiduCountry"

const projection = d3
  .geoMercator()
  .scale(120)
  .translate([380, 280])

const StyledTooltip = withStyles({
  tooltip: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 10,
    borderRadius: 14,
    padding: 10,
  },
})(Tooltip)

const WorldMap = ({ data }) => {
  const [hoveredCountry, setHoverCountry] = React.useState("")
  const geographies = feature(worldJson, worldJson.objects.countries).features
  const { i18n, t } = useTranslation()

  const countriesMap = React.useMemo(
    () =>
      new Map(
        data.map(d => {
          const country = mapBaiduCountry(d.area)
          const perMillion =
            country.population > 0
              ? (d.confirmed / country.population) * 1000000
              : -1
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

  const countries = [...countriesMap.values()]

  const handleCountryClick = countryIndex => {
    setHoverCountry(geographies[countryIndex].id)
  }

  const getIntensityByConfirmedMillion = countryIso => {
    const country = countriesMap.get(countryIso)
    return getIntensity(country ? country.perMillion * 1 : 0)
  }

  const getIntensity = num => {
    switch (true) {
      case num <= 0:
        return 0.1
      case num < 50:
        return 0.2
      case num < 200:
        return 0.4
      case num < 500:
        return 0.6
      case num < 1000:
        return 0.8
      case num >= 1000:
        return 1
      default:
        return 0
    }
  }

  const getRadius = num => {
    switch (true) {
      case num <= 10:
        return 1
      case num > 10 && num <= 50:
        return 3
      case num > 50 && num <= 100:
        return 5
      case num > 100 && num <= 500:
        return 7
      case num > 500:
        return 15
      default:
        return 0
    }
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

  return (
    <svg width="100%" viewBox="0 0 800 450">
      {geographies.map((d, i) => (
        <path
          key={`path-${i}`}
          d={d3.geoPath().projection(projection)(d)}
          fill={
            hoveredCountry === d.id
              ? `rgba(38,50,56,0.1)`
              : `rgba(38,50,56,${getIntensityByConfirmedMillion(Number(d.id))})`
          }
          stroke={
            hoveredCountry === d.id ? `rgba(38,50,56,1)` : `rgba(255,255,255,1)`
          }
          strokeWidth={hoveredCountry === d.id ? `1` : `0.5`}
          boxShadow={"0"}
          onMouseOver={() => handleCountryClick(i)}
          onMouseOut={() => setHoverCountry("")}
        />
      ))}
      <g>
        {countries.map((country, i) => (
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
              r={getRadius(country.confirmed)}
              fill={`rgba(207, 7, 7, 0.5)`}
              stroke="#FFFFFF"
              className="marker"
            />
          </StyledTooltip>
        ))}
      </g>
    </svg>
  )
}

export default WorldMap
