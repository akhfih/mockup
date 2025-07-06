'use client';

import { EChartsType, init } from 'echarts';
import {
    LineChart,
    LineSeriesOption,
} from 'echarts/charts';
import {
    GridComponent,
    GridComponentOption,
    LegendComponent,
    LegendComponentOption,
    TitleComponent,
    TitleComponentOption,
    TooltipComponent,
    TooltipComponentOption,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import React, { useEffect, useRef } from 'react';

echarts.use([
    TooltipComponent,
    LegendComponent,
    GridComponent,
    TitleComponent,
    LineChart,
    CanvasRenderer,
]);

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption |
    LegendComponentOption |
    GridComponentOption |
    TitleComponentOption |
    LineSeriesOption
>;

const MTTRTrendChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<EChartsType | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = init(chartRef.current);

            const option: EChartsOption = {
                title: {
                    text: 'MTTR Trend (Hrs)',
                    left: 'center',
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
                                    yAxis: 8,
                                    lineStyle: {
                                        type: 'dashed',
                                        color: '#D81B60',
                                    },
                                    label: {
                                        formatter: '8',
                                        position: 'end',
                                    },
                                },
                            ],
                        },
                    },
                ],
            };

            chartInstance.current.setOption(option);

            const resizeChart = () => {
                chartInstance.current?.resize();
            };

            window.addEventListener('resize', resizeChart);
            return () => {
                chartInstance.current?.dispose();
                window.removeEventListener('resize', resizeChart);
            };
        }
    }, []);

    return (
        <div
            ref={chartRef}
            style={{ width: '100%', height: '250px' }}
        />
    );
};

export default MTTRTrendChart;
