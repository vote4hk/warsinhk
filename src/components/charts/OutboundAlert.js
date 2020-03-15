import React from "react"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Link from "@material-ui/core/Link"
import Typography from "@material-ui/core/Typography"
import outboundIcon from "@components/icons/outbound.png"
import { getCountryFromISO } from "@/utils/mapBaiduCountry"
import { withStyles } from "@material-ui/core/styles"
import Tooltip from "@material-ui/core/Tooltip"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import { withLanguage, getLocalizedPath } from "@/utils/i18n"
import _groupBy from "lodash.groupby"

const StyledTooltip = withStyles({
  tooltip: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 16,
    borderRadius: 14,
    padding: 10,
  },
})(Tooltip)

const Chip = styled("div")`
  color: white;
  width: auto;
  height: auto;
  border-radius: 17pt;
  cursor: pointer;
  box-shadow: none;
  background-color: rgba(255, 255, 255, 0.12);
  padding: 5px 10px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    color: black;
  }
`

const outboundPaperStyle = {
  background:
    "linear-gradient(225deg, rgba(211,75,111,1) 0%, rgba(167,12,53,1) 100%)",
  height: "100%",
  borderRadius: 12,
}

const CountryChip = ({
  t,
  last_update,
  detail,
  country_name,
  country_emoji,
  source_url,
}) => (
  <Grid item style={{ padding: 5 }}>
    <StyledTooltip
      title={
        <>
          {detail}
          {last_update && (
            <>
              <br />
              <br />
              {t("world.border_shutdown_last_update", { date: last_update })}
            </>
          )}
          {source_url && (
            <>
              <br />
              <br />
              <Link href={source_url} target="_blank">
                {t("world.border_shutdown_more_info")}
              </Link>
            </>
          )}
        </>
      }
      enterTouchDelay={10}
      leaveTouchDelay={5000}
      interactive
    >
      <Chip>{`${country_emoji}${country_name}`}</Chip>
    </StyledTooltip>
  </Grid>
)

const OutboundAlert = props => {
  const { data } = props

  const { t, i18n } = useTranslation()

  const countryNodes = data.map(d => {
    const country = getCountryFromISO(Number(d.node.iso_code))
    return {
      last_update: d.node.last_update,
      category: d.node.category,
      country_emoji: country.country_emoji,
      country_name: withLanguage(i18n, country, "country"),
      detail: withLanguage(i18n, d.node, "detail"),
      status: withLanguage(i18n, d.node, "status"),
      status_order: d.node.status_order,
      source_url: withLanguage(i18n, d.node, "source_url"),
    }
  })
  const countryGrouped = _groupBy(countryNodes, "category")

  countryGrouped["outbound"] = _groupBy(countryGrouped["outbound"], "status")

  return (
    <Grid container style={{ marginBottom: "10px" }} spacing={2}>
      <Grid item xs={12}>
        <Paper style={outboundPaperStyle}>
          <Grid container>
            <Grid item xs={12} container style={{ height: 90 }}>
              <Grid item xs={7}>
                <Typography
                  variant="h2"
                  style={{ color: "white", padding: "30px 20px 0" }}
                  children={t("world.border_shutdown_outbound")}
                />
              </Grid>
              <Grid item xs={5}>
                <img
                  src={outboundIcon}
                  style={{ width: "100%", position: "relative", top: -30 }}
                  alt={"outbound border shutdown"}
                />
              </Grid>
            </Grid>
            {Object.values(countryGrouped["outbound"])
              .slice(0, 3)
              .map(group => {
                return (
                  <Grid item xs={12} container key={group[0].status}>
                    <Grid item xs={12}>
                      <Typography
                        style={{ color: "white", paddingLeft: 20 }}
                        children={group[0].status}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      style={{ padding: "10px 20px" }}
                    >
                      {group.slice(0, 3).map(props => {
                        return (
                          <CountryChip
                            t={t}
                            {...props}
                            key={props.country_name}
                          />
                        )
                      })}
                      {group.length > 3 && (
                        <Grid item style={{ padding: 5 }}>
                          <Link
                            href={getLocalizedPath(i18n, "/world")}
                            style={{ textDecoration: "none" }}
                          >
                            <Chip>
                              {t("world.border_shutdown_more_items", {
                                items: group.length - 3,
                              })}
                            </Chip>
                          </Link>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                )
              })}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default OutboundAlert
