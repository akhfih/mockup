'use client';

import {
    LineChart,
} from 'echarts/charts';
import {
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
import React from 'react';

echarts.use([
    TooltipComponent,
    LegendComponent,
    GridComponent,
    TitleComponent,
    LineChart,
    CanvasRenderer,
]);

const MTTRTrendChart: React.FC = () => {
    const option = {
        title: {
            text: 'MTTR Trend (Hrs)',
            left: 'left',
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['Emergency', 'Critical', 'Major'],
            bottom: 0,
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
            name: 'Hours',
        },
        series: [
            {
                name: 'Emergency',
                type: 'line',
                data: [2, 2, 1, 6, 3, 2, 2, 2],
                color: '#E91E63',
            },
            {
                name: 'Critical',
                type: 'line',
                data: [3, 4, 4, 5, 3, 3, 4, 5],
                color: '#FF9800',
            },
            {
                name: 'Major',
                type: 'line',
                data: [4, 5, 6, 5, 4, 3, 3, 3],
                color: '#FFC107',
            },
            {
                name: 'Threshold',
                type: 'line',
                markLine: {
                    symbol: 'none',
                    data: [
                        {
                            yAxis: 3,
                            lineStyle: {
                                type: 'dashed',
                                color: '#D81B60',
                            },
                            label: {
                                formatter: '3',
                                position: 'end',
                                color: '#D81B60',
                            },
                        },
                    ],
                },
            },
        ],
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '250px', width: '100%' }}
        />
    );
};

export default MTTRTrendChart;
