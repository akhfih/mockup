'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

const RootCauseEmergencyChart = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const chart = echarts.init(chartRef.current);

        chart.setOption({
            title: { text: 'Root Cause Emergency', left: 'center' },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { top: 25, data: ['3rd Party', 'Transmission'] },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'category', data: ['06/25', '06/26', '06/27'] },
            yAxis: { type: 'value' },
            series: [
                {
                    name: '3rd Party',
                    type: 'bar',
                    stack: 'total',
                    data: [0, 1, 0, 0, 0, 0, 0, 0],
                },
                {
                    name: 'Transmission',
                    type: 'bar',
                    stack: 'total',
                    data: [0, 0, 1, 0, 0, 0, 0, 0],
                },
            ],
        });

        window.addEventListener('resize', () => chart.resize());
        return () => chart.dispose();
    }, []);

    return <div ref={chartRef} style={{ height: 250 }} />;
};

export default RootCauseEmergencyChart;
