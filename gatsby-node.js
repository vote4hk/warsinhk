/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const fetch = require('node-fetch')
const csv2json = require('csvtojson');

exports.sourceNodes = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  // TODO: extract this to seperate function
  // get data from GitHub API at build time
  const result = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQ34PdImq5-aULcYEp5ptzqgCTkEdMwqpAElDO7WQPDjbmgFGAp7J6-KffHZXd7dGagF5NeBiY3ywTJ/pub?gid=1228399663&single=true&output=csv`)

  const data = await result.text()
  // remove the first line
  const dodgy_shops = await csv2json().fromString(data.replace(/.*\r\n/, ''));

  dodgy_shops.forEach((p, i) => {
    // create node for build time data example in the docs
    const meta = {
      // required fields
      id: createNodeId(`dodgy_shops-${i}`),
      parent: null,
      children: [],
      internal: {
        type: `dodgy_shops`,
        contentDigest: createContentDigest(p),
      },
    }
    const node = Object.assign({}, p, meta)
    createNode(node)
  })
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  return new Promise((resolve) => {
    deletePage(page);

    createPage({
      ...page,
      path: page.path,
      context: {
        ...page.context,
        locale: 'zh',
      },
    });

    createPage({
      ...page,
      path: '/en' + page.path,
      context: {
        ...page.context,
        locale: 'en',
      },
    });

    resolve();
  });
};
