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
import _get from "lodash.get"
import CircularProgress from "@material-ui/core/CircularProgress"
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

const NEW_FEATURES = ["isolation_beds"]

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

export default function IndexPage({ data }) {
  const { t } = useTranslation()

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

    registerComponent(
      "confirmed_digest_age",
      "dashboard.case_highlights_age",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/ConfirmedCaseDigestAge"
        )
      )
    )

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

    registerComponent(
      "epidemic_chart",
      "dashboard.epidemic_chart",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/EpidemicChart.js"
        )
      ),
      {
        rowSpan: 4,
      }
    )

    registerComponent(
      "isolation_beds",
      "dashboard.isolation_beds",
      React.lazy(() =>
        import(
          /* webpackPrefetch: true */ "@/components/molecules/dashboard/ConfirmedLineChart.js"
        )
      ),
      {
        rowSpan: 2,
      }
    )
  }

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
  const LOCAL_STORAGE_KEY_DASHBOARD_NEW_MODULES = "index-dashboard-module-new"
  registerComponents()

  React.useEffect(() => {
    const moduleString = loadFromLocalStorage(LOCAL_STORAGE_KEY_DASHBOARD)
    const loadedNewModules = loadFromLocalStorage(
      LOCAL_STORAGE_KEY_DASHBOARD_NEW_MODULES
    )
    let newModules = []
    if (loadedNewModules) {
      const alreadyLoadedNewModules = loadedNewModules.split(",")
      NEW_FEATURES.forEach(f => {
        if (alreadyLoadedNewModules.indexOf(f) < 0) {
          newModules.push(f)
        }
      })
    } else {
      newModules = NEW_FEATURES
    }

    saveToLocalStorage(LOCAL_STORAGE_KEY_DASHBOARD_NEW_MODULES, NEW_FEATURES)
    if (moduleString) {
      setModules(moduleString.split(",").concat(newModules))
    } else {
      // default modules
      setModules(DEFAULT_MODULES.concat(newModules))
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

  return (
    <>
      <SEO title="Home" />
      <Layout>
        <IndexContainer>
          {showSettings && (
            <ModuleContainer className="settingContainer">
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  {t("dashboard.settings")}
                </FormLabel>
                {Object.values(components).map(component => (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={modules.indexOf(component.id) >= 0}
                          onChange={() => handleModuleChange(component.id)}
                        />
                      }
                      label={component.title}
                    />
                  </FormGroup>
                ))}
              </FormControl>
            </ModuleContainer>
          )}
          <SplitWrapper>
            <SessionWrapper>
              <IndexAlertMessage />
              {modules
                .filter((_, i) => columnMap[i] === "left")
                .map((m, i) => (
                  <React.Fragment key={i}>
                    {renderComponent(m, data)}
                  </React.Fragment>
                ))}
            </SessionWrapper>
            <SessionWrapper>
              {modules
                .filter((_, i) => columnMap[i] === "right")
                .map((m, i) => (
                  <React.Fragment key={i}>
                    {renderComponent(m, data)}
                  </React.Fragment>
                ))}
            </SessionWrapper>
          </SplitWrapper>
          <Fab
            color="primary"
            className="fab"
            onClick={() => {
              if (!showSettings) {
                window.scrollTo(0, 0)
              }
              setShowSettings(!showSettings)
            }}
          >
            <SettingIcon />
          </Fab>
        </IndexContainer>
      </Layout>
    </>
  )
}
