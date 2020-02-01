import React from "react"
import { useTranslation } from "react-i18next"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import styled from "styled-components"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import Plot from "react-plotly.js"
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  age: {
    fontSize: 120,
    width: "100%",
    textAlign: "center",
  },
  ageUnit: {
    fontSize: 60,
  },
  ageGrid: {
    textAlign: "center",
  },
});

export default function ConfirmedCaseVisual(props) {
  const classes = useStyles()
  const { i18n, t } = useTranslation()
  const { data } = props
  let maleTotal = 0
  let femaleTotal = 0
  let otherTotal = 0
  let femaleAgeTotal = 0
  let maleAgeTotal = 0
  let citizenHongKong = 0
  let citizenWuhan = 0
  let citizenOthers = 0
  for (var i=0; i < data.length; i++) {
    const node = data[i].node
    const age = parseFloat(node.age)
    const gender = node.gender
    const citizenship = node.citizenship_en
    if (gender == "M") {
      maleTotal++
      maleAgeTotal += age
    } else if (gender == "F") {
      femaleTotal++
      femaleAgeTotal += age
    } else {
      otherTotal++
    }
    if (citizenship == "Hong Kong") {
      citizenHongKong++
    }else if (citizenship == "Wuhan") {
      citizenWuhan++
    }else {
      citizenOthers++
    }
  }
  const malePercentage = parseInt(maleTotal / (maleTotal + femaleTotal + otherTotal) * 100.0)
  const femalePercentage = parseInt(femaleTotal / (maleTotal + femaleTotal + otherTotal) * 100.0)
  const otherPercentage = parseInt(otherTotal / (maleTotal + femaleTotal + otherTotal) * 100.0)
  const maleAgeAverage = parseInt(maleAgeTotal / maleTotal)
  const femaleAgeAverage = parseInt(femaleAgeTotal / femaleTotal)
  const genderPlot = (
    <Card>
      <CardContent>
        <Typography variant="h1" align="center">
          {t("confirmed_case_visual.gender")}
        </Typography>
        <Plot
          data={[
            {type: "bar", 
             x: [maleTotal], 
             orientation:"h",
             name: t("dashboard.gender_male"),
             textposition: "inside",
             text:maleTotal + " / " + malePercentage + "% "},
            {type: "bar",
             x: [femaleTotal],
             orientation:"h",
             name: t("dashboard.gender_female"),
             textposition: "inside",
             text:femaleTotal + " / " + femalePercentage + "% "},
            {type: "bar",
             x: [otherTotal],
             orientation:"h",
             name: t("confirmed_case_visual.others"),
             textposition: "inside",
             text:otherTotal + " / " + otherPercentage + "% "},
 
          ]}
          layout={ {title: null,
                    font: {size: 24},
                    marign: {t: 0, l: 0, r: 0, b: 0},
                    barmode: 'stack',
                    hovermode: false,
                    xaxis: {showline:false,showgrid:false, zeroline:false, showticklabels:false}, 
                    yaxis: {showline:false, showgrid:false, zeroline:false, showticklabels:false},
                 }}
          style={{width: "100%"}}
          config={{displayModeBar:false,staticPlot:true}}
        />
      </CardContent>
    </Card>
  )
  const citizenPlot = (
    <Card>
      <CardContent>
        <Typography variant="h1" align="center">
          {t("confirmed_case_visual.citizen")}
        </Typography>
        <Plot
          data={[
            {type: "pie", 
             values:[citizenHongKong, citizenWuhan, citizenOthers],
             labels:[t("confirmed_case_visual.citizen_hongkong"), 
                     t("confirmed_case_visual.citizen_wuhan"), 
                     t("confirmed_case_visual.others")]},
          ]}
          layout={ {title: null,
                    font: {size: 28},
                    barmode: 'stack',
                    hovermode: false,
                    xaxis: {showline:false,showgrid:false, zeroline:false, showticklabels:false}, 
                    yaxis: {showline:false, showgrid:false, zeroline:false, showticklabels:false}
                 }} 
          style={{width: "100%"}}
          config={{displayModeBar:false,staticPlot:true}}
        />
      </CardContent>
    </Card>
  )
  return (
    <div container>
      <Grid container spacing={2}>
         <Grid item xs={4}> 
          {genderPlot}
         </Grid>
         <Grid item xs={4}>
           <Card style={{height: "100%"}}>
            <CardContent>
              <Typography variant="h1" align="center">
                {t("confirmed_case_visual.average_age")}
              </Typography>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
               <Grid container>
                <Grid item xs={6} className={classes.ageGrid}>
                  <Typography variant="h2" align="center">
                    {t("dashboard.gender_male")}
                  </Typography>
                  <br/>
                  <span className={classes.age}>{maleAgeAverage}</span>
                  <span className={classes.ageUnit}>{t("confirmed_case_visual.age_unit")}</span>
                </Grid>
                <Grid item xs={6} className={classes.ageGrid}>
                  <Typography variant="h2" align="center">
                    {t("dashboard.gender_female")}
                  </Typography>
                  <br/>
                  <span className={classes.age}>{femaleAgeAverage}</span>
                  <span className={classes.ageUnit}>{t("confirmed_case_visual.age_unit")}</span>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
         </Grid>
         <Grid item xs={4}>
           {citizenPlot}
         </Grid>
      </Grid>
    </div>
  )
}
