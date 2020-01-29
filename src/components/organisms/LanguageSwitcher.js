import React from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import ListItemText from "@material-ui/core/ListItemText"

const LocaleButton = styled(ListItemText)`
  && {
    cursor: pointer;
  }
`

function LanguageSwitcher(props) {
  const changeLanguage = lng => {
    var path = window.location.pathname

    if (lng === "en" && !path.includes("/en")) {
      path = path.replace("/", "/en/")
      window.location.pathname = path
    } else if (lng === "zh" && path.includes("/en")) {
      path = path.replace("/en", "")
      window.location.pathname = path
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
