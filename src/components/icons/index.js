import React from "react"
import AddShopingCartIcon from "@material-ui/icons/AddShoppingCart"
import WarningRoundedIcon from "@material-ui/icons/WarningRounded"
import TimelapseIcon from "@material-ui/icons/Timelapse"
import InfoRoundedIcon from "@material-ui/icons/InfoRounded"
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

export function mapIcon(name) {
  switch (name) {
    case "add_shopping_cart":
      return <AddShopingCartIcon />
    case "warning":
      return <WarningRoundedIcon />
    case "timelapse":
      return <TimelapseIcon />
    case "info":
      return <InfoRoundedIcon />
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
    case "translate":
      return <TranslateIcon />
    case "web":
      return <WebIcon />
    case "close":
      return <CloseIcon fontSize="inherit" />
    default:
      return null
  }
}
