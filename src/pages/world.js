import BorderShutdown from "@/components/charts/BorderShutdown"
import Box from "@material-ui/core/Box"
import DecreaseIcon from "@/components/icons/decrease.svg"
import Grid from "@material-ui/core/Grid"
import IncreaseIcon from "@/components/icons/increase.svg"
import Layout from "@components/templates/Layout"
import Link from "@material-ui/core/Link"
import Paper from "@material-ui/core/Paper"
import React from "react"
import SEO from "@/components/templates/SEO"
import Tab from "@material-ui/core/Tab"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Tabs from "@material-ui/core/Tabs"
import Typography from "@material-ui/core/Typography"
import WorldMap from "@/components/charts/WorldMap"
import { formatNumber } from "@/utils"
import { graphql } from "gatsby"
import mapBaiduCountry from "@/utils/mapBaiduCountry"
import { useTranslation } from "react-i18next"
import { withStyles } from "@material-ui/core/styles"

const TabPanel = props => {
  const { children, value, index, ...other } = props
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} style={{ padding: "10px 5px" }}>
          {children}
        </Box>
      )}
    </Typography>
  )
}

const tabProps = index => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  }
}

const StyledTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#505096",
    height: 3,
  },
})(Tabs)

const BoardPaper = withStyles({
  root: {
    padding: "10px 30px",
    margin: 0,
    width: "100%",
    minHeight: 130,
    borderRadius: 12,
    boxShadow: "0 0 0",
  },
})(Paper)

const RankingPaper = withStyles({
  root: {
    padding: 0,
    margin: 0,
    width: "100%",
    height: "100vh",
    borderRadius: 12,
    boxShadow: "0 0 0",
  },
})(Paper)

const getLastUpdatedDate = data =>
  data.allBaiduInternationalData.edges[0].node.date

const getDateBeforeLastUpdatedDate = data => {
  const lastUpdatedDate = getLastUpdatedDate(data)
  return data.allBaiduInternationalData.edges.filter(
    edge => edge.node.date !== lastUpdatedDate
  )[0].node.date
}

const getRanking = (data, date) =>
  Array.from(
    new Set(
      data.allBaiduInternationalData.edges
        .filter(edge => edge.node.date === date)
        .map(edge => ({ ...edge.node }))
    )
  )

const getMostUpdatedRanking = data => {
  const date = getLastUpdatedDate(data)
  return getRanking(data, date)
}

const getTotalConfirmed = data => {
  const date = getLastUpdatedDate(data)
  const updatedData = getRanking(data, date)
  return updatedData.reduce((a, d) => a + d.confirmed, 0)
}

const getPreviousTotalConfirmed = data => {
  const date = getDateBeforeLastUpdatedDate(data)
  const updatedData = getRanking(data, date)
  return updatedData.reduce((a, d) => a + d.confirmed, 0)
}

const getTotalDied = data => {
  const date = getLastUpdatedDate(data)
  const updatedData = getRanking(data, date)
  return updatedData.reduce((a, d) => a + d.died, 0)
}

const getPreviousTotalDied = data => {
  const date = getDateBeforeLastUpdatedDate(data)
  const updatedData = getRanking(data, date)
  return updatedData.reduce((a, d) => a + d.died, 0)
}

const getTotalCured = data => {
  const date = getLastUpdatedDate(data)
  const updatedData = getRanking(data, date)
  return updatedData.reduce((a, d) => a + d.crued, 0)
}

const getPreviousTotalCured = data => {
  const date = getDateBeforeLastUpdatedDate(data)
  const updatedData = getRanking(data, date)
  return updatedData.reduce((a, d) => a + d.crued, 0)
}

const WorldBoard = props => {
  const { data } = props
  const [value, setValue] = React.useState(0)
  const { t } = useTranslation()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const totalConfirmed = getTotalConfirmed(data)
  const totalDied = getTotalDied(data)
  const totalCured = getTotalCured(data)
  const previousTotalConfirmed = getPreviousTotalConfirmed(data)
  const previousTotalDied = getPreviousTotalDied(data)
  const previousTotalCured = getPreviousTotalCured(data)

  const boardMetrics = [
    {
      title: t("world.total_confirmed"),
      figures: totalConfirmed,
      delta: totalConfirmed - previousTotalConfirmed,
    },
    {
      title: t("world.total_died"),
      figures: totalDied,
      delta: totalDied - previousTotalDied,
    },
    {
      title: t("world.total_cured"),
      figures: totalCured,
      delta: totalCured - previousTotalCured,
    },
  ]

  return (
    <Grid container>
      <Grid item xs={12} container spacing={2} component={BoardPaper}>
        {boardMetrics.map(metric => (
          <Grid item xs={12} md={4} key={metric.title}>
            <Typography
              style={{ fontSize: 16, color: "#767676", marginTop: 6 }}
              children={metric.title}
            />
            <Typography
              style={{ fontSize: 32, fontWeight: "bold", marginTop: 5 }}
              children={formatNumber(metric.figures)}
            />
            <Grid container>
              <Grid item>
                {metric.delta < 0 ? <DecreaseIcon /> : <IncreaseIcon />}
              </Grid>
              <Grid item>
                <Typography
                  style={{
                    paddingLeft: 8,
                    paddingRight: 4,
                    fontSize: 16,
                    color: metric.delta < 0 ? "#f55543" : "#1d946d",
                  }}
                  children={formatNumber(metric.delta)}
                />
              </Grid>
              <Grid item>
                <Typography
                  style={{ fontSize: 16, color: "#767676" }}
                  children={`(${t("world.compared_to_previous_day")})`}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12} style={{ marginTop: 30 }}>
        <StyledTabs value={value} onChange={handleChange}>
          <Tab label={t("world.border_shutdown")} {...tabProps(0)} />
          <Tab label={t("world.distribution")} {...tabProps(1)} />
        </StyledTabs>
        <TabPanel value={value} index={0}>
          <BorderShutdown data={data.allBorderShutdown.edges} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <WorldMap data={getMostUpdatedRanking(data)} />
        </TabPanel>
      </Grid>
    </Grid>
  )
}

const WorldRanking = props => {
  const { ranking } = props
  const { i18n, t } = useTranslation()
  const rows = ranking.map(r => ({
    country: r.area,
    confirmedFigures: r.confirmed,
    deathNumber: r.died,
  }))

  return (
    <Grid
      container
      component={RankingPaper}
      style={{ padding: "20px 20px", overflow: "auto" }}
    >
      <Grid item xs={12}>
        <Typography
          style={{ fontSize: 24, fontWeight: "bold" }}
          children={t("world.ranking_title")}
        />
      </Grid>
      <Grid item xs={12} style={{ paddingTop: 20 }}>
        <TableContainer>
          <Table aria-label="ranking table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ fontSize: 15, color: "#767676", padding: 5 }}
                >
                  #
                </TableCell>
                <TableCell
                  style={{ fontSize: 15, color: "#767676", padding: 5 }}
                >
                  {t("world.ranking_country")}
                </TableCell>
                <TableCell
                  style={{
                    fontSize: 15,
                    color: "#767676",
                    padding: 5,
                    textAlign: "right",
                  }}
                >
                  {t("world.ranking_confirmed")}
                </TableCell>
                <TableCell
                  style={{
                    fontSize: 15,
                    color: "#767676",
                    padding: 5,
                    textAlign: "right",
                  }}
                >
                  {t("world.ranking_died")}
                </TableCell>
                <TableCell
                  style={{
                    fontSize: 15,
                    color: "#767676",
                    padding: 5,
                    textAlign: "right",
                    maxWidth: "100px",
                  }}
                >
                  {t("world.per_million_confirmed_case_short")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, ix, _rows) => {
                const country = mapBaiduCountry(row.country) || {
                  country_emoji: "",
                  country_zh: row.country,
                  country_en: row.country,
                }
                const countryName =
                  i18n.language === "zh"
                    ? country.country_zh
                    : country.country_en
                const confirmedFigures = formatNumber(row.confirmedFigures)
                const deathNumber = formatNumber(row.deathNumber)
                const perMillion = country.population
                  ? formatNumber(
                      Math.floor(
                        (row.confirmedFigures / country.population) * 1000000
                      )
                    )
                  : "-"

                return (
                  <TableRow key={row.country}>
                    <TableCell
                      style={{
                        fontSize: 16,
                        borderBottom: 0,
                        padding: "7px 4px",
                      }}
                    >
                      {_rows
                        .map(r => r.confirmedFigures)
                        .sort((x, y) => y - x)
                        .filter((v, i, sorted) => i === sorted.indexOf(v))
                        .indexOf(row.confirmedFigures) + 1}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: 16,
                        borderBottom: 0,
                        padding: "7px 4px",
                      }}
                    >
                      {country.country_emoji} {countryName}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: 16,
                        borderBottom: 0,
                        padding: "7px 4px",
                        textAlign: "right",
                      }}
                    >
                      {confirmedFigures === "0" ? "-" : confirmedFigures}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: 16,
                        borderBottom: 0,
                        padding: "7px 4px",
                        textAlign: "right",
                      }}
                    >
                      {deathNumber === "0" ? "-" : deathNumber}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: 16,
                        borderBottom: 0,
                        padding: "7px 4px",
                        textAlign: "right",
                      }}
                    >
                      {perMillion === "0" ? "-" : perMillion}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

const WorldPage = props => {
  const { data } = props
  const { t } = useTranslation()

  return (
    <Layout>
      <SEO title="WorldPage" />
      <Grid container spacing={2} style={{ padding: "5px 10px" }}>
        <Grid item xs={12}>
          <Typography variant="h2" children={t("world.page_title")} />
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ fontSize: 14, color: "#767676" }}>
            {`${t("world.last_update")} ${getLastUpdatedDate(data)} | `}
            <Link
              href="https://voice.baidu.com/act/newpneumonia/newpneumonia"
              target="_blank"
              rel="noopener noreferrer"
              children={t("world.source_who")}
            />
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12} lg={8} children={<WorldBoard data={data} />} />
          <Grid
            item
            xs={12}
            lg={4}
            children={<WorldRanking ranking={getMostUpdatedRanking(data)} />}
          />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default WorldPage

export const BaiduInternationalDataQuery = graphql`
  query {
    allBaiduInternationalData(
      sort: { order: [DESC, DESC], fields: [date, confirmed] }
    ) {
      edges {
        node {
          date
          time
          area
          confirmed
          died
          crued
        }
      }
    }
    allBorderShutdown(sort: { order: ASC, fields: [category, status_order] }) {
      edges {
        node {
          last_update
          iso_code
          category
          detail_zh
          detail_en
          status_zh
          status_en
          status_order
          source_url_zh
          source_url_en
        }
      }
    }
  }
`
