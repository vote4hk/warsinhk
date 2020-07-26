# Deploying this REPO

Right now we are using travis-ci with kintohub to do the CI/CD.

## On Kintohub

Setup a cronjob from repo `https://github.com/vote4hk/travis-trigger`

At maximum you can run the cronjob `*/3 * * * *`. This can be further reduce if the travis build time is enhanced. (Now it is ~8 mins to build)

Setup the Env Vars:
- `GITHUB_REPO`: `vote4hk%2Fwarsinhk`
- `GITHUB_REPO_BRANCH`: `master`
- `TRAVIS_API_KEY`: {travis_api_key}

## On Travis

Setup the following Env Vars:

- `GITHUB_TOKEN`: Github Repo Token that has the access to push to `vote4hk/wars.vote4.hk` repo
- `GOOGLE_TRACKING_ID`: Google Analytics tracking ID

