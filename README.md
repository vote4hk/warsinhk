<div align="center">
<h1>
  COVID-19 in HK｜武漢肺炎民間資訊
</h1>
This is the repository for <a href="https://covid19.vote4.hk">covid19.vote4.hk</a>
<br/>
<br/>
<a href="https://covid19.vote4.hk/">
  <img src="https://github.com/nandiheath/warsinhk/blob/master/static/images/screenshot.jpg?raw=true">
</a>
</div>

## 📍 Data

The data is updated automatically every 5 minutes. The information are all open for use. If you wish to cite anything from this site, please credit us as `covid19.vote4.hk - COVID-19 in HK` or `covid19.vote4.hk - 武漢肺炎民間資訊`.

- [High-risk Areas](https://docs.google.com/spreadsheets/d/e/2PACX-1vT6aoKk3iHmotqb5_iHggKc_3uAA901xVzwsllmNoOpGgRZ8VAA3TSxK6XreKzg_AUQXIkVX5rqb0Mo/pub?gid=0&range=A2:ZZ&output=csv)
- [Confirmed Cases](https://docs.google.com/spreadsheets/d/e/2PACX-1vSr2xYotDgnAq6bqm5Nkjq9voHBKzKNWH2zvTRx5LU0jnpccWykvEF8iB_0g7Tzo2pwzkTuM3ETlr_h/pub?gid=0&range=A2:ZZ&output=csv)

## 🚀 Quick start

### Set up your environment

Navigate to the project directory and run the below command to install all the dependencies of project

```bash
yarn
```

### Start your local development

```bash
gatsby develop
```

Your site is now running at `http://localhost:8000`!

**Note:**

- You'll also see a second link: `http://localhost:8000/___graphql`. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql).
- Gatsby requires Node.js 10.13.0 or higher. If your version is below the required one, try to upgrade it or following the below steps to switch to the desired version using [`nvm`](https://github.com/nvm-sh/nvm):
  Run the following command to use the version from inside the `.nvmrc` file
  ```bash
  nvm use
  ```
  If the specified version is not found, please run the following command to install
  ```bash
  nvm install
  ```

## 🌟 How to contribute

All contributions are welcome.

### For Volunteers:

- Apply through [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSfO8BPKrJVIN21Di2-xOHP_iSAcDv_kxNa6EfanshsSwo6bQw/viewform).
- Submit Github Issues for reporting bugs. (See below `Issues` section for more).

### For Developers:

- See below `Development` section for more.

### Issues

- Please follow our issue template when creating an issue. We only accept `bug report` and `feature request`. Before creating an issue, make sure there is no similar issues.
- If you plan to work on an issue, please leave a comment to inform us and we will assign it to you. We recommend beginners to pick up issues with [good first issue](https://github.com/nandiheath/warsinhk/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) tag.

### Pull Requests

- Please follow our pull request template when creating a pull request. Make sure your pull request fulfils our requirement.
- Please create a new branch (for each PR) based on the latest `dev` or the feature branch and name it either `feat/<meaningful_name>` or `fix/<meaningful_name>`.
- Please follow our naming convention `🌟[feat/fix]: [summary]` (pick your favourite emoji 😉) for pull request title.

### Communication

- We make communication in a Telegram Group. Feel free to join us by clicking [here](https://t.me/joinchat/BwXunhP9xMWBmopAFrvD8A).

## 💻 Development

### Branches

| Purpose     | Branch  | URL                        | Remarks                                                                                       |
| ----------- | ------- | -------------------------- | --------------------------------------------------------------------------------------------- |
| Development | dev     | https://wars-dev.vote4.hk/ | Default development branch. All pull requests will be reviewed and then merged to this branch |
| Production  | master  | https://covid19.vote4.hk/  | Only pull requests created by administrators are allowed                                      |
| Hotfix      | fix/\*  | None                       | Fixes created by the administrators                                                           |
| Feature     | feat/\* | None                       | Features branch before merging to Development branch                                          |

### Checkout the latest code

Please setup `dev` repo `github.com/nandiheath/warsinhk` as `upstream` and `git fetch upstream -p` everytime before making commits. And remember to rebase your branches onto latest `upstream:dev`.

### Internationalization (i18n)

We are using [react-i18next](https://react.i18next.com/) to assert that the internationalized content can be loaded or that it gets rendered when the language changes.

The translation json files for `en` and `zh` are located at `src/locales/en/translation.json` and `src/locales/zh/translation.json` respectively. By default, `zh` is used. If you have changes to the wordings, please make sure they are added or updated in both json files.

**Examples:**

src/locales/en/translation.json

```json
{
  "world.page_title": "Global Cases"
}
```

src/locales/zh/translation.json

```json
{
  "world.page_title": "全球疫情追蹤"
}
```

Use `useTranslation()` for functional components:

```js
// 1. import useTranslation from react-i18next
import { useTranslation } from "react-i18next"
// 2. define t from useTranslation()
const { t } = useTranslation()
// 3. use the t function with the key as the parameter
const title = t("world.page_title")
```

Use `withLanguage()` to translate the target field within an object

```js
// 1. import withLanguage from custom utils
import { withLanguage } from "@/utils/i18n"
// 2. define i18n from useTranslation()
const { i18n } = useTranslation()
// 3. pass i18n, the target object, and the target field name to withLanguage
// if the locale is en, the link would be ``node.address_en``
// if the locale is zh, the link would be ``node.address_zh``
const address = withLanguage(i18n, node, "address")
```

Use `getLocalizedPath(i18n, path)` to get the localized path

```js
// 1. import getLocalizedPath from custom utils
import { getLocalizedPath } from "@/utils/i18n"
// 2. define i18n from useTranslation()
const { i18n } = useTranslation()
// 3. pass i18n and the path to getLocalizedPath
// if the locale is en, the link would be ``/en/world``
// if the locale is zh, the link would be ``/zh/world``
<Link
  href={getLocalizedPath(i18n, "/world")}
>
  ...
</Link>
```

For interpolation, surround the dynamic value by curly brackets in `translation.json`

```json
{
  "world.border_shutdown_last_update": "Last update: {{date}}"
}
```

and pass an object with the key defined in curly brackets and the dynamic value in the second parameter

```js
{
  t("world.border_shutdown_last_update", { date: last_update })
}
```

### Analyse code for potential errors

Run eslint to ensure it fits linting

```bash
yarn lint
yarn lint:fix
```

Try to build to see if there are any errors.

```bash
yarn build
```

## 📄 License

This software is released under [the MIT License](https://github.com/nandiheath/warsinhk/blob/master/LICENSE), while the content on this site is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).

## 💡 Special Thanks

Thanks to <a href="https://www.kintohub.com/"><img src="https://wars.vote4.hk/images/kintohub_icon.svg" style="width:30px; height:15px;">Kintohub</a> for the sponsorship on our server cost.
