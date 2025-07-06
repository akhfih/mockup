'use client';

import ReactECharts from 'echarts-for-react';

const RootCauseEmergencyChart = () => {
    const option = {
        title: { text: 'Root Cause Emergency', left: 'left' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { top: 25, data: ['3rd Party', 'Transmission'] },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['06/25', '06/26', '06/27'],
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: '3rd Party',
                type: 'bar',
                stack: 'total',
                data: [0, 1, 0],
            },
            {
                name: 'Transmission',
                type: 'bar',
                stack: 'total',
                data: [0, 0, 1],
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 250 }} />;
};

export default RootCauseEmergencyChart;
