import find from "lodash.find"
import countryMappingJSON from "@components/charts/countryMapping"

const mapBaiduCountry = countryName => {
  // our data is not consistent, I put all the black magic here
  const cn = countryName.replace("剋", "克").replace("斯裏蘭卡", "斯里蘭卡")

  const countryBySimplifiedChinese = find(countryMappingJSON, {
    baidu_country_name: cn,
  }) // find by simplified chinese
  const countryByTraditionalChinese = find(countryMappingJSON, {
    baidu_country_name_translated: cn,
  }) // find by traditional chinese
  const defaultCountry = {
    country_emoji: "",
    baidu_country_name: cn,
    baidu_country_name_translated: cn,
    country_en: cn,
    country_zh: cn,
    topo_country_names: cn,
    iso_code: "",
    latitude: "",
    longitude: "",
  }

  return (
    countryBySimplifiedChinese || countryByTraditionalChinese || defaultCountry
  )
}

export const getCountryFromISO = iso => {
  const country = find(countryMappingJSON, { iso_code: iso })
  return (
    country || {
      country_emoji: "",
      baidu_country_name: "",
      baidu_country_name_translated: "",
      country_en: "",
      country_zh: "",
      topo_country_names: "",
      iso_code: iso,
      latitude: "",
      longitude: "",
    }
  )
}

export default mapBaiduCountry
