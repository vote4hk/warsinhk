/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

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
