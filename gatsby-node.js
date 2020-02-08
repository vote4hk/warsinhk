/**
import publicLoader from './.cache/loader';
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const fetch = require("node-fetch")
const csv2json = require("csvtojson")
const path = require("path")
const ae = require("./ae")
const gn = require("./gn")
const poster = require("./poster-gallery")
const GOOGLE_SPREADSHEET_ID = "14kreo2vRo1XCUXqFLcMApVtYmvkEzWBDm6b8fzJNKEc"
const SHEET_SHOP_MASTER = "shop_master"
const SHEET_ALERT_MASTER = "alert"
const SHEET_DAILY_STATS_MASTER = "daily_stats"
const LANGUAGES = ["zh", "en"]
const { request } = require('graphql-request')
const { getPath, getWarTipPath } = require("./src/utils/urlHelper")

const PUBLISHED_SPREADSHEET_HIGH_RISK_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbmRntCQ1cNkKd5eL3ZVBfgqX_lvQIdJIWxTTQdvSHd_3oIj_6yXOp48qAKdi-Pp-HqXdrrz1gysUr/pub?gid=0"
const PUBLISHED_SPREADSHEET_WARS_CASES_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSr2xYotDgnAq6bqm5Nkjq9voHBKzKNWH2zvTRx5LU0jnpccWykvEF8iB_0g7Tzo2pwzkTuM3ETlr_h/pub?gid=0"
const PUBLISHED_SPREADSHEET_DODGY_SHOPS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_CejomuSCl7198EZ7JgujiAfcxwao-4_X5d3V8VasBKGTvSVtfPrFCl3NGMEwo_a6wZbmKZcqV-sB/pub?gid=1018551822"
const PUBLISHED_SPREADSHEET_WARS_TIPS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6Zri9Rt6egCzKgs2PBdyCpEECI338XZ3UwqJqfEpffW6tnlterGLRne8uS1EKy6tS_Ba4u5OKitmP/pub?gid=0"
const PUBLISHED_SPREADSHEET_DISRUPTION_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0gZ-QBC6JGMS28kYUMz90ZNXFb40CtoLtOIC-QzzlqhPKCIrAojuuN2GX6AXaECONvxJd84tpqzFd/pub?gid=0"
const PUBLISHED_SPREADSHEET_DISRUPTION_DESCRIPTION_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0gZ-QBC6JGMS28kYUMz90ZNXFb40CtoLtOIC-QzzlqhPKCIrAojuuN2GX6AXaECONvxJd84tpqzFd/pub?gid=268131605"
const PUBLISHED_SPREADSHEET_WARS_CASES_LOCATION_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6aoKk3iHmotqb5_iHggKc_3uAA901xVzwsllmNoOpGgRZ8VAA3TSxK6XreKzg_AUQXIkVX5rqb0Mo/pub?gid=0"

const GRAPHQL_URL = "https://api2.vote4.hk/v1/graphql"


const createIMMDNode = async({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const type = "Immd"
  const addNodeByGate = async(gate) => {
    const query = `{
      wars_immd(order_by: {date: desc}, limit: 2, where: {location: {_eq: "${gate}"}}) {
        arrival_hong_kong
        arrival_mainland
        arrival_other
        arrival_total
        date
        departure_hong_kong
        departure_mainland
        departure_other
        departure_total
        location
      }
    }`
    const data = await request(GRAPHQL_URL, query)
    data.wars_immd.forEach((p, i) => {
       const gateKey = gate.replace(/[- ]/g, "")
       const meta = {
         id: createNodeId(`${type}${gateKey}-${i}`),
         parent: null,
         children: [],
         internal: {
           type: `${type}${gateKey}`,
           contentDigest: createContentDigest(p),
         },
       }
       const node = Object.assign({}, p, meta)
       createNode(node)
    })
  };
  addNodeByGate("Airport")
  addNodeByGate("Hong Kong-Zhuhai-Macao Bridge")
  addNodeByGate("Shenzhen Bay")
  addNodeByGate("Total")
} 


const createAENode = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const type = "AEWaitingTime"
  const output = await ae.fetchAEWaitingTime()
  const { records } = output
  records.forEach((p, i) => {
    const meta = {
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

const createGNNode = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const type = "GoogleNews"
  const output = await gn.fetchGoogleNews()
  const { records } = output
  records.forEach((p, i) => {
    const meta = {
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

const createGovNewsNode = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const type = "GovNews"
  const output = await gn.fetchGovNews()
  const { records } = output
  records.forEach((p, i) => {
    const meta = {
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

const createPosterNode = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const type = "PosterGallery"
  const output = await poster.fetchCollactionPosterGallery()
  const { galleries } = output
  galleries.forEach((p, i) => {
    const meta = {
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

const createPublishedGoogleSpreadsheetNode = async (
  { actions: { createNode }, createNodeId, createContentDigest },
  publishedURL,
  type,
  { skipFirstLine = false }
) => {
  // All table has first row reserved
  const result = await fetch(
    `${publishedURL}&single=true&output=csv&headers=0${
      skipFirstLine ? "&range=A2:ZZ" : ""
    }`
  )
  const data = await result.text()
  const records = await csv2json().fromString(data)
  records
    .filter(r => r.enabled === "Y")
    .forEach((p, i) => {
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

/* 
  =============== Gatsby API starts =================
*/

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions
  return new Promise(resolve => {
    deletePage(page)
    LANGUAGES.forEach(lang => {
      createPage({
        ...page,
        path: getPath(lang, page.path),
        context: {
          ...page.context,
          locale: lang,
        },
      })
    })
    resolve()
  })
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    const regex = [
      /node_modules\/leaflet/,
      /node_modules\\leaflet/
    ]
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: regex,
            use: loaders.null()
          }
        ]
      }
    })
  }
}

exports.sourceNodes = async props => {
  await Promise.all([
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_HIGH_RISK_URL,
      "HighRisk",
      { skipFirstLine: true }
    ),
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_WARS_CASES_URL,
      "WarsCase",
      { skipFirstLine: true }
    ),
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_WARS_CASES_LOCATION_URL,
      "WarsCaseLocation",
      { skipFirstLine: true }
    ),
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_DODGY_SHOPS_URL,
      "DodgyShop",
      { skipFirstLine: true }
    ),
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_WARS_TIPS_URL,
      "WarsTip",
      { skipFirstLine: true }
    ),
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_DISRUPTION_URL,
      "Disruption",
      { skipFirstLine: true }
    ),
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_DISRUPTION_DESCRIPTION_URL,
      "DisruptionDescription",
      { skipFirstLine: true }
    ),
    createNode(props, SHEET_SHOP_MASTER, "Shop"),
    createNode(props, SHEET_ALERT_MASTER, "Alert"),
    createNode(props, SHEET_DAILY_STATS_MASTER, "DailyStats"),
    createAENode(props),
    createIMMDNode(props),
    createGNNode(props),
    createGovNewsNode(props),
    createPosterNode(props),
  ])
}

// https://www.gatsbyjs.org/docs/schema-customization/#foreign-key-fields
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = [
    `type WarsCase implements Node {
      locations: [WarsCaseLocation] @link(by: "case_no", from: "case_no") # easy back-ref
    }`,
    `type WarsCaseLocation implements Node {
      case: WarsCase @link(by: "case_no", from: "case_no")
    }`,
  ]
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions }) => {
  actions.createRedirect({
    fromPath: `/en/hygiene-tips/`,
    toPath: `/en/wars-tips/`,
    redirectInBrowser: false,
    isPermanent: true,
  })

  actions.createRedirect({
    fromPath: `/hygiene-tips/`,
    toPath: `/wars-tips/`,
    redirectInBrowser: false,
    isPermanent: true,
  })

  const result = await graphql(`
    query {
      allWarsTip {
        edges {
          node {
            title
            text
            date
            image_url
            source_description
            source_url
            tags
            language
          }
        }
      }
    }
  `)
  result.data.allWarsTip.edges.forEach(({ node }) => {
    // This will not trigger onCreatePage
    LANGUAGES.forEach(lang => {
      const uri = getWarTipPath(lang, node.title)
      if (node.language !== lang) {
        // actions.createRedirect not working here.. dont know why
        // so create a client side redirect here
        actions.createPage({
          path: uri,
          component: path.resolve(`./src/templates/redirect.js`),
          context: {
            uri,
            redirectURL: getPath(lang, "/wars-tips/"),
            locale: lang,
          },
        })
      } else {
        actions.createPage({
          path: uri,
          component: path.resolve(`./src/templates/wars-tip.js`),
          context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            node,
            locale: lang,
            uri,
          },
        })
      }
    })
  })
}
