import _ from "lodash"
import countryMappingJSON from "@components/charts/countryMapping"

const mapBaiduCountry = countryName => {
  return _.find(countryMappingJSON, { baidu_country_name: countryName })
}

export const getBaiduCountryFromISO = iso => {
  const country = _.find(countryMappingJSON, { iso_code: iso })
  return country ? country.baidu_country_name : ""
}

export default mapBaiduCountry
