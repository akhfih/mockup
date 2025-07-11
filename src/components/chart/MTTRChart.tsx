import { EChartsOption } from "echarts/types/dist/echarts";
import { EChart } from "../echart/EChart";

const option: EChartsOption = {
    title: {
        text: 'MTTE Trend (Min)',
        left: 'left',
    },
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        bottom: 0,
        data: ['Emergency', 'Critical', 'Major'],
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
        name: 'TOT',
    },
    series: [
        {
            name: 'Emergency',
            type: 'line',
            data: [7, 10, 6, 8, 11, 7, 8, 9],
            color: '#E91E63',
            markLine: {
                symbol: 'none',
                silent: true,
                data: [
                    {
                        yAxis: 7,
                        lineStyle: {
                            type: 'dashed',
                            color: '#D81B60',
                            width: 2,
                        },
                        label: {
                            formatter: '7',
                            position: 'end',
                            fontSize: 12,
                            color: '#D81B60',
                        },
                    },
                ],
            },
        },
        {
            name: 'Critical',
            type: 'line',
            data: [5, 6, 4, 5, 6, 4, 5, 6],
            color: '#FF9800',
        },
        {
            name: 'Major',
            type: 'line',
            data: [4, 5, 4, 5, 4, 5, 4, 5],
            color: '#FFC107',
        },
    ],
}

const MTTRChart: React.FC = () => {
    return (
        <EChart option={option} />
    );
}

export default MTTRChart;