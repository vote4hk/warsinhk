import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { graphql } from "gatsby"
import styled from "styled-components"
import Fab from "@material-ui/core/Fab"
import Card from "@material-ui/core/Card"
import SettingIcon from "@material-ui/icons/Settings"
import SEO from "@components/templates/SEO"
import Layout from "@components/templates/Layout"
import { bps } from "@/ui/theme"
import { loadFromLocalStorage } from "@/utils"
import { SplitWrapper } from "@components/atoms/Container"
import FormLabel from "@material-ui/core/FormLabel"
import FormControl from "@material-ui/core/FormControl"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"

const ModuleContainer = styled(Card)`
  padding: 8px;
  margin-bottom: 8px;
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
    height: 200px;
    background-color: white;
  }
`

export default function IndexPage({ data }) {
  const { t } = useTranslation()

  const [modules, setModules] = React.useState([])
  const [showSettings, setShowSettings] = React.useState(false)

  const components = {}
  const registerComponent = (key, titleKey, component) => {
    components[key] = {
      id: key,
      title: t(titleKey),
      component,
    }
  }

  const renderComponent = (key, data) => {
    if (components[key]) {
      const Component = components[key].component
      return (
        <ModuleContainer>
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
        /* webpackPrefetch: true */ "@/components/organisms/ConfirmedCaseVisual"
      )
    )
  )

  const handleModuleChange = id => {
    const index = modules.indexOf(id)
    console.log(index)
    if (index >= 0) {
      modules.splice(index, 1)
    } else {
      modules.push(id)
    }
    setModules([...modules])
  }

  // load the settings from localStorage

  const LOCAL_STORAGE_KEY_DASHBOARD = "index-dashboard-module"

  React.useEffect(() => {
    const moduleString = loadFromLocalStorage(LOCAL_STORAGE_KEY_DASHBOARD)
    if (moduleString) {
      // setModules(moduleString.split(","))
      setModules(["daily_stat"])
    }
    setModules(["daily_stat", "confirmed_chart"])
    // eslint-disable-line
  }, [])

  console.log(modules)
  return (
    <>
      <SEO title="Home" />
      <Layout>
        <IndexContainer>
          {showSettings && (
            <ModuleContainer className="settingContainer">
              <FormControl component="fieldset">
                <FormLabel component="legend">Assign responsibility</FormLabel>

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
            {modules.map((m, i) => (
              <React.Fragment key={i}>
                {renderComponent(m, data)}
              </React.Fragment>
            ))}
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
