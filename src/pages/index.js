import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import Fab from "@material-ui/core/Fab"
import Typography from "@material-ui/core/Typography"
import SettingIcon from "@material-ui/icons/Dashboard"
import SEO from "@components/templates/SEO"
import Layout from "@components/templates/Layout"
import { bps } from "@/ui/theme"
import { loadFromLocalStorage, saveToLocalStorage } from "@/utils"
import { SplitWrapper, SessionWrapper } from "@components/atoms/Container"
import FormLabel from "@material-ui/core/FormLabel"
import FormControl from "@material-ui/core/FormControl"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import AlertMessage from "@components/organisms/AlertMessage"
import OutboundAlert from "@components/charts/OutboundAlert"
import { Paragraph } from "@components/atoms/Text"
import Grid from "@material-ui/core/Grid"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

// default modules for user that doesn't configure at beginning. ORDER DOES MATTER!
const DEFAULT_MODULES = [
  "daily_stat",
  "carousel",
  "important_information",
  "outbound_alert",
  "confirmed_chart",
  "passenger_daily",
  "friendly_links",
  "latest_cases",
]

const ModuleContainer = styled.div`
  margin-bottom: 8px;
`

const IndexAlertMessage = styled(AlertMessage)`
  ${bps.up("lg")} {
    > * {
      flex: 1 0 100%;
      margin-right: 0;
    }
  }
`

const IndexContainer = styled.div`
  .fab {
    position: fixed;
    bottom: 80px;
    right: 20px;

    ${bps.up("md")} {
      bottom: 40px;
      right: 40px;
    }
  }

  .settingContainer {
    background-color: white;
    padding: 8px;
  }

  h2 {
    margin-top: 4px;
    margin-bottom: 4px;
  }
`

const ComponentLoading = styled(props => {
  return (
    <div className={props.className}>
      <CircularProgress />
    </div>
  )
})`
  width: 100%;
`

const FriendlyLinksContainer = styled(Box)`
  margin-bottom: 16px;
`
const CarouselContainer = styled.div`
  margin: 16px 0;
`

const CarouselCell = styled.img`
  width: 66%;
  max-width: 220px;
  height: 120px;
  margin-right: 12px;
`

  const [modules, setModules] = React.useState([])
  const [showSettings, setShowSettings] = React.useState(false)

  // TODO: useMemo to cache the components
  const components = {}
  const registerComponent = (
    key,
    titleKey,
    component,
    { rowSpan = 1, showTitle = true } = {}
  ) => {
    components[key] = {
      id: key,
      title: t(titleKey),
      component,
      rowSpan,
      showTitle,
    }
  }

  const renderComponent = (key, data) => {
    if (components[key]) {
      const Component = components[key].component
      return (
        <ModuleContainer>
          {components[key].showTitle && (
            <Typography variant="h2">{components[key].title}</Typography>
          )}
          <Suspense fallback={<ComponentLoading />}>
            <Component data={data} />
          </Suspense>
        </ModuleContainer>
      )
    }
    return <></>
  }

  const registerComponents = () => {
    registerComponent(
      "daily_stat",
      "dashboard.latest_figures",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/DailyStats.js"
        )
      )
    )

    registerComponent(
      "important_information",
      "dashboard.important_information",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/ImportantInformation.js"
        )
      ),
      {
        showTitle: false,
      }
    )

    registerComponent(
      "confirmed_chart",
      "dashboard.case_highlights_area",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/ConfirmedCaseVisual"
        )
      ),
      {
        rowSpan: 4,
      }
    )

    registerComponent(
      "confirmed_digest_gender",
      "dashboard.case_highlights_gender",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/ConfirmedCaseDigestGender"
        )
      ),
      {
        rowSpan: 2,
      }
    )

    registerComponent(
      "passenger_daily",
      "dashboard.daily_passengers",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/PassengerDailyFigure"
        )
      )
    )

export default function IndexPage({ data }) {
  const { i18n, t } = useTranslation()

  const isMobile = useMediaQuery({ maxWidth: 960 })

    registerComponent(
      "outbound_alert",
      "dashboard.outbound_alert",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/OutboundAlert.js"
        )
      ),
      {
        rowSpan: 3,
        showTitle: false,
      }
    )

    registerComponent(
      "carousel",
      "dashboard.carousel",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/Carousel.js"
        )
      ),
      {
        showTitle: false,
      }
    )

    registerComponent(
      "friendly_links",
      "dashboard.friendly_links",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/FriendlyLinks.js"
        )
      ),
      {
        showTitle: false,
      }
    )

    registerComponent(
      "latest_cases",
      "dashboard.latest_cases",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/LatestCases.js"
        )
      ),
      {
        rowSpan: 6,
      }
    )

  const bannerImages = {
    zh: [
      { img: ImageZh1, isExternal: true, url: "https://bit.ly/wars1001" },
      { img: ImageZh2, isExternal: false, url: "https://wars.vote4.hk/world" },
      { img: ImageZh3, isExternal: true, url: "http://bit.ly/3cLtKeL" },
    ],
    en: [
      {
        img: ImageEn1,
        isExternal: false,
        url: "https://wars.vote4.hk/en/world",
      },
      { img: ImageEn2, isExternal: true, url: "http://bit.ly/3cLtKeL" },
    ],
  }

  const bannerImagesArray =
    bannerImages[i18n.language].length < 4
      ? [...bannerImages[i18n.language], ...bannerImages[i18n.language]]
      : bannerImages[i18n.language]

  return (
    <>
      <SEO title="Home" />
      <Layout>
        <SplitWrapper>
          <SessionWrapper>
            <IndexAlertMessage />
            <Typography variant="h2">{t("index.title")}</Typography>
            <Typography variant="body2">
              <Link
                href="https://www.chp.gov.hk/tc/features/102465.html"
                target="_blank"
              >
                {t("dashboard.source_chpgovhk")}
              </Link>
            </Typography>
            <Typography variant="body2" color="textPrimary">
              {`${t("dashboard.last_updated")}${
                latestFiguresOverride.date > latestFigures.date
                  ? latestFiguresOverride.date
                  : latestFigures.date
              }`}
            </Typography>
            <BasicCard>
              <DailyStats
                t={t}
                botdata={data.allBotWarsLatestFigures.edges}
                overridedata={latestFiguresOverride}
              />
            </BasicCard>
            {remarksText && (
              <Typography variant="body2" color="textPrimary">
                {remarksText}
              </Typography>
            )}
            {!isSSR() && (
              <React.Suspense fallback={<div />}>
                <CarouselContainer>
                  <Carousel
                    options={{
                      autoPlay: false,
                      wrapAround: true,
                      adaptiveHeight: false,
                      prevNextButtons: isMobile ? false : true,
                      pageDots: false,
                    }}
                  >
                    {bannerImagesArray.map((b, index) => (
                      <CarouselCell
                        key={index}
                        onClick={() => {
                          trackCustomEvent({
                            category: "carousel_banner",
                            action: "click",
                            label: b.url,
                          })
                          window.open(b.url, b.isExternal ? "_blank" : "_self")
                        }}
                        src={b.img}
                        alt=""
                      />
                    ))}
                  </Carousel>
                </CarouselContainer>
              </React.Suspense>
            )}
            {isMobile && (
              <Typography variant="h2">{t("index.highlight")}</Typography>
            )}
            {isMobile && !isSSR() && (
              <React.Suspense fallback={<div />}>
                <ConfirmedCaseVisual />
              </React.Suspense>
            )}

  const handleModuleChange = id => {
    const index = modules.indexOf(id)
    if (index >= 0) {
      modules.splice(index, 1)
    } else {
      modules.push(id)
    }
    setModules([...modules])
    saveToLocalStorage(LOCAL_STORAGE_KEY_DASHBOARD, [...modules])
    trackCustomEvent({
      category: "dashboard",
      action: "module_change",
      label: modules.join(","),
    })
  }

  // load the settings from localStorage
  const LOCAL_STORAGE_KEY_DASHBOARD = "index-dashboard-module"
  registerComponents()

  React.useEffect(() => {
    const moduleString = loadFromLocalStorage(LOCAL_STORAGE_KEY_DASHBOARD)
    if (moduleString) {
      setModules(moduleString.split(","))
    } else {
      // default modules
      setModules(DEFAULT_MODULES)
    }
    // eslint-disable-line
  }, [])

  // store the information of which module on left/right (only for desktop)
  const columnMap = []
  let left = 0
  let right = 0
  for (let i = 0; i < modules.length; i++) {
    const m = components[modules[i]]
    if (right >= left) {
      left += _get(m, "rowSpan", 1)
      columnMap.push("left")
    } else {
      right += _get(m, "rowSpan", 1)
      columnMap.push("right")
    }
  }

            {!isMobile && (
              <Typography variant="h2">{t("index.highlight")}</Typography>
            )}
            {!isMobile && !isSSR() && (
              <React.Suspense fallback={<div />}>
                <ConfirmedCaseVisual />
              </React.Suspense>
            )}
          </SessionWrapper>
          <SessionWrapper>
            <OutboundAlert data={data.allBorderShutdown.edges} />
            <FriendlyLinksContainer>
              <Grid container spacing={1}>
                {data.allFriendlyLink.edges.map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <FullWidthButton
                      index={index}
                      component={Link}
                      href={item.node.source_url}
                      target="_blank"
                      variant="outlined"
                    >
                      {item.node.title}
                    </FullWidthButton>
                  </Grid>
                ))}
              </Grid>
            </FriendlyLinksContainer>
            <Typography variant="h2">{t("index.latest_case")}</Typography>
            {latestCases.map((item, index) => (
              <WarsCaseCard
                key={index}
                node={item.node}
                showViewMore={true}
                i18n={i18n}
                t={t}
              />
            ))}
            <FullWidthButton
              component={InternalLink}
              to={getLocalizedPath(i18n, "/cases")}
              variant="outlined"
            >
              {t("index.see_more")}
            </FullWidthButton>
          </SessionWrapper>
        </SplitWrapper>
      </Layout>
    </>
  )
}

export const WarsCaseQuery = graphql`
  query($locale: String) {
    allImmdHongKongZhuhaiMacaoBridge(sort: { order: DESC, fields: date }) {
      edges {
        node {
          arrival_hong_kong
          arrival_mainland
          arrival_other
          arrival_total
          date
          departure_hong_kong
          departure_mainland
          departure_other
          departure_total
          location
        }
      }
    }
    allImmdTotal(sort: { order: DESC, fields: date }) {
      edges {
        node {
          arrival_hong_kong
          arrival_mainland
          arrival_other
          arrival_total
          date
          departure_hong_kong
          departure_mainland
          departure_other
          departure_total
          location
        }
      }
    }
    allImmdAirport(sort: { order: DESC, fields: date }) {
      edges {
        node {
          arrival_hong_kong
          arrival_mainland
          arrival_other
          arrival_total
          date
          departure_hong_kong
          departure_mainland
          departure_other
          departure_total
          location
        }
      }
    }
    allImmdShenzhenBay(sort: { order: DESC, fields: date }) {
      edges {
        node {
          arrival_hong_kong
          arrival_mainland
          arrival_other
          arrival_total
          date
          departure_hong_kong
          departure_mainland
          departure_other
          departure_total
          location
        }
      }
    }
    allBotWarsLatestFigures(sort: { order: DESC, fields: date }) {
      edges {
        node {
          date
          time
          confirmed
          ruled_out
          investigating
          reported
          death
          discharged
        }
      }
    }
    allWarsLatestFiguresOverride(sort: { order: DESC, fields: date }) {
      edges {
        node {
          date
          time
          confirmed
          ruled_out
          investigating
          reported
          death
          discharged
          remarks_zh
          remarks_en
        }
      }
    }
    allWarsCase(
      sort: { order: [DESC, DESC], fields: [confirmation_date, case_no] }
      limit: 5
    ) {
      edges {
        node {
          case_no
          onset_date
          confirmation_date
          gender
          age
          hospital_zh
          hospital_en
          status
          type_zh
          type_en
          citizenship_zh
          citizenship_en
          detail_zh
          detail_en
          classification
          classification_zh
          classification_en
          source_url
        }
      }
    }
    allFriendlyLink(
      sort: { fields: sort_order, order: DESC }
      filter: { language: { eq: $locale } }
    ) {
      edges {
        node {
          language
          title
          source_url
          sort_order
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
