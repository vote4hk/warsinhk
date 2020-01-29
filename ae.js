/**
 * Fetch latest AE waiting time
 *
 */
const fetch = require("node-fetch")

exports.fetchAEWaitingTime = async () => {
  const aerequest = await fetch(
    "http://www.ha.org.hk/opendata/aed/aedwtdata-tc.json"
  )
  const response = await aerequest.json()
  const records = response.waitTime
  const districtMapping = {
    雅麗氏何妙齡那打素醫院: "大埔",
    明愛醫院: "深水埗",
    廣華醫院: "油尖旺",
    北區醫院: "北區",
    北大嶼山醫院: "離島",
    瑪嘉烈醫院: "葵青",
    博愛醫院: "元朗",
    威爾斯親王醫院: "沙田",
    東區尤德夫人那打素醫院: "東區",
    伊利沙伯醫院: "油尖旺",
    瑪麗醫院: "中西區",
    律敦治醫院: "灣仔",
    長洲醫院: "離島",
    將軍澳醫院: "西貢",
    屯門醫院: "屯門",
    天水圍醫院: "元朗",
    基督教聯合醫院: "觀塘",
    仁濟醫院: "荃灣",
  }
  const recordsWithDistrict = records.map(r =>
    Object.assign({ district_zh: districtMapping[r.hospName] }, r)
  )
  return recordsWithDistrict
}
