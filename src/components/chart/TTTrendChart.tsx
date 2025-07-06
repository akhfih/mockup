'use client'

import ReactECharts from 'echarts-for-react'
import React from 'react'

const TTTrendChart = () => {
    const option = {
        title: {
            text: 'TT Trend',
            left: 'left',
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            bottom: 0,
            data: ['Emergency', 'Critical', 'Major', 'POT'],
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['06/25', '06/26', '06/27', '06/28', '06/29', '06/30', '07/01', '07/02'],
        },
        yAxis: {
            type: 'value',
            name: 'Total       ',
        },
        series: [
            {
                name: 'Emergency',
                type: 'line',
                data: [2, 1, 1, 1, 1, 1, 2, 2],
                color: '#ef476f',
            },
            {
                name: 'Critical',
                type: 'line',
                data: [1, 2, 1, 2, 1, 2, 3, 1],
                color: '#f78c39',
            },
            {
                name: 'Major',
                type: 'line',
                data: [20, 18, 17, 23, 20, 21, 16, 11],
                color: '#ffd166',
            },
            {
                name: 'POT',
                type: 'line',
                data: [7, 6, 1, 12, 5, 5, 4, 5],
                color: '#6c757d',
            },
        ],
    }

    return <ReactECharts option={option} style={{ height: 250 }} />
}

export default TTTrendChart
