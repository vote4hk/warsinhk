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
  const feed_zh = await parser.parseURL("https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR1J4T1hBU0JYcG9MVWhMS0FBUAE?hl=zh");
  const feed_en = await parser.parseURL("https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR1J4T1hBU0JYcG9MVWhMS0FBUAE?hl=en");

  const records_zh = feed_zh.items
  const records_en = feed_en.items
  const recordsProcessed = records_zh.map((r, ridx) => {
  	const datetime = r.isoDate.split("T")
    return Object.assign({
      title_zh: r.title,
      title_en: records_en[ridx]? records_en[ridx].title : '',
      source_zh: r.source,
      source_en: records_en[ridx]? records_en[ridx].source : '',
      link_zh: r.link,
      link_en: records_en[ridx]? records_en[ridx].link : '',
      date: datetime[0],
      time: datetime[1].slice(0, 8)
    }, r)
  })
  return {records: recordsProcessed}
}

exports.fetchGovNews = async () => {
  let parser = new Parser({
    customFields: {
      item: ['description'],
    }
  })
  const feed_zh = await parser.parseURL("https://www.news.gov.hk/tc/common/html/topstories.rss.xml");
  const feed_en = await parser.parseURL("https://www.news.gov.hk/en/common/html/topstories.rss.xml");

  const records_zh = feed_zh.items
  const records_en = feed_en.items
  const recordsProcessed = records_zh.map((r, ridx) => {
    const date = new Date(r.pubDate)
    return Object.assign({
      title_zh: r.title,
      title_en: records_en[ridx]? records_en[ridx].title : '',
      link_zh: r.link,
      link_en: records_en[ridx]? records_en[ridx].link : '',
      date: date.toISOString().split("T")[0]
    }, r)
  })
  return {records: recordsProcessed}
  
}
