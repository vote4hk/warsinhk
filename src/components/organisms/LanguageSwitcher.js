import React from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import { navigate } from "gatsby"
import ContextStore from "@/contextStore"
import ListItemText from "@material-ui/core/ListItemText"
import { removePathTrailingSlash } from "@/utils/urlHelper"

const LocaleButton = styled(ListItemText)`
  && {
    cursor: pointer;
  }
`

function LanguageSwitcher(props, context) {
  var {
    route: {
      state: { fullPath },
    },
  } = React.useContext(ContextStore)

  const changeLanguage = lng => {
    if (lng === "en" && !fullPath.includes("/en")) {
      fullPath = removePathTrailingSlash(fullPath.replace("/", "/en/"))
      navigate(fullPath, { replace: true })
    } else if (lng === "zh" && fullPath.includes("/en")) {
      fullPath = removePathTrailingSlash(fullPath.replace("/en", ""))
      navigate(fullPath, { replace: true })
    }
  }

  const { t } = useTranslation()

  return (
    <>
      <LocaleButton onClick={() => changeLanguage("zh")}>
        {t("text.chinese")}
      </LocaleButton>
      <ListItemText> | </ListItemText>
      <LocaleButton onClick={() => changeLanguage("en")}>
        {t("text.english")}
      </LocaleButton>
    </>
  )
}

export default LanguageSwitcher
