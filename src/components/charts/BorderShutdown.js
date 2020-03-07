import React from "react"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import outboundIcon from "@components/icons/outbound.png"
import inboundIcon from "@components/icons/inbound.png"
import { getCountryFromISO } from "@/utils/mapBaiduCountry"
import { withStyles } from "@material-ui/core/styles"
import Tooltip from "@material-ui/core/Tooltip"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

const StyledTooltip = withStyles({
  tooltip: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 16,
    borderRadius: 14,
    padding: 10,
  },
})(Tooltip)

const Chip = styled(Paper)`
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

const BorderShutdown = props => {
  const { data } = props
  const { t, i18n } = useTranslation()

  return (
    <Grid container style={{ paddingTop: 25 }}>
      <Grid item xs={12} md={6} style={{ padding: "5px 10px" }}>
        <Paper
          style={{
            background:
              "linear-gradient(225deg, rgba(211,75,111,1) 0%, rgba(167,12,53,1) 100%)",
            height: "100%",
            borderRadius: 12,
          }}
        >
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
            <Grid item xs={12}>
              <Typography
                style={{ color: "white", paddingLeft: 20 }}
                children={t("world.border_shutdown_outbound_full")}
              />
            </Grid>
            <Grid item xs={12} container style={{ padding: "10px 20px" }}>
              {data.map(d => {
                const country = getCountryFromISO(Number(d.node.iso_code))
                const detail =
                  i18n.language === "zh" ? d.node.detail_zh : d.node.detail_en
                const country_name =
                  i18n.language === "zh"
                    ? country.country_zh
                    : country.country_en

                return d.node.status === "全面禁止由香港入境國家" ? (
                  <Grid item key={d.node.detail_zh} style={{ padding: 5 }}>
                    <StyledTooltip title={detail} enterTouchDelay={10}>
                      <Chip>{`${country.country_emoji}${country_name}`}</Chip>
                    </StyledTooltip>
                  </Grid>
                ) : null
              })}
            </Grid>
            <Grid item xs={12}>
              <Typography
                style={{ color: "white", paddingLeft: 20 }}
                children={t("world.border_shutdown_outbound_part")}
              />
            </Grid>
            <Grid item xs={12} container style={{ padding: "10px 20px" }}>
              {data.map(d => {
                const country = getCountryFromISO(Number(d.node.iso_code))
                const detail =
                  i18n.language === "zh" ? d.node.detail_zh : d.node.detail_en
                const country_name =
                  i18n.language === "zh"
                    ? country.country_zh
                    : country.country_en

                return d.node.status === "有限度禁止由香港入境國家" ? (
                  <Grid item key={d.node.detail_zh} style={{ padding: 5 }}>
                    <StyledTooltip title={detail} enterTouchDelay={10}>
                      <Chip>{`${country.country_emoji}${country_name}`}</Chip>
                    </StyledTooltip>
                  </Grid>
                ) : null
              })}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} style={{ padding: "5px 10px" }}>
        <Paper
          style={{
            background:
              "linear-gradient(225deg, rgba(80,80,150,1) 0%, rgba(45,45,113,1) 100%)",
            height: "100%",
            borderRadius: 12,
          }}
        >
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
            <Grid item xs={12}>
              <Typography
                style={{ color: "white", paddingLeft: 20 }}
                children={t("world.border_shutdown_inbound_part")}
              />
            </Grid>
            <Grid item xs={12} container style={{ padding: "10px 20px" }}>
              {data.map(d => {
                const country = getCountryFromISO(Number(d.node.iso_code))
                const detail =
                  i18n.language === "zh" ? d.node.detail_zh : d.node.detail_en
                const country_name =
                  i18n.language === "zh"
                    ? country.country_zh
                    : country.country_en

                return d.node.status === "有限度禁止抵港國家" ? (
                  <Grid item key={d.node.detail_zh} style={{ padding: 5 }}>
                    <StyledTooltip title={detail} enterTouchDelay={10}>
                      <Chip>{`${country.country_emoji}${country_name}`}</Chip>
                    </StyledTooltip>
                  </Grid>
                ) : null
              })}
            </Grid>
            <Grid item xs={12}>
              <Typography
                style={{ color: "white", paddingLeft: 20 }}
                children={t(
                  "world.border_shutdown_inbound_compulsory_quarantine"
                )}
              />
            </Grid>
            <Grid item xs={12} container style={{ padding: "10px 20px" }}>
              {data.map(d => {
                const country = getCountryFromISO(Number(d.node.iso_code))
                const detail =
                  i18n.language === "zh" ? d.node.detail_zh : d.node.detail_en
                const country_name =
                  i18n.language === "zh"
                    ? country.country_zh
                    : country.country_en

                return d.node.status === "抵港需強制檢疫國家" ? (
                  <Grid item key={d.node.detail_zh} style={{ padding: 5 }}>
                    <StyledTooltip title={detail} enterTouchDelay={10}>
                      <Chip>{`${country.country_emoji}${country_name}`}</Chip>
                    </StyledTooltip>
                  </Grid>
                ) : null
              })}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default BorderShutdown
