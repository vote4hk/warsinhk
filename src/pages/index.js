import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { graphql } from "gatsby"
import styled from "styled-components"

import Card from "@material-ui/core/Card"

import SEO from "@components/templates/SEO"
import Layout from "@components/templates/Layout"

import { loadFromLocalStorage } from "@/utils"
import { SplitWrapper } from "@components/atoms/Container"

const ModuleContainer = styled(Card)`
  padding: 8px;
  margin-bottom: 8px;
`

export default function IndexPage({ data }) {
  const { t } = useTranslation()

  const [modules, setModules] = React.useState([])

  const components = {}
  const registerComponent = (key, titleKey, component) => {
    components[key] = {
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
    "",
    React.lazy(() =>
      import(
        /* webpackPrefetch: true */ "@/components/molecules/dashboard/DailyStats.js"
      )
    )
  )

  registerComponent(
    "confirmed_chart",
    "",
    React.lazy(() =>
      import(
        /* webpackPrefetch: true */ "@/components/organisms/ConfirmedCaseVisual"
      )
    )
  )

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

  return (
    <>
      <SEO title="Home" />
      <Layout>
        <SplitWrapper>
          {modules.map((m, i) => (
            <React.Fragment key={i}>{renderComponent(m, data)}</React.Fragment>
          ))}
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
