'use client'

import * as echarts from 'echarts'
import { debounce } from 'lodash'
import React, { useEffect, useMemo, useRef } from 'react'

interface EChartProps {
  option: echarts.EChartsOption
  chartSettings?: echarts.EChartsInitOpts
  optionSettings?: {
    notMerge?: boolean
    lazyUpdate?: boolean
    silent?: boolean
  }
  style?: React.CSSProperties
  events?: {
    [key: string]: (param: unknown) => void
  }
  [key: string]: unknown // for additional props like className, id, etc.
}

export const EChart: React.FC<EChartProps> = ({
  option,
  chartSettings = { useCoarsePointer: true },
  optionSettings = { notMerge: true },
  style = { width: '100%', height: '500px' },
  events,
  ...props
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  const resizeChart = useMemo(
    () =>
      debounce(() => {
        if (chartRef.current) {
          const chart = echarts.getInstanceByDom(chartRef.current)
          chart?.resize()
        }
      }, 100),
    []
  )

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current, 'undefined', chartSettings)

    if (events) {
      for (const [key, handler] of Object.entries(events)) {
        chart.on(key, (param) => {
          if (typeof handler === 'function') {
            handler(param)
          }
        })
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeChart()
    })

    resizeObserver.observe(chartRef.current)

    return () => {
      chart?.dispose()
      if (chartRef.current) {
        resizeObserver.unobserve(chartRef.current)
      }
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const chart = echarts.getInstanceByDom(chartRef.current!)
    chart?.setOption(option, optionSettings)
  }, [option])

  return <div ref={chartRef} style={style} {...props} />
}
