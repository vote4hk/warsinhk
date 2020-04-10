import React from "react"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Link from "@material-ui/core/Link"
import Typography from "@material-ui/core/Typography"
import outboundIcon from "@components/icons/outbound.png"
import inboundIcon from "@components/icons/inbound.png"
import { getCountryFromISO } from "@/utils/mapBaiduCountry"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import { withLanguage } from "@/utils/i18n"
import _groupBy from "lodash.groupby"
import { DefaultTooltip } from "@/components/atoms/Tooltip"

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

const inboundPaperStyle = {
  background:
    "linear-gradient(225deg, rgba(80,80,150,1) 0%, rgba(45,45,113,1) 100%)",
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
    <DefaultTooltip
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
    </DefaultTooltip>
  </Grid>
)

const BorderShutdown = props => {
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
  countryGrouped["inbound"] = _groupBy(countryGrouped["inbound"], "status")

  return (
    <Grid container style={{ paddingTop: 25 }} spacing={2}>
      <Grid item xs={12} md={6}>
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
            {Object.values(countryGrouped["outbound"]).map(group => (
              <Grid item xs={12} container key={group[0].status}>
                <Grid item xs={12}>
                  <Typography
                    style={{ color: "white", paddingLeft: 20 }}
                    children={group[0].status}
                  />
                </Grid>
                <Grid item xs={12} container style={{ padding: "10px 20px" }}>
                  {group.map(props => (
                    <CountryChip t={t} {...props} key={props.country_name} />
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper style={inboundPaperStyle}>
          <Grid container>
            <Grid item xs={12} container style={{ height: 90 }}>
              <Grid item xs={7}>
                <Typography
                  variant="h2"
                  style={{ color: "white", padding: "30px 20px 0" }}
                  children={t("world.border_shutdown_inbound")}
                />
              </Grid>
              <Grid item xs={5}>
                <img
                  src={inboundIcon}
                  style={{ width: "100%", position: "relative", top: -30 }}
                  alt={"inbound border shutdown"}
                />
              </Grid>
            </Grid>
            {Object.values(countryGrouped["inbound"]).map(group => (
              <Grid item xs={12} container key={group[0].status}>
                <Grid item xs={12}>
                  <Typography
                    style={{ color: "white", paddingLeft: 20 }}
                    children={group[0].status}
                  />
                </Grid>
                <Grid item xs={12} container style={{ padding: "10px 20px" }}>
                  {group.map(props => (
                    <CountryChip t={t} {...props} key={props.country_name} />
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default BorderShutdown
