/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const fetch = require("node-fetch")
const csv2json = require("csvtojson")

const GOOGLE_SPREADSHEET_ID = "14kreo2vRo1XCUXqFLcMApVtYmvkEzWBDm6b8fzJNKEc"
const SHEET_PHARMACY = "pharmacies"
const SHEET_DODGY_SHOPS = "dodgy_shops"
const SHEET_HIGH_RISK_MASTER = "highrisk_master"
const SHEET_HYGIENE_TIPS_MASTER = "hygiene_tips"

exports.sourceNodes = async props => {
  await Promise.all([
    createNode(props, SHEET_DODGY_SHOPS, "DodgyShop"),
    createNode(props, SHEET_PHARMACY, "Pharmacy"),
    createNode(props, SHEET_HIGH_RISK_MASTER, "HighRisk"),
    createNode(props, SHEET_HYGIENE_TIPS_MASTER, "HygieneTips"),
  ])
}

const createNode = async (
  { actions: { createNode }, createNodeId, createContentDigest },
  sheetName,
  type
) => {
  // All table has first row reserved
  const result = await fetch(
    `https://docs.google.com/spreadsheets/d/${GOOGLE_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}&range=A2:ZZ&headers=0`
  )
  const data = await result.text()
  const records = await csv2json().fromString(data)
  records.forEach((p, i) => {
    // create node for build time data example in the docs
    const meta = {
      // required fields
      id: createNodeId(`${type.toLowerCase()}-${i}`),
      parent: null,
      children: [],
      internal: {
        type,
        contentDigest: createContentDigest(p),
      },
    }
    const node = Object.assign({}, p, meta)
    createNode(node)
  })
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions

  return new Promise(resolve => {
    deletePage(page)

    createPage({
      ...page,
      path: page.path,
      context: {
        ...page.context,
        locale: "zh",
      },
    })

    createPage({
      ...page,
      path: "/en" + page.path,
      context: {
        ...page.context,
        locale: "en",
      },
    })

    resolve()
  })
}
