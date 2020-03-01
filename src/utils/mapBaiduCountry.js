import _ from "lodash"
import countryMappingJSON from "@components/charts/countryMapping"

const mapBaiduCountry = countryName => {
  // our data is not consistent, I put all the black magic here
  const cn = countryName.replace("剋", "克").replace("斯裏蘭卡", "斯里蘭卡")
  // simplified chinese
  const country = _.find(countryMappingJSON, { baidu_country_name: cn })
  // if can't find by simplified chinese, find by traditional chinese
  return country ? country : _.find(countryMappingJSON, { country_zh: cn })
}

export const getBaiduCountryFromISO = iso => {
  const country = _.find(countryMappingJSON, { iso_code: iso })
  return country ? country.baidu_country_name : ""
}

export default mapBaiduCountry
