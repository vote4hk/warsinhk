/**
 * Fetch latest AE waiting time
 *
 */
let Parser = require("rss-parser")

exports.fetchGoogleNews = async () => {
  let parser = new Parser({
    customFields: {
      item: ["source"],
    },
  })
  const feed_zh = await parser.parseURL(
    "https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR1J4T1hBU0JYcG9MVWhMS0FBUAE?hl=zh"
  )
  const feed_en = await parser.parseURL(
    "https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR1J4T1hBU0JYcG9MVWhMS0FBUAE?hl=en"
  )

  const records_zh = feed_zh.items
  const records_en = feed_en.items
  const recordsProcessed = {
    gn_en: records_en.map((r, ridx) => {
      const datetime = r.isoDate.split("T")
      return Object.assign(
        {
          date: datetime[0],
          time: datetime[1].slice(0, 8),
        },
        r
      )
    })
    .sort((a, b) => {
      return (a.isoDate < b.isoDate) ? 1 : ((a.isoDate > b.isoDate) ? -1 : 0);
    }),
    gn_zh: records_zh.map((r, ridx) => {
      const datetime = r.isoDate.split("T")
      return Object.assign(
        {
          date: datetime[0],
          time: datetime[1].slice(0, 8),
        },
        r
      )
    })
    .sort((a, b) => {
      return (a.isoDate < b.isoDate) ? 1 : ((a.isoDate > b.isoDate) ? -1 : 0);
    }),
  }
  return { records: [recordsProcessed] }
}

exports.fetchGovNews = async () => {
  let parser = new Parser({
    customFields: {
      item: ["description"],
    },
  })
  const feed_zh = await parser.parseURL(
    "https://www.news.gov.hk/tc/common/html/topstories.rss.xml"
  )
  const feed_en = await parser.parseURL(
    "https://www.news.gov.hk/en/common/html/topstories.rss.xml"
  )

  const records_zh = feed_zh.items
  const records_en = feed_en.items
  function getMonth(monthStr) {
    return new Date(monthStr+'-1-01').getMonth()+1
  }
  const recordsProcessed = records_zh.map((r, ridx) => {
    const d = r.pubDate.split(' ')
    const month = getMonth(d[2])
    const date = [d[3],month < 10? '0'+month : month,d[1]].join('-')
    return Object.assign(
      {
        title_zh: r.title,
        title_en: records_en[ridx] ? records_en[ridx].title : "",
        link_zh: r.link,
        link_en: records_en[ridx] ? records_en[ridx].link : "",
        date: date,
      },
      r
    )
  })
  return { records: recordsProcessed }
}
