import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import Fab from "@material-ui/core/Fab"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import SettingIcon from "@material-ui/icons/Settings"
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

const ModuleContainer = styled(Card)`
  padding: 8px;
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
  }

  h2 {
    margin-top: 4px;
    margin-bottom: 4px;
  }
`

export default function IndexPage({ data }) {
  const { t } = useTranslation()

  const [modules, setModules] = React.useState([])
  const [showSettings, setShowSettings] = React.useState(false)

  const components = {}
  const registerComponent = (
    key,
    titleKey,
    component,
    { rowSpan = 1 } = {}
  ) => {
    components[key] = {
      id: key,
      title: t(titleKey),
      component,
      rowSpan,
    }
  }

  const renderComponent = (key, data) => {
    if (components[key]) {
      const Component = components[key].component
      return (
        <ModuleContainer>
          <Typography variant="h2">{components[key].title}</Typography>
          <Suspense fallback={<div>Loading...</div>}>
            <Component data={data} />
          </Suspense>
        </ModuleContainer>
      )
    }
    return <></>
  }

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
    "confirmed_digest_age",
    "dashboard.case_highlights_age",
    React.lazy(() =>
      import(
        /* webpackPrefetch: true */ "@/components/molecules/dashboard/ConfirmedCaseDigestAge"
      )
    )
  )

  const handleModuleChange = id => {
    const index = modules.indexOf(id)
    if (index >= 0) {
      modules.splice(index, 1)
    } else {
      modules.push(id)
    }
    setModules([...modules])
    saveToLocalStorage(LOCAL_STORAGE_KEY_DASHBOARD, [...modules])
  }

  // load the settings from localStorage

  const LOCAL_STORAGE_KEY_DASHBOARD = "index-dashboard-module"

  React.useEffect(() => {
    const moduleString = loadFromLocalStorage(LOCAL_STORAGE_KEY_DASHBOARD)
    if (moduleString) {
      setModules(moduleString.split(","))
    } else {
      setModules(["daily_stat", "confirmed_chart"])
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
      left += m.rowSpan
      columnMap.push("left")
    } else {
      right += m.rowSpan
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
            onClick={() => setShowSettings(!showSettings)}
          >
            <SettingIcon />
          </Fab>
        </IndexContainer>
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
          confirmed
          death
          discharged
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
