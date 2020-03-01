import React from "react"
import RemoveShoppingCartRoundedIcon from "@material-ui/icons/RemoveShoppingCartRounded"
import PriorityHighRoundedIcon from "@material-ui/icons/PriorityHighRounded"
import ErrorIcon from "@material-ui/icons/ErrorOutlineSharp"
import TimelapseIcon from "@material-ui/icons/Timelapse"
import VerifiedUserIcon from "@material-ui/icons/VerifiedUserRounded"
import MenuIcon from "@material-ui/icons/Menu"
import EditRoundedIcon from "@material-ui/icons/EditRounded"
import HomeRoundedIcon from "@material-ui/icons/HomeRounded"
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined"
import ContactSupportOutlinedIcon from "@material-ui/icons/ContactSupportOutlined"
import EventNoteIcon from "@material-ui/icons/EventNote"
import TranslateIcon from "@material-ui/icons/Translate"
import WebIcon from "@material-ui/icons/Web"
import CollectionsIcon from "@material-ui/icons/Collections"
import CloseIcon from "@material-ui/icons/Close"
import NotInterestedIcon from "@material-ui/icons/NotInterested"
import SearchRoundedIcon from "@material-ui/icons/SearchRounded"
import HotelRoundedIcon from "@material-ui/icons/HotelRounded"
import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded"
import AttachMoneyRoundedIcon from "@material-ui/icons/AttachMoneyRounded"
import InsertDriveFileRoundedIcon from "@material-ui/icons/InsertDriveFileRounded"
import PublicIcon from "@material-ui/icons/Public"

export function mapIcon(name, style) {
  switch (name) {
    case "remove_shopping_cart":
      return <RemoveShoppingCartRoundedIcon />
    case "priority_high":
      return <PriorityHighRoundedIcon />
    case "error":
      return <ErrorIcon />
    case "timelapse":
      return <TimelapseIcon />
    case "verified_user":
      return <VerifiedUserIcon />
    case "menu":
      return <MenuIcon />
    case "edit":
      return <EditRoundedIcon />
    case "home":
      return <HomeRoundedIcon />
    case "thumb_up":
      return <ThumbUpOutlinedIcon />
    case "contact_support":
      return <ContactSupportOutlinedIcon />
    case "event_note":
      return <EventNoteIcon />
    case "collections":
      return <CollectionsIcon />
    case "not_interested":
      return <NotInterestedIcon />
    case "translate":
      return <TranslateIcon />
    case "web":
      return <WebIcon />
    case "close":
      return <CloseIcon fontSize="inherit" />
    case "search":
      return <SearchRoundedIcon />
    case "hotel":
      return <HotelRoundedIcon />
    case "sentiment_satisfied":
      return <SentimentSatisfiedRoundedIcon color={style.color} />
    case "attach_money":
      return <AttachMoneyRoundedIcon />
    case "insert_drive_file":
      return <InsertDriveFileRoundedIcon />
    case "public":
      return <PublicIcon />
    default:
      return null
  }
}
