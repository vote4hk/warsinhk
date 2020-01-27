import React from "react"
import SEO from "@/components/templates/SEO"
import App from "@components/App"
import Layout from "@components/templates/Layout"
import Box from "@material-ui/core/Box"
import styled from "styled-components"
import { useTranslation } from 'react-i18next';
import SimpleTabs from "@components/organisms/SimpleTabs"

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import { BasicFab } from '@components/atoms/Fab'
import { BasicList } from '@/components/organisms/BasicList'

const FabContainer = styled(Box)`
 && {
  bottom: 84px;
  right: 16px;
  position: fixed;
  z-index: 1200;
 }
`

const IndexPage = ({ data, pageContext }) => {
  const { i18n } = useTranslation()
  return (
    <App locale={pageContext.locale}>
      <SEO title="Home" />
      <Layout>
        <FabContainer>
          <BasicFab 
          title='報料'
          icon='edit' />
          </FabContainer>
        {/* <SimpleTabs
          tabs={[
            {
              title: "港島",
              content: "Buttons of subdistricts",
            },
            {
              title: "九龍",
              content: "Buttons of subdistricts",
            },
            {
              title: "新界",
              content: "Buttons of subdistricts",
            },
          ]}
        /> */}
        <Typography varient='h2'>炒賣口罩藥房名單（<a target='_blank' href='https://docs.google.com/spreadsheets/d/1x4gHNkS5cfKO8qi-MIp7EiNZP2m5zhK-yv9XSseZqmA/htmlview?fbclid=IwAR3o-FvljkFvrV2b6QGNjQ4_JK7oQletQVq3XTh-hr_o-IhpaTNoJw5_jYQ&sle=true#'>以此資料來源為準</a>）</Typography>
        <BasicList 
          items={data.allDodgyShops.edges}
        />
        </Layout>
    </App>
  )
}

export default IndexPage

export const IndexQuery = graphql`
  query {
    allDodgyShops {
      edges {
        node {
          address_zh
          area
          details
          name_zh
          sub_district_zh
        }
      }
    }
  }
`
