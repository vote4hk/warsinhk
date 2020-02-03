import React from "react"
import CopyIcon from "@material-ui/icons/Link"
import styled from "styled-components"
import { Menu, IconButton } from "@material-ui/core"
import MenuItem from "@material-ui/core/MenuItem"
import ShareIcon from "@material-ui/icons/Share"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import { useStaticQuery, graphql } from "gatsby"
import ContextStore from "@/contextStore"
import { isSSR } from "@/utils"

import {
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  TelegramIcon,
  WhatsappIcon,
  TwitterIcon,
} from "react-share"

const StyledCopyIcon = styled(CopyIcon)`
  && {
    width: 32px;
    height: 32px;
  }
`

function getShareUrl(url, platform) {
  return updateUrlParameter(
    updateUrlParameter(url, "utm_source", platform),
    "utm_medium",
    "social_share"
  )
}

// https://gist.github.com/niyazpk/f8ac616f181f6042d1e0
function updateUrlParameter(uri, key, value) {
  // remove the hash part before operating on the uri
  var i = uri.indexOf("#")
  var hash = i === -1 ? "" : uri.substr(i)
  uri = i === -1 ? uri : uri.substr(0, i)

  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i")
  var separator = uri.indexOf("?") !== -1 ? "&" : "?"

  if (!value) {
    // remove key-value pair if value is empty
    uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), "")
    if (uri.slice(-1) === "?") {
      uri = uri.slice(0, -1)
    }
    // replace first occurrence of & by ? if no ? is present
    if (uri.indexOf("?") === -1) uri = uri.replace(/&/, "?")
  } else if (uri.match(re)) {
    uri = uri.replace(re, "$1" + key + "=" + value + "$2")
  } else {
    uri = uri + separator + key + "=" + value
  }
  return uri + hash
}

function ShareButton(props) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteUrl
          }
        }
      }
    `
  )
  const handleShareButtonClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleShareButtonClose = media => {
    setAnchorEl(null)
    if (typeof media === "string") {
      trackCustomEvent({
        category: "general",
        action: "click",
        label: `share_${media}`,
      })
    }
  }
  const {
    route: {
      state: { fullPath },
    },
  } = React.useContext(ContextStore)

  let url = `${site.siteMetadata.siteUrl}${fullPath}`
  if (!isSSR()) {
    url = url + decodeURIComponent(window.location.hash)
  }
  return (
    <>
      <IconButton
        color="inherit"
        aria-label="Share"
        aria-controls="share-menu"
        aria-haspopup="true"
        onClick={handleShareButtonClick}
      >
        <ShareIcon />
      </IconButton>
      <Menu
        id="share-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleShareButtonClose}
      >
        <MenuItem onClick={() => handleShareButtonClose("facebook")}>
          <FacebookShareButton
            url={getShareUrl(url, "facebook")}
            children={<FacebookIcon size={32} round={true} />}
          />
        </MenuItem>
        <MenuItem onClick={() => handleShareButtonClose("telegram")}>
          <TelegramShareButton
            url={getShareUrl(url, "telegram")}
            children={<TelegramIcon size={32} round={true} />}
          />
        </MenuItem>
        <MenuItem onClick={() => handleShareButtonClose("whatsapp")}>
          <WhatsappShareButton
            url={getShareUrl(url, "whatsapp")}
            children={<WhatsappIcon size={32} round={true} />}
          />
        </MenuItem>
        <MenuItem onClick={() => handleShareButtonClose("twitter")}>
          <TwitterShareButton
            url={getShareUrl(url, "twitter")}
            children={<TwitterIcon size={32} round={true} />}
          />
        </MenuItem>
        <MenuItem onClick={() => handleShareButtonClose("link")}>
          <StyledCopyIcon
            onClick={() => {
              navigator.clipboard.writeText(url)
            }}
          />
        </MenuItem>
      </Menu>
    </>
  )
}

export default ShareButton
