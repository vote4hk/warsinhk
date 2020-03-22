import React, { useRef, useState, useEffect, useLayoutEffect } from "react"
import ReactEcharts from "echarts-for-react";
import { useTranslation } from "react-i18next"

export default props => {

  const emphasisStyle = {
    itemStyle: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.5)'
    }
  }

 
  const data = props.data
  const colorMapping = {
    'imported': '#FF0000',
    'imported_close_contact': '#C87070',
    'local': '#2B7B7B',
    'local_close_contact': '#1BBBBB',
    'local_possibly': '#0055DD',
    'local_possibly_close_contact': '#0033EE'
  }   

  const { t } = useTranslation()
  const mapping = props.keys.map(k => ({k: t("epidemic." + k), d: data.map(d => d[k]), c: colorMapping[k]}))
  const keys = mapping.map(m => m.k)

  console.log(mapping)
  const xAxisData = data.map(x => x.label.substring(5))
  const series = mapping.map(d => ({
    name: d.k,
    type: 'bar',
    stack: 'one',
    emphasis: emphasisStyle,
    data: d.d,
    itemStyle: {
      color: d.c
    }
  }))
  
  console.log(series)
  const option = {
    backgroundColor: '',
    legend: {
        data: keys,
        left: 10
    },
    brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0
    },
    toolbox: {
      show: false
    },
    tooltip: {},
    xAxis: {
        data: xAxisData,
        name: t("epidemic.xAxis"),
        axisLine: {onZero: true},
        splitLine: {show: false},
        splitArea: {show: false}
    },
    yAxis: {
        splitArea: {show: false},
        name: t("epidemic.yAxis")
    },
    grid: {
      left: 30,
      top:100
    },
    series: series
  }


  const opts = {}

  const onChartReadyCallback = e => {}

  return (
    <ReactEcharts
      option={option}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
      onChartReady={onChartReadyCallback}
      //onEvents={EventsDict}
      opts={opts} />
  )
}

