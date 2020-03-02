import find from "lodash.find"
import countryMappingJSON from "@components/charts/countryMapping"

const mapBaiduCountry = countryName => {
  // our data is not consistent, I put all the black magic here
  const cn = countryName.replace("剋", "克").replace("斯裏蘭卡", "斯里蘭卡")

  const countryBySimplifiedChinese = find(countryMappingJSON, {
    baidu_country_name: cn,
  }) // find by simplified chinese
  const countryByTraditionalChinese = find(countryMappingJSON, {
    country_zh: cn,
  }) // find by traditional chinese
  const defaultCountry = {
    country_emoji: "",
    baidu_country_name: cn,
    country_en: cn,
    country_zh: cn,
    topo_country_names: cn,
    // this coordinate won't appear on map
    iso_code: 0,
    latitude: -90,
    longitude: 0,
  }

  return (
    countryBySimplifiedChinese || countryByTraditionalChinese || defaultCountry
  )
}

export const getBaiduCountryFromISO = iso => {
  const country = find(countryMappingJSON, { iso_code: iso })
  return country ? country.baidu_country_name : ""
}

export default mapBaiduCountry
