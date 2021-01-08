import React from "react"
import ErrorIcon from "@material-ui/icons/ErrorOutlineSharp"
import MenuIcon from "@material-ui/icons/Menu"
import EditRoundedIcon from "@material-ui/icons/EditRounded"
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined"
import ContactSupportOutlinedIcon from "@material-ui/icons/ContactSupportOutlined"
import EventNoteIcon from "@material-ui/icons/EventNote"
import TranslateIcon from "@material-ui/icons/Translate"
import CloseIcon from "@material-ui/icons/Close"
import SearchRoundedIcon from "@material-ui/icons/SearchRounded"
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded"
import AttachMoneyRoundedIcon from "@material-ui/icons/AttachMoneyRounded"
import InsertDriveFileRoundedIcon from "@material-ui/icons/InsertDriveFileRounded"
import AeIcon from "./ae.svg"
import CaseIcon from "./case.svg"
import DisruptionIcon from "./disruption.svg"
import WorldIcon from "./world.svg"
import HomeIcon from "./home.svg"
import NewsIcon from "./news.svg"
import RiskIcon from "./risk.svg"
import ShopIcon from "./shop.svg"
import TipsIcon from "./tips.svg"

export function mapIcon(name, style) {
  switch (name) {
    case "shops":
      return <ShopIcon />
    case "high_risk":
      return <RiskIcon />
    case "error":
      return <ErrorIcon />
    case "waiting_time":
      return <AeIcon />
    case "wars_tips":
      return <TipsIcon />
    case "menu":
      return <MenuIcon />
    case "edit":
      return <EditRoundedIcon />
    case "home":
      return <HomeIcon />
    case "thumb_up":
      return <ThumbUpOutlinedIcon />
    case "contact_support":
      return <ContactSupportOutlinedIcon />
    case "event_note":
      return <EventNoteIcon />
    case "disruption":
      return <DisruptionIcon />
    case "translate":
      return <TranslateIcon />
    case "updates":
      return <NewsIcon />
    case "close":
      return <CloseIcon fontSize="inherit" />
    case "search":
      return <SearchRoundedIcon />
    case "cases":
      return <CaseIcon />
    case "sentiment_satisfied":
      return <SentimentSatisfiedRoundedIcon color={style.color} />
    case "attach_money":
      return <AttachMoneyRoundedIcon />
    case "insert_drive_file":
      return <InsertDriveFileRoundedIcon />
    case "world":
      return <WorldIcon />
    default:
      return null
  }
}
