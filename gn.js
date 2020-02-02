/**
 * Fetch latest AE waiting time
 *
 */
const Parser = require("rss-parser")

const googleNewsParser = new Parser({
  customFields: {
    item: ["source"],
  },
})

async function fetchGoogleNewsByLanguage(language) {
  const { items: records } = await googleNewsParser.parseURL(
    `https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR1J4T1hBU0JYcG9MVWhMS0FBUAE?hl=${language}`
  )
  return {
    language,
    records: records
      .map(record => {
        const datetime = record.isoDate.split("T")
        return {
          date: datetime[0],
          time: datetime[1].slice(0, 8),
          ...record,
        }
      })
      .sort((a, b) =>
        a.isoDate < b.isoDate ? 1 : a.isoDate > b.isoDate ? -1 : 0
      ),
  }
}

exports.fetchGoogleNews = async () => {
  const languages = ["zh", "en"]
  const records = await Promise.all(
    languages.map(language => fetchGoogleNewsByLanguage(language))
  )
  const recordsProcessed = records.reduce((obj, { language, records }) => {
    obj[`gn_${language}`] = records
    return obj
  }, {})
  return { records: [recordsProcessed] }
}

exports.fetchGovNews = async () => {
  const parser = new Parser({
    customFields: {
      item: ["description"],
    },
  })

  const [{ items: records_zh }, { items: records_en }] = await Promise.all([
    parser.parseURL(
      "https://www.news.gov.hk/tc/common/html/topstories.rss.xml"
    ),
    parser.parseURL(
      "https://www.news.gov.hk/en/common/html/topstories.rss.xml"
    ),
  ])

  function getMonth(monthStr) {
    return new Date(monthStr + "-1-01").getMonth() + 1
  }
  const recordsProcessed = records_zh.map((r, ridx) => {
    const d = r.pubDate.split(" ")
    const month = getMonth(d[2])
    const date = [d[3], month < 10 ? "0" + month : month, d[1]].join("-")
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
