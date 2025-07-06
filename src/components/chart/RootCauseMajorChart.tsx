'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

const RootCauseMajorChart = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const chart = echarts.init(chartRef.current);

        chart.setOption({
            title: { text: 'Root Cause Major', left: 'left' },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: {
                top: 25,
                data: [
                    '3rd Party', 'Battery', 'Access Issue', 'MCB',
                ],
            },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'category', data: ['06/25', '06/26', '06/27', '06/28', '06/29', '06/30', '07/01', '07/02'] },
            yAxis: { type: 'value' },
            series: [
                { name: '3rd Party', type: 'bar', stack: 'total', data: [3, 2, 3, 2, 2, 1, 1, 1] },
                { name: 'Battery', type: 'bar', stack: 'total', data: [1, 2, 1, 2, 1, 1, 1, 0] },
                { name: 'Access Issue', type: 'bar', stack: 'total', data: [2, 1, 3, 1, 2, 1, 1, 1] },
                { name: 'MCB', type: 'bar', stack: 'total', data: [1, 1, 1, 1, 2, 1, 0, 0] },

            ],
        });

        window.addEventListener('resize', () => chart.resize());
        return () => chart.dispose();
    }, []);

    return <div ref={chartRef} style={{ height: 250 }} />;
};

export default RootCauseMajorChart;
