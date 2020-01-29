/**
 * Fetch latest AE waiting time
 *
 */
const fetch = require("node-fetch")
let Parser = require("rss-parser")


exports.fetchGoogleNews = async () => {
  let parser = new Parser({
    customFields: {
      item: ['source'],
    }
  })
  const feed = await parser.parseURL("https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR1J4T1hBU0JYcG9MVWhMS0FBUAE?hl=zh");

  const records = feed.items
  const recordsWithDatetime = records.map(r => {
  	const datetime = r.isoDate.split("T")
    return Object.assign({ date: datetime[0], time: datetime[1].slice(0, 8) }, r)
  })
  return {records: recordsWithDatetime}
}

exports.fetchGovNews = async () => {
  let parser = new Parser({
    customFields: {
      item: ['description'],
    }
  })
  const feed = await parser.parseURL("https://www.news.gov.hk/tc/common/html/topstories.rss.xml");

  const records = feed.items
  const recordsWithDatetime = records.map(r => {
    const date = r.pubDate
    return Object.assign({ date: date }, r)
  })
  return {records: recordsWithDatetime}
  
}
