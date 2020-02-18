import React from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import { Typography, Link, Button } from "@material-ui/core"
import { graphql } from "gatsby"
import styled from "styled-components"
import Grid from "@material-ui/core/Grid"
import { Paragraph } from "@components/atoms/Text"
import { SessionWrapper, SplitWrapper } from "@components/atoms/Container"
import { mapIcon } from "@components/icons"
import { FaFacebookF, FaGithubAlt } from "react-icons/fa"

const Image = styled.img`
  width: 64px;
  height: 64px;
  padding: 5px;
  margin-right: 10px;
  border-radius: 50px;
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
        <Typography variant="h5">{githubId}</Typography>
      </Row>
    </Link>
  )
}

const Volunteer = ({ siteUrl, item: { id, name } }) => {
  const baseUrl = `${siteUrl}/images/avatars`
  return (
    <Row>
      <Image
        src={`${baseUrl}/${id}.jpg`}
        onError={e => (e.target.src = `${baseUrl}/default.jpg`)}
      />
      <Typography variant="h5">{name}</Typography>
    </Row>
  )
}

const AboutUsPage = props => {
  const { data } = props
  const { t } = useTranslation()

  return (
    <Layout>
      <SEO title="AboutUsPage" />
      <SplitWrapper>
        <SessionWrapper>
          <Typography variant="h2" style={{ marginBottom: 16 }}>
            {t("about_us.title")}
          </Typography>
          <Paragraph
            dangerouslySetInnerHTML={{ __html: t("about_us.who_are_we_1") }}
          />
          <Paragraph
            dangerouslySetInnerHTML={{ __html: t("about_us.who_are_we_2") }}
          />
          <Paragraph
            dangerouslySetInnerHTML={{ __html: t("about_us.who_are_we_3") }}
          />
          <Paragraph
            dangerouslySetInnerHTML={{ __html: t("about_us.donation") }}
          />
          <Paragraph
            dangerouslySetInnerHTML={{ __html: t("about_us.who_are_we_4") }}
          />
          <Button
            style={{ marginTop: 8 }}
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<FaFacebookF size="0.8rem" />}
            onClick={() =>
              window.open("https://www.facebook.com/vote4hongkong/")
            }
          >
            {t("about_us.vote4hk_fb")}
          </Button>
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <Grid item md={6}>
              <Typography variant="h3" style={{ marginBottom: 8 }}>
                {t("about_us.g0vhk_title")}
              </Typography>
              <Paragraph
                dangerouslySetInnerHTML={{ __html: t("about_us.g0vhk_1") }}
              />
              <Button
                component="button"
                variant="outlined"
                color="primary"
                size="small"
                startIcon={mapIcon("attach_money")}
                onClick={() =>
                  window.open("https://www.collaction.hk/s/g0vhk/fund")
                }
              >
                {t("about_us.donate_g0vhk")}
              </Button>
            </Grid>
            <Grid item md={6}>
              <Typography variant="h3" style={{ marginBottom: 8 }}>
                {t("about_us.sooc_title")}
              </Typography>
              <Paragraph
                dangerouslySetInnerHTML={{ __html: t("about_us.sooc_1") }}
              />
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={mapIcon("attach_money")}
                onClick={() =>
                  window.open("https://www.collaction.hk/s/station")
                }
              >
                {t("about_us.donate_sooc")}
              </Button>
            </Grid>
          </Grid>
          <Paragraph
            dangerouslySetInnerHTML={{ __html: t("about_us.open_source") }}
            style={{ marginTop: 16 }}
          />
          <Paragraph
            dangerouslySetInnerHTML={{ __html: t("about_us.citation") }}
            style={{ marginTop: 16 }}
          />
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<FaGithubAlt />}
            onClick={() =>
              window.open("https://github.com/nandiheath/warsinhk")
            }
          >
            {t("about_us.github")}
          </Button>
        </SessionWrapper>
        <SessionWrapper>
          <Typography variant="h2">{t("about_us.volunteers")}</Typography>
          <Grid container spacing={1} style={{ marginTop: 8 }}>
            {data.configJson.credits.volunteers
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map(item => (
                <Grid item key={item.id} xs={6} md={4}>
                  <Volunteer
                    item={item}
                    siteUrl={data.site.siteMetadata.siteUrl}
                  />
                </Grid>
              ))}
          </Grid>
          <Typography variant="h2" style={{ marginTop: 16 }}>
            {t("about_us.contributors")}
          </Typography>
          <Grid container spacing={1} style={{ marginTop: 8 }}>
            {data.configJson.credits.contributors
              .sort((a, b) => (a > b ? 1 : -1))
              .map(item => (
                <Grid item xs={6} md={4} key={item}>
                  <Contributor githubId={item} />
                </Grid>
              ))}
          </Grid>
        </SessionWrapper>
      </SplitWrapper>
    </Layout>
  )
}

export default AboutUsPage

export const AboutUsQuery = graphql`
  query {
    configJson {
      credits {
        volunteers {
          id
          name
        }
        contributors
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`
