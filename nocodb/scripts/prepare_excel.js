#!/usr/bin/env node

const csv2json = require("csvtojson")
const xlsx = require("xlsx")
const path = require("path")
const fetch = require("node-fetch")

const PUBLISHED_SPREADSHEET_I18N_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTVp8L95wLd23_2CuA57V-lU6tCRhGAPWSCghGhBuV4xKV_XMVjniCEoDxZnBMXEJ2MPlAi6WzOxlp/pub?gid=0"
const PUBLISHED_SPREADSHEET_WARS_CASES_URLS = [
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSr2xYotDgnAq6bqm5Nkjq9voHBKzKNWH2zvTRx5LU0jnpccWykvEF8iB_0g7Tzo2pwzkTuM3ETlr_h/pub?gid=0",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-Xw-QHYydz_kJCJLBqTKGbb2OF8_gisdUsduPbdR6Dp3tLbWxy_mkfRx2tMmGJ0q64uNsLLv3bbfb/pub?gid=0",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTEJyeLTOgntmUjeRhyEB1w_eFD6BUKAEgkR47pp3yXY_XB3IlF7DstsAA0pHz33h2pzGIxGbvGhjMe/pub?gid=0",
]
const PUBLISHED_SPREADSHEET_DODGY_SHOPS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_CejomuSCl7198EZ7JgujiAfcxwao-4_X5d3V8VasBKGTvSVtfPrFCl3NGMEwo_a6wZbmKZcqV-sB/pub?gid=1018551822"
const PUBLISHED_SPREADSHEET_WARS_TIPS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6Zri9Rt6egCzKgs2PBdyCpEECI338XZ3UwqJqfEpffW6tnlterGLRne8uS1EKy6tS_Ba4u5OKitmP/pub?gid=0"
const PUBLISHED_SPREADSHEET_DISRUPTION_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0gZ-QBC6JGMS28kYUMz90ZNXFb40CtoLtOIC-QzzlqhPKCIrAojuuN2GX6AXaECONvxJd84tpqzFd/pub?gid=0"
const PUBLISHED_SPREADSHEET_DISRUPTION_DESCRIPTION_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0gZ-QBC6JGMS28kYUMz90ZNXFb40CtoLtOIC-QzzlqhPKCIrAojuuN2GX6AXaECONvxJd84tpqzFd/pub?gid=268131605"
const PUBLISHED_SPREADSHEET_WARS_CASES_LOCATION_URLS = [
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6aoKk3iHmotqb5_iHggKc_3uAA901xVzwsllmNoOpGgRZ8VAA3TSxK6XreKzg_AUQXIkVX5rqb0Mo/pub?gid=0",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVRg6iiYOHZwLsXdZE6TVWBO7Cldi07NUnbeVY3nI97_IjyG3jiWnjaUS51HRNJI1fN3io1paMa6jZ/pub?gid=0",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl_YWJy_osrNeOD0ufyQH4CuWTKCX9ng-tUPpIFXsAdk_ry2uciIt752f9a-yd83IGUtsw2rHQNB0s/pub?gid=0",
]
const PUBLISHED_SPREADSHEET_BOT_WARS_LATEST_FIGURES_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiCndDnXu6l5ZKq2aAVgU2xM3WGGW68XF-pEbLAloRbOzA1QwglLGJ6gTKjFbLQGhbH6GR2TsJKrO7/pub?gid=0"
const PUBLISHED_OVERRIDE_MASTER_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQc-XdUlx2VuIqZ71qze1Mg5m11OwA8wL5fYLdlU1VC1PcEqrRrKL6fL5_FbtihOtmeAi7t1puDXOvG/pub?gid=0"
const PUBLISHED_SPREADSHEET_FRIENDLY_LINK_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrwN4gNtogizNkYKGzMXpa7GTNJhE_vkZuYiFraU7f-N7ZKiT-araG-0jb586kczxc9Ua6oht8SVcE/pub?gid=0"
// const PUBLISHED_SPREADSHEET_WARS_CASES_LOCATION_599C_URL =
//   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcfO-bjeNxNSJ2AFQdv-a855leMyzgO7Q7QXwgCGGmCAx7PwUxgrfcuJM8BLDCQL-nwnt123OZ4_mT/pub?gid=456240224"
const PUBLISHED_SPREADSHEET_TRAVEL_ALERT_URL =
  "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQOnfZtGysW5qVe9FferSvhSODKa9ASH7SeqCGAGJSz8ZV7POm3kzFqfkbVAgryHKdj9WwLKXJai332/pub?gid=0"
const PUBLISHED_SPREADSHEET_IMPORTANT_INFORMATION_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vShepjZrGpn8QlN8R3QFrIVhWLg9l0F99wYR9khAnhmoydOP7hkS2_L1imCjH9nHkqVQf3xGrUAi8Na/pub?gid=257173560"
// const PUBLISHED_SPREADSHEET_SITE_CONFIG_URL =
//   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRUN7eL0XjPbkcmxnWKPH9_AOiRiIVcH25nLkOgbfRN7y1gk9tBucufIcLWTFFjjgMJNQmOxIFeU_Sk/pub?gid=0"
const PUBLISHED_SPREADSHEET_WARS_CASES_RELATIONSHIP_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQS7Aay-dZbemZAxbW1oVrC5QKnT9wPjd55hSGGnXGj8_jdZJa9dsKYI--dTv4EU--xt_HGIDZsdNEw/pub?gid=0"
const PUBLISHED_SPREADSHEET_ALERT_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWN6o99FDJN4KsnAyq9KeWKEerF2_v1Z0wWbKiHPI0_Whuf00ZLW2n-GfoXciKgVXkBSoBEz6IhreC/pub?gid=0"
const PUBLISHED_SPREADSHEET_UPDATES_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRY5OHr2hX8Xl_tJR1BgrffhoiVxqjngCu9W262MgyW5ZCXuZFaj1Od0PQJqNeRJ7ocUacI2WnodeTT/pub?gid=257173560"

const prepareJson = async (
  publishedURLs,
  { skipFirstLine = false, idMapper = (row, index) => row.id }
) => {
  let urls = publishedURLs
  if (typeof publishedURLs === "string") {
    urls = [publishedURLs]
  }

  const requests = urls.map(url => {
    return fetch(
      `${url}&single=true&output=csv&headers=0${
        skipFirstLine ? "&range=A2:ZZ" : ""
      }&q=${Math.floor(new Date().getTime(), 1000)}`
    )
      .then(result => result.text())
      .then(data => csv2json().fromString(data))
  })

  // flatten the records from returning value of multiple requests
  let records = (await Promise.all(requests)).flat()

  records = records.map((r, index) => ({
    id: idMapper(r, index),
    ...r,
  }))

  return xlsx.utils.json_to_sheet(records)
}

const DATA_DIR = "output"

const main = async () => {
  const book = xlsx.utils.book_new()

  let sheet = await prepareJson(PUBLISHED_SPREADSHEET_WARS_CASES_URLS, {
    skipFirstLine: true,
    idMapper: row => `${row.case_no}`,
  })
  xlsx.utils.book_append_sheet(book, sheet, "cases")

  sheet = await prepareJson(PUBLISHED_SPREADSHEET_I18N_URL, {
    skipFirstLine: false,
    idMapper: row => `${row.key}`,
  })
  xlsx.utils.book_append_sheet(book, sheet, "i18ns")

  sheet = await prepareJson(PUBLISHED_SPREADSHEET_WARS_CASES_LOCATION_URLS, {
    skipFirstLine: true,
    idMapper: row => `${row.key}`,
  })
  xlsx.utils.book_append_sheet(book, sheet, "case_locations")

  sheet = await prepareJson(PUBLISHED_SPREADSHEET_ALERT_URL, {
    skipFirstLine: true,
    idMapper: (row, index) => `${index}`,
  })
  xlsx.utils.book_append_sheet(book, sheet, "alerts")

  sheet = await prepareJson(PUBLISHED_SPREADSHEET_BOT_WARS_LATEST_FIGURES_URL, {
    skipFirstLine: true,
    idMapper: (row, index) => `${row.date}`,
  })
  xlsx.utils.book_append_sheet(book, sheet, "latest_figures")
  xlsx.writeFile(book, path.join(DATA_DIR, "covid19hk.xlsx"))
}

main()
  .then(() => {})
  .catch(err => {
    console.error(err)
  })
