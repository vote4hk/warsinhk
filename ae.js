/**
 * Fetch latest AE waiting time
 *
 */
const fetch = require("node-fetch")


exports.fetchAEWaitingTime = async () => {
  const aerequest = await fetch("http://www.ha.org.hk/opendata/aed/aedwtdata-tc.json")
  const response = await aerequest.json();
  const records = response.waitTime;
  const districtMapping = {
    "雅麗氏何妙齡那打素醫院":"大埔區",
    "明愛醫院":"深水埗區",
    "廣華醫院":"油尖旺區",
    "北區醫院":"北區",
    "北大嶼山醫院":"離島區",
    "瑪嘉烈醫院":"葵青區",
    "博愛醫院":"元朗區",
    "威爾斯親王醫院":"沙田區",
    "東區尤德夫人那打素醫院":"東區",
    "伊利沙伯醫院":"油尖旺區",
    "瑪麗醫院":"中西區",
    "律敦治醫院":"灣仔區",
    "長洲醫院":"離島區",
    "將軍澳醫院":"西貢區",
    "屯門醫院":"元朗區",
    "天水圍醫院":"元朗區",
    "基督教聯合醫院":"觀塘區",
    "仁濟醫院":"荃灣區", 
  };
  const recordsWithDistrict = records.map(
    r => Object.assign({districtZH: districtMapping[r.hospName]}, r)
  )
  return recordsWithDistrict;
}
