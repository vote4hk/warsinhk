/**
 * Fetch latest AE waiting time
 *
 */
const fetch = require("node-fetch")

exports.fetchAEWaitingTime = async () => {
  const aerequest = await fetch(
    "https://www.ha.org.hk/aedwt/data/aedWtData.json"
  )
  const response = await aerequest.json()
  const records = response.result.hospData
  const districtMapping = {
    AHN: {
      name_zh: "雅麗氏何妙齡那打素醫院",
      name_en: "Alice Ho Miu Ling Nethersole Hospital",
      district_zh: "大埔",
      district_en: "Tai Po",
      sub_district_zh: "大埔",
      sub_district_en: "Tai Po",
    },
    CMC: {
      name_zh: "明愛醫院",
      name_en: "Caritas Medical Centre",
      district_zh: "深水埗",
      district_en: "Sham Shui Po",
      sub_district_zh: "深水埗",
      sub_district_en: "Sham Shui Po",
    },
    KWH: {
      name_zh: "廣華醫院",
      name_en: "Kwong Wah Hospital",
      district_zh: "油尖旺",
      district_en: "Yau Tsim Mong",
      sub_district_zh: "旺角",
      sub_district_en: "Mong Kok",
    },
    NDH: {
      name_zh: "北區醫院",
      name_en: "North District Hospital",
      district_zh: "北區",
      district_en: "North",
      sub_district_zh: "上水",
      sub_district_en: "Sheung Shui",
    },
    NLT: {
      name_zh: "北大嶼山醫院",
      name_en: "North Lantau Hospital",
      district_zh: "離島",
      district_en: "Islands",
      sub_district_zh: "東涌",
      sub_district_en: "Tung Chung",
    },
    PMH: {
      name_zh: "瑪嘉烈醫院",
      name_en: "Princess Margaret Hospital",
      district_zh: "葵青",
      district_en: "Kwai Tsing",
      sub_district_zh: "葵涌",
      sub_district_en: "Kwai Chung",
    },
    POH: {
      name_zh: "博愛醫院",
      name_en: "Pok Oi Hospital",
      district_zh: "元朗",
      district_en: "Yuen Long",
      sub_district_zh: "元朗",
      sub_district_en: "Yuen Long",
    },
    PWH: {
      name_zh: "威爾斯親王醫院",
      name_en: "Prince of Wales Hospital",
      district_zh: "沙田",
      district_en: "Sha Tin",
      sub_district_zh: "沙田",
      sub_district_en: "Sha Tin",
    },
    PYN: {
      name_zh: "東區尤德夫人那打素醫院",
      name_en: "Pamela Youde Nethersole Eastern Hospital",
      district_zh: "東區",
      district_en: "Eastern",
      sub_district_zh: "柴灣",
      sub_district_en: "Chai Wan",
    },
    QEH: {
      name_zh: "伊利沙伯醫院",
      name_en: "Queen Elizabeth Hospital",
      district_zh: "油尖旺",
      district_en: "Yau Tsim Mong",
      sub_district_zh: "油麻地",
      sub_district_en: "Yau Ma Tei",
    },
    QMH: {
      name_zh: "瑪麗醫院",
      name_en: "Queen Mary Hospital",
      district_zh: "中西區",
      district_en: "Central & Western",
      sub_district_zh: "薄扶林",
      sub_district_en: "Pok Fu Lam",
    },
    RH: {
      name_zh: "律敦治醫院",
      name_en: "Ruttonjee Hospital",
      district_zh: "灣仔",
      district_en: "Wan Chai",
      sub_district_zh: "灣仔",
      sub_district_en: "Wan Chai",
    },
    SJH: {
      name_zh: "長洲醫院",
      name_en: "St John Hospital",
      district_zh: "離島",
      district_en: "Islands",
      sub_district_zh: "長洲",
      sub_district_en: "Cheung Chau",
    },
    TKO: {
      name_zh: "將軍澳醫院",
      name_en: "Tseung Kwan O Hospital",
      district_zh: "西貢",
      district_en: "Sai Kung",
      sub_district_zh: "將軍澳",
      sub_district_en: "Tseung Kwan O",
    },
    TMH: {
      name_zh: "屯門醫院",
      name_en: "Tuen Mun Hospital",
      district_zh: "屯門",
      district_en: "Tuen Mun",
      sub_district_zh: "屯門",
      sub_district_en: "Tuen Mun",
    },
    TSH: {
      name_zh: "天水圍醫院",
      name_en: "Tin Shui Wai Hospital",
      district_zh: "元朗",
      district_en: "Yuen Long",
      sub_district_zh: "天水圍",
      sub_district_en: "Tin Shui Wai",
    },
    UCH: {
      name_zh: "基督教聯合醫院",
      name_en: "United Christian Hospital",
      district_zh: "觀塘",
      district_en: "Kwun Tong",
      sub_district_zh: "觀塘",
      sub_district_en: "Kwun Tong",
    },
    YCH: {
      name_zh: "仁濟醫院",
      name_en: "Yan Chai Hospital",
      district_zh: "荃灣",
      district_en: "Tsuen Wan",
      sub_district_zh: "荃灣",
      sub_district_en: "Tsuen Wan",
    },
  }
  const recordsWithDistrict = records.map(r =>
    Object.assign(
      {
        district_zh: districtMapping[r.hospCode].district_zh,
        district_en: districtMapping[r.hospCode].district_en,
        sub_district_zh: districtMapping[r.hospCode].sub_district_zh,
        sub_district_en: districtMapping[r.hospCode].sub_district_en,
        name_zh: districtMapping[r.hospCode].name_zh,
        name_en: districtMapping[r.hospCode].name_en,
      },
      r
    )
  )
  return { records: recordsWithDistrict }
}
