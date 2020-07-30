/**
 * Fetch latest AE waiting time
 *
 */
const Parser = require("rss-parser")

exports.fetchGovNews = async () => {
  try {
    const parser = new Parser({
      timeout: 8000,
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
  } catch (e) {
    console.log(`Error in fetching Gov News`)
    console.log(e)
    return { records: [] }
  }
}
