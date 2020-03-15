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
const SHEET_ALERT_MASTER = "alert"
const SHEET_LATEST_FIGURES_OVERIDE_MASTER = "latest_figures_overide"
const LANGUAGES = ["zh", "en"]
const { request } = require("graphql-request")
const { getPath, getWarTipPath } = require("./src/utils/urlHelper")
const isDebug = process.env.DEBUG_MODE === "true"

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
const PUBLISHED_SPREADSHEET_BOT_WARS_LATEST_FIGURES_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiCndDnXu6l5ZKq2aAVgU2xM3WGGW68XF-pEbLAloRbOzA1QwglLGJ6gTKjFbLQGhbH6GR2TsJKrO7/pub?gid=0"
const PUBLISHED_SPREADSHEET_FRIENDLY_LINK_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrwN4gNtogizNkYKGzMXpa7GTNJhE_vkZuYiFraU7f-N7ZKiT-araG-0jb586kczxc9Ua6oht8SVcE/pub?gid=0"
const PUBLISHED_SPREADSHEET_WARS_CASES_LOCATION_599C_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcfO-bjeNxNSJ2AFQdv-a855leMyzgO7Q7QXwgCGGmCAx7PwUxgrfcuJM8BLDCQL-nwnt123OZ4_mT/pub?gid=456240224"
const PUBLISHED_SPREADSHEET_TRAVEL_ALERT_URL =
  "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQOnfZtGysW5qVe9FferSvhSODKa9ASH7SeqCGAGJSz8ZV7POm3kzFqfkbVAgryHKdj9WwLKXJai332/pub?gid=0"

const GRAPHQL_URL = "https://api2.vote4.hk/v1/graphql"

const createIMMDNode = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const type = "Immd"
  const addNodeByGate = async gate => {
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
  }
  addNodeByGate("Airport")
  addNodeByGate("Hong Kong-Zhuhai-Macao Bridge")
  addNodeByGate("Shenzhen Bay")
  addNodeByGate("Total")
}

const createWorldCasesNode = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const type = "BaiduInternationalData"

  const query = `{
    wars_BaiduInternationalData (
      distinct_on: [date, area]
      order_by: [
        {date: desc},
        {area: desc},
        {time: desc},
      ]
    ) {
      area
      date
      time
      confirmed
      died
      crued
    }
  }`

  const baiduChinaQuery = `{
    wars_BaiduChinaData (
      distinct_on: [date, area, city]
        order_by: [
          {date: desc},
          {area: desc},
          {city: desc},
          {time: desc},
        ]
      ) {
        area
        city
        date
        time
        confirmed
        died
        crued
      }
  }`

  const data = await request(GRAPHQL_URL, query)
  const baiduChinaData = await request(GRAPHQL_URL, baiduChinaQuery)

  data.wars_BaiduInternationalData.forEach((p, i) => {
    const meta = {
      id: createNodeId(`${type}-${i}`),
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

  let count = data.wars_BaiduInternationalData.length
  let chinaCured = {}
  let chinaDied = {}
  let chinaConfirmed = {}
  let availableDate = []
  let dateTimeMapping = {}

  baiduChinaData.wars_BaiduChinaData.forEach(p => {
    if (
      p.area === "香港" ||
      p.area === "颱灣" ||
      p.area === "台灣" ||
      p.area === "澳門"
    ) {
      const node_data = {
        area: p.area === "颱灣" ? "台灣" : p.area,
        date: p.date,
        time: p.time,
        confirmed: p.confirmed,
        died: p.died,
        crued: p.crued,
      }
      const meta = {
        id: createNodeId(`${type}-${count}`),
        parent: null,
        children: [],
        internal: {
          type,
          contentDigest: createContentDigest(node_data),
        },
      }
      const node = Object.assign({}, node_data, meta)
      createNode(node)
      count += 1
    } else if (p.city === "") {
      if (availableDate.includes(p.date)) {
        chinaCured[p.date] += p.crued
        chinaDied[p.date] += p.died
        chinaConfirmed[p.date] += p.confirmed
      } else {
        availableDate.push(p.date)
        dateTimeMapping[p.date] = p.time
        chinaCured[p.date] = p.crued
        chinaDied[p.date] = p.died
        chinaConfirmed[p.date] = p.confirmed
      }
    }
  })

  availableDate.forEach(date => {
    const node_data = {
      area: "中国",
      date: date,
      time: dateTimeMapping[date],
      confirmed: chinaConfirmed[date],
      died: chinaDied[date],
      crued: chinaCured[date],
    }
    const meta = {
      id: createNodeId(`${type}-${count}`),
      parent: null,
      children: [],
      internal: {
        type,
        contentDigest: createContentDigest(node_data),
      },
    }
    const node = Object.assign({}, node_data, meta)
    createNode(node)
    count += 1
  })
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
  { skipFirstLine = false, alwaysEnabled = false, subtype = null }
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
    .filter(
      r => alwaysEnabled || (isDebug && r.enabled === "N") || r.enabled === "Y"
    )
    .forEach((p, i) => {
      // create node for build time data example in the docs
      const meta = {
        // required fields
        id: createNodeId(
          `${type.toLowerCase()}${subtype ? `-${subtype}` : ""}-${i}`
        ),
        parent: null,
        children: [],
        internal: {
          type,
          contentDigest: createContentDigest(p),
        },
      }
      const node = Object.assign({}, { ...p, subtype }, meta)
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
      /node_modules\\leaflet/,
      /node_modules\/pixi.js/,
      /node_modules\\pixi.js/,
    ]
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: regex,
            use: loaders.null(),
          },
        ],
      },
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
      {
        skipFirstLine: true,
        subtype: "default",
      }
    ),
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_WARS_CASES_LOCATION_599C_URL,
      "WarsCaseLocation",
      {
        skipFirstLine: true,
        subtype: "599c",
      }
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
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_BOT_WARS_LATEST_FIGURES_URL,
      "BotWarsLatestFigures",
      { skipFirstLine: true, alwaysEnabled: true }
    ),
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_FRIENDLY_LINK_URL,
      "FriendlyLink",
      { skipFirstLine: true }
    ),
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_TRAVEL_ALERT_URL,
      "BorderShutdown",
      { skipFirstLine: true }
    ),
    createNode(props, SHEET_ALERT_MASTER, "Alert"),
    createNode(
      props,
      SHEET_LATEST_FIGURES_OVERIDE_MASTER,
      "WarsLatestFiguresOverride"
    ),
    createAENode(props),
    createIMMDNode(props),
    createGNNode(props),
    createGovNewsNode(props),
    createPosterNode(props),
    createWorldCasesNode(props),
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
