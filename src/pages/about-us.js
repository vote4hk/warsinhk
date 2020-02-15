import React from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { Typography, Link } from "@material-ui/core"
import { graphql } from "gatsby"
import styled from "styled-components"
import * as md5 from "md5"
import { PageContent } from "../components/atoms/Container"
import Grid from "@material-ui/core/Grid"
import { bps } from "@/ui/theme"

const Image = styled.img`
  ${bps.down("sm")} {
    width: 64px;
    height: 64px;
    padding: 5px;
  }
  width: 100px;
  height: 100px;
  border-radius: 50px;
  padding: 10px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
`

const Contributor = ({ githubId }) => {
  const url = `https://avatars.githubusercontent.com/${githubId}?v=4&s=${120}`
  return (
    <Link href={`https://github.com/${githubId}`} target="_blank">
      <Row>
        <Image src={url} />
        <Typography variant="h4">{githubId}</Typography>
      </Row>
    </Link>
  )
}

const Volunteer = ({ name }) => {
  const url = `https://avatars.moe/Default/${md5(name)}/120.png`
  return (
    <Row>
      <Image src={url} />
      <Typography variant="h4">{name}</Typography>
    </Row>
  )
}

const AboutUsPage = props => {
  const { data } = props
  const { t } = useTranslation()

  return (
    <Layout>
      <SEO title="AboutUs" />
      <Typography variant="h2">{t("about_us.title")}</Typography>
      <PageContent>
        <Typography variant="h3">{t("about_us.volunteers")}</Typography>
        <Grid container spacing={1}>
          {data.configJson.credits.volunteers
            .sort((a, b) => (a > b ? 1 : -1))
            .map(item => (
              <Grid item xs={6} md={4} lg={3}>
                <Volunteer name={item} key={item} />
              </Grid>
            ))}
        </Grid>

        <Typography variant="h3">{t("about_us.contributors")}</Typography>
        <Grid container spacing={1}>
          {data.configJson.credits.contributors
            .sort((a, b) => (a > b ? 1 : -1))
            .map(item => (
              <Grid item xs={6} md={4} lg={3}>
                <Contributor githubId={item} key={item} />
              </Grid>
            ))}
        </Grid>
      </PageContent>
    </Layout>
  )
}

export default AboutUsPage

export const AboutUsQuery = graphql`
  query {
    configJson {
      credits {
        volunteers
        contributors
      }
    }
  }
`
