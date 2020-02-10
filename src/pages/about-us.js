import React from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { Typography, Link, Card } from "@material-ui/core"
import { graphql } from "gatsby"
import styled from "styled-components"
import * as md5 from "md5"

const Image = styled.img`
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
    <Link href={`https://github.com/${githubId}`}>
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
    <Link>
      <Row>
        <Image src={url} />
        <Typography variant="h4">{name}</Typography>
      </Row>
    </Link>
  )
}

const AboutUsPage = props => {
  const { data } = props
  const { t } = useTranslation()

  return (
    <Layout>
      <SEO title="AboutUs" />
      <Typography variant="h2">{t("about_us.volunteers")}</Typography>
      <Card>
        {data.configJson.credits.volunteers
          .sort((a, b) => (a > b ? 1 : -1))
          .map(item => (
            <Volunteer name={item} key={item} />
          ))}
      </Card>

      <Typography variant="h2">{t("about_us.contributors")}</Typography>
      <Card>
        {data.configJson.credits.contributors
          .sort((a, b) => (a > b ? 1 : -1))
          .map(item => (
            <Contributor githubId={item} key={item} />
          ))}
      </Card>
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
