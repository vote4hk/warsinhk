import React from "react"
import find from "lodash.find"
import * as d3 from "d3"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import { feature } from "topojson-client"
import worldJson from "./world-110m"
import mapBaiduCountry, {
  getBaiduCountryFromISO,
} from "@/utils/mapBaiduCountry"

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
  const { i18n } = useTranslation()

  const cities = data.map(d => {
    const country = mapBaiduCountry(d.area)
    return {
      name_zh: country.country_zh,
      name_en: country.country_en,
      emoji: country.country_emoji,
      coordinates: [country.longitude, country.latitude],
      confirmed: d.confirmed,
      died: d.died,
      cured: d.crued,
    }
  })

  const handleCountryClick = countryIndex => {
    setHoverCountry(geographies[countryIndex].id)
  }

  const getDiedNumber = countryName => {
    const country = find(data, { area: countryName })
    return getTransparency(country ? country.died * 10 : 0)
  }

  const getTransparency = num => {
    switch (true) {
      case num <= 10:
        return 0.1
      case num > 10 && num <= 50:
        return 0.3
      case num > 50 && num <= 100:
        return 0.5
      case num > 100 && num <= 500:
        return 0.6
      case num > 500:
        return 0.8
      default:
        return 0
    }
  }

  const getRadius = num => {
    switch (true) {
      case num <= 10:
        return 5
      case num > 10 && num <= 50:
        return 10
      case num > 50 && num <= 100:
        return 15
      case num > 100 && num <= 500:
        return 20
      case num > 500:
        return 30
      default:
        return 0
    }
  }

  const ToolTipTitle = ({ props }) => {
    const isZh = i18n.language === "zh"
    return (
      <>
        <Typography color="inherit" variant="h6">
          {" "}
          {props.emoji} {isZh ? props.name_zh : props.name_en}
        </Typography>
        {`${isZh ? "確診" : "Confirmed"}: ${
          props.confirmed === 0 ? "-" : props.confirmed
        } `}
        {`${isZh ? "死亡" : "Dead"}: ${props.died === 0 ? "-" : props.died} `}
        {`${isZh ? "康復" : "Cured"}: ${
          props.cured === 0 ? "-" : props.cured
        } `}
      </>
    )
  }

  return (
    <svg width="100%" viewBox="0 0 800 450">
      <g>
        {geographies.map((d, i) => (
          <path
            key={`path-${i}`}
            d={d3.geoPath().projection(projection)(d)}
            fill={
              hoveredCountry === d.id
                ? "rgba(38,50,56,0.2)"
                : `rgba(38,50,56, ${getDiedNumber(
                    getBaiduCountryFromISO(Number(d.id))
                  )})`
            }
            stroke="#FFFFFF"
            strokeWidth={0.5}
            onMouseOver={() => handleCountryClick(i)}
            onMouseOut={() => setHoverCountry("")}
          />
        ))}
      </g>
      <g>
        {cities.map((city, i) => (
          <StyledTooltip title={<ToolTipTitle props={city} />}>
            <circle
              key={`marker-${i}`}
              cx={projection(city.coordinates)[0]}
              cy={
                projection(city.coordinates)[1]
                  ? projection(city.coordinates)[1]
                  : 0
              }
              r={getRadius(city.confirmed)}
              fill={`rgba(207, 7, 7, ${getTransparency(city.confirmed)})`}
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
